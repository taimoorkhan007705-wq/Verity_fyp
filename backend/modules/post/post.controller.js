import Post from '../../models/Post.js'
import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
import Notification from '../../models/Notification.js'
import path from 'path'
import { checkMediaWithAI } from '../../services/aiDetection.js'
import { isNewsClaim } from '../../services/ocrService.js'
import { factCheckWithMistral, interpretFactCheck } from '../../services/factCheckService.js'
import { classifyPostCategory, quickCategoryGuess } from '../../services/categoryClassifier.js'
import { detectFakeContent } from '../../services/fakeContentDetector.js'
import { assignReviewersToPost } from '../../services/reviewerAssignment.js'

const getModelByRole = (role) => {
  const models = { Reviewer, Business, User }
  return models[role] || User
}

// Background AI processing function
const processPostAI = async (postId, mediaFiles, captionText) => {
  try {
    console.log('[ProcessPostAI] 🔄 Starting AI processing for post:', { postId, hasMedia: mediaFiles.length > 0, textLength: captionText.length })
    
    let verificationStatus = 'pending'
    let aiRejectionReason = null
    let collectedExtractedText = ''
    let pendingReason = ''
    let aiDetectionScore = 0
    let aiDetectionVerdict = 'safe'

    // ═══════════════════════════════════════════════════════════════
    // STEP 0: AI Category Classification (always runs, non-blocking)
    // ═══════════════════════════════════════════════════════════════
    try {
      const categoryResult = await classifyPostCategory(captionText, mediaFiles)
      const post = await Post.findById(postId)
      if (post) {
        // Preserve user-selected categories; only overwrite category if it was auto-guessed
        if (post.categoryConfidence < 1) {
          post.category = categoryResult.category
          post.categoryConfidence = categoryResult.confidence
          post.categoryReasoning = categoryResult.reasoning
          await post.save()
          console.log('[ProcessPostAI] ✅ Category classified:', categoryResult.category)
        } else {
          // Category already set by user, skip auto-classification
        }
      }
    } catch (categoryError) {
      console.log('[ProcessPostAI] ⚠️  Category classification skipped:', categoryError.message)
      // Continue with moderation even if categorization fails
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 1: FAKE CONTENT DETECTION (New Priority Check)
    // ═══════════════════════════════════════════════════════════════
    console.log('[ProcessPostAI] 🔍 Running fake content detection...')
    const fakeDetectionResult = await detectFakeContent(captionText, mediaFiles)
    
    console.log('[ProcessPostAI] Detection result:', {
      verdict: fakeDetectionResult.verdict,
      score: fakeDetectionResult.score,
      reason: fakeDetectionResult.reason
    })
    
    aiDetectionScore = fakeDetectionResult.score
    aiDetectionVerdict = fakeDetectionResult.verdict === 'fake' ? 'fake' 
      : fakeDetectionResult.isAIGenerated ? 'ai_generated'
      : fakeDetectionResult.verdict === 'suspicious' ? 'suspicious'
      : 'safe'

    // IMMEDIATE REJECTION: Fake or highly misleading content
    if (fakeDetectionResult.verdict === 'fake') {
      console.log('[ProcessPostAI] ❌ POST AI REJECTED:', { postId, reason: fakeDetectionResult.reason })
      verificationStatus = 'ai_rejected'
      aiRejectionReason = fakeDetectionResult.reason
      
      const post = await Post.findById(postId).populate('author', 'email user_info.fullName')
      if (post) {
        post.verificationStatus = verificationStatus
        post.aiRejectionReason = aiRejectionReason
        post.aiDetectionScore = aiDetectionScore
        post.aiDetectionVerdict = aiDetectionVerdict
        post.reviewNotes = `AI Auto-Rejection: ${aiRejectionReason}`
        await post.save()
        
        // Notify user immediately
        await Notification.create({
          user: post.author._id,
          userModel: post.authorModel,
          type: 'post_rejected',
          title: '❌ Post Rejected by AI',
          message: `Your post was automatically rejected. Reason: ${aiRejectionReason}`,
          relatedPost: postId
        })
        
              }
      return // Stop processing - post is rejected
    }

    // SEND TO REVIEWERS: Suspicious content or flagged by AI
    if (fakeDetectionResult.verdict === 'suspicious' || fakeDetectionResult.isAIGenerated) {
      verificationStatus = 'awaiting_review'
      pendingReason = fakeDetectionResult.reason
      
      const post = await Post.findById(postId)
      if (post) {
        post.verificationStatus = verificationStatus
        post.pendingReason = pendingReason
        post.aiDetectionScore = aiDetectionScore
        post.aiDetectionVerdict = aiDetectionVerdict
        await post.save()
        
        // Assign all active reviewers to this post
        await assignReviewersToPost(postId)
              }
      return // Stop here - post is now in reviewer queue
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: Additional Media Moderation (Sightengine checks)
    // ═══════════════════════════════════════════════════════════════
        for (const item of mediaFiles) {
      const result = await checkMediaWithAI(item._localPath, item._mimeType)
            if (result.extractedText) {
        collectedExtractedText += (collectedExtractedText ? ' | ' : '') + result.extractedText
      }

      if (result.verdict === 'rejected') {
        // Explicit/offensive content → auto-reject
        verificationStatus = 'ai_rejected'
        aiRejectionReason = result.reason
        
        const post = await Post.findById(postId).populate('author', 'email user_info.fullName')
        if (post) {
          post.verificationStatus = verificationStatus
          post.aiRejectionReason = aiRejectionReason
          post.reviewNotes = `AI Auto-Rejection: ${result.reason}`
          post.extractedText = collectedExtractedText
          await post.save()
          
          // Notify user
          await Notification.create({
            user: post.author._id,
            userModel: post.authorModel,
            type: 'post_rejected',
            title: '❌ Post Rejected by AI',
            message: `Your post was automatically rejected. Reason: ${result.reason}`,
            relatedPost: postId
          })
          
                  }
        return
      } else if (result.verdict === 'pending') {
        // Uncertain content → send to reviewers
        verificationStatus = 'awaiting_review'
        pendingReason = result.reason
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 3: Final Decision
    // ═══════════════════════════════════════════════════════════════
    const post = await Post.findById(postId)
    if (post) {
      if (verificationStatus === 'awaiting_review') {
        // Send to reviewer queue
        post.verificationStatus = verificationStatus
        post.pendingReason = pendingReason
        post.extractedText = collectedExtractedText || undefined
        post.aiDetectionScore = aiDetectionScore
        post.aiDetectionVerdict = aiDetectionVerdict
        await post.save()
        
        await assignReviewersToPost(postId)
              } else {
        // All checks passed → approve immediately
        post.verificationStatus = 'approved'
        post.aiDetectionScore = aiDetectionScore
        post.aiDetectionVerdict = 'safe'
        post.extractedText = collectedExtractedText || undefined
        await post.save()
              }
    }
  } catch (error) {
    console.error('[ProcessPostAI] 🔥 Critical error during AI processing:', {
      postId,
      error: error.message
    })
    
    // If AI check fails, send to reviewers for manual review
    try {
      const post = await Post.findById(postId)
      if (post && post.verificationStatus === 'pending') {
        post.verificationStatus = 'awaiting_review'
        post.pendingReason = 'AI check failed - manual review required'
        await post.save()
        await assignReviewersToPost(postId)
        console.log('[ProcessPostAI] ✅ Fallback: Post sent to reviewers due to AI error')
      }
    } catch (fallbackError) {
      console.error('[ProcessPostAI] 🔥 Fallback handler failed:', fallbackError.message)
    }
  }
}

export const createPost = async (req, res) => {
  try {
    const { content, hashtags, visibility, category } = req.body
    const userId = req.user.id
    const userRole = req.user.role

    console.log('[CreatePost] 📝 Received post creation request:', {
      hasFiles: !!req.files,
      fileCount: req.files?.length || 0,
      content: content?.substring(0, 50),
      category,
      userId
    })

    const media = req.files ? req.files.map(file => {
      console.log('[CreatePost] 🖼️  Processing file:', {
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      })
      return {
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        url: `/uploads/users/${userId}/posts/${file.filename}`,
        _localPath: file.path,
        _mimeType: file.mimetype
      }
    }) : []

    console.log('[CreatePost] 📦 Processed media count:', media.length)

    // Quick category guess for immediate response if the user didn't choose one
    const initialCategory = quickCategoryGuess(content)
    const allowedCategories = ['Sports', 'News', 'Trending', 'Entertainment', 'Food', 'Other']
    const selectedCategory = allowedCategories.includes(category) ? category : initialCategory
    const categorySource = allowedCategories.includes(category) ? 'User selected category' : 'Quick keyword-based classification'

    // For text-only posts, approve immediately
    // For media posts, send straight to reviewer queue so the dashboard can show them
    // For admin posts, always approve immediately - no verification needed
    const verificationStatus = userRole === 'Admin' ? 'approved' : (media.length > 0 ? 'awaiting_review' : 'approved')

    // strip internal fields before saving
    const cleanMedia = media.map(({ _localPath, _mimeType, ...rest }) => rest)

    const post = await Post.create({
      author: userId,
      authorModel: userRole,
      content,
      media: cleanMedia,
      hashtags: hashtags ? JSON.parse(hashtags) : [],
      category: selectedCategory,
      categoryConfidence: allowedCategories.includes(category) ? 1 : 0.5,
      categoryReasoning: allowedCategories.includes(category) ? categorySource : 'Quick keyword-based classification',
      visibility: visibility || 'public',
      verificationStatus,
      pendingReason: media.length > 0 ? 'AI verification in progress...' : undefined
    })

    console.log('[CreatePost] ✅ Post created:', { postId: post._id, verificationStatus })

    await post.populate('author', 'user_info.fullName email profile_info.avatar role')

    // Immediately assign all active reviewers for media posts so they appear in the reviewer queue
    // But skip for admin posts - they don't need review
    if (media.length > 0 && userRole !== 'Admin') {
      console.log('[CreatePost] 👥 Assigning reviewers to media post...')
      await assignReviewersToPost(post._id)
    }

    // Run AI checks in background (non-blocking) - includes category classification
    // But skip for admin posts - they don't need verification
    if ((media.length > 0 || content) && userRole !== 'Admin') {
      console.log('[CreatePost] 🤖 Triggering background AI processing...')
      // Don't await - let it run in background
      processPostAI(post._id, media, content).catch(err => {
        console.error('[CreatePost] Background AI processing error:', err.message)
      })
    }

    const message = userRole === 'Admin' 
      ? 'Admin post published successfully - no verification required!'
      : media.length > 0 
        ? 'Your media post has been sent to the reviewer queue for verification.'
        : 'Post published successfully!'

    res.status(201).json({
      success: true,
      message,
      verificationStatus,
      post
    })
  } catch (error) {
    console.error('[CreatePost] ❌ Error creating post:', error)
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message })
  }
}

export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query
    
    const query = { 
      visibility: 'public',
      verificationStatus: 'approved'
    }
    
    // Filter by category if provided and not "All"
    if (category && category !== 'All') {
      query.category = category
    }
    // "All" shows all categories
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'user_info.fullName email profile_info.avatar role')
    
    // Manually populate comments for each post
    const Reviewer = (await import('../../models/Reviewer.js')).default
    const Business = (await import('../../models/Business.js')).default
    const User = (await import('../../models/User.js')).default
    
    for (let post of posts) {
      for (let comment of post.comments) {
        if (comment.userModel === 'Reviewer') {
          comment.user = await Reviewer.findById(comment.user).select('user_info profile_info')
        } else if (comment.userModel === 'Business') {
          comment.user = await Business.findById(comment.user).select('user_info profile_info')
        } else {
          // User and Admin
          comment.user = await User.findById(comment.user).select('user_info profile_info')
        }
      }
    }
    
    const count = await Post.countDocuments(query)
    
    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch feed', error: error.message })
  }
}
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'user_info.fullName email profile_info.avatar role')
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    
    // Manually populate comments for this post
    const Reviewer = (await import('../../models/Reviewer.js')).default
    const Business = (await import('../../models/Business.js')).default
    const User = (await import('../../models/User.js')).default
    
    for (let comment of post.comments) {
      if (comment.userModel === 'Reviewer') {
        comment.user = await Reviewer.findById(comment.user).select('user_info profile_info')
      } else if (comment.userModel === 'Business') {
        comment.user = await Business.findById(comment.user).select('user_info profile_info')
      } else {
        // User and Admin
        comment.user = await User.findById(comment.user).select('user_info profile_info')
      }
    }
    
    res.json({ success: true, post })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch post', error: error.message })
  }
}
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    const userId = req.user.id
    const userRole = req.user.role
    const likeIndex = post.likes.findIndex(like => like.user.toString() === userId)
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1)
    } else {
      post.likes.push({ user: userId, userModel: userRole })
    }
    await post.save()
    res.json({ success: true, likes: post.likes.length })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like post', error: error.message })
  }
}
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body
    
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' })
    }
    
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    
    // Import profanity filter
    const { filterProfanity } = await import('../utils/profanityFilter.js')
    
    // Filter the comment text for profanity
    const filteredText = filterProfanity(text.trim())
    
    // Add comment to post
    post.comments.push({
      user: req.user._id,
      userModel: req.user.role,
      text: filteredText
    })
    
    // Increment comments count
    post.commentsCount = post.comments.length
    
    await post.save()
    
    // Manually populate comments with proper model handling
    const populatedPost = await Post.findById(req.params.id)
    
    // Populate all comments with user info from appropriate models
    const Reviewer = (await import('../../models/Reviewer.js')).default
    const Business = (await import('../../models/Business.js')).default
    const User = (await import('../../models/User.js')).default
    
    for (let comment of populatedPost.comments) {
      if (comment.userModel === 'Reviewer') {
        comment.user = await Reviewer.findById(comment.user).select('user_info profile_info')
      } else if (comment.userModel === 'Business') {
        comment.user = await Business.findById(comment.user).select('user_info profile_info')
      } else {
        // User and Admin
        comment.user = await User.findById(comment.user).select('user_info profile_info')
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Comment posted successfully',
      comments: populatedPost.comments,
      commentsCount: populatedPost.commentsCount
    })
  } catch (error) {
    console.error('Comment error:', error)
    res.status(500).json({ success: false, message: 'Failed to comment', error: error.message })
  }
}
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    await post.deleteOne()
    res.json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post', error: error.message })
  }
}

export const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })
    const userId = req.user.id
    const userRole = req.user.role
    const alreadyShared = post.shares.find(s => s.user.toString() === userId)
    if (!alreadyShared) {
      post.shares.push({ user: userId, userModel: userRole })
      post.sharesCount = post.shares.length
      await post.save()
    }
    res.json({ success: true, shares: post.shares.length })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to share post', error: error.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id
    const posts = await Post.find({ author: userId, isDeleted: false, verificationStatus: 'approved' })
      .sort({ createdAt: -1 })
      .populate('author', 'user_info.fullName email profile_info.avatar role')
    res.json({ success: true, posts })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch posts', error: error.message })
  }
}

export const getMyRejectedPosts = async (req, res) => {
  try {
    const userId = req.user.id
    const posts = await Post.find({ author: userId, isDeleted: false, verificationStatus: 'rejected' })
      .sort({ createdAt: -1 })
    res.json({ success: true, posts })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch rejected posts', error: error.message })
  }
}

export const getMyPendingPosts = async (req, res) => {
  try {
    const userId = req.user.id
    const posts = await Post.find({ author: userId, isDeleted: false, verificationStatus: 'pending' })
      .sort({ createdAt: -1 })
    res.json({ success: true, posts })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending posts', error: error.message })
  }
}

export const checkPostStatus = async (req, res) => {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    // Only allow author to check their own post status
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.json({
      success: true,
      status: post.verificationStatus,
      reason: post.reviewNotes || post.pendingReason || null,
      extractedText: post.extractedText || null
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check post status', error: error.message })
  }
}


