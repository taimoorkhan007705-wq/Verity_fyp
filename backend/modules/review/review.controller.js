import Review from '../../models/Review.js'
import Post from '../../models/Post.js'
export const getPendingReviews = async (req, res) => {
  try {
    const reviewerId = req.user.id
    const posts = await Post.find({ 
      verificationStatus: 'pending',
      author: { $ne: reviewerId } // Exclude reviewer's own posts
    })
      .populate('author', 'user_info.fullName email profile_info.avatar role')
      .sort({ createdAt: -1 })
    const groupedPosts = {}
    posts.forEach(post => {
      const authorId = post.author._id.toString()
      if (!groupedPosts[authorId]) {
        groupedPosts[authorId] = {
          author: {
            _id: post.author._id,
            fullName: post.author.user_info?.fullName || post.author.fullName,
            email: post.author.email,
            avatar: post.author.profile_info?.avatar || post.author.avatar,
            role: post.author.role
          },
          posts: [],
          totalPosts: 0
        }
      }
      groupedPosts[authorId].posts.push({
        _id: post._id,
        content: post.content,
        media: post.media.map(m => m.url),
        hashtags: post.hashtags,
        createdAt: post.createdAt,
        verificationStatus: post.verificationStatus
      })
      groupedPosts[authorId].totalPosts++
    })
    const groupedArray = Object.values(groupedPosts).sort((a, b) => b.totalPosts - a.totalPosts)
    res.json({ 
      success: true, 
      groupedPosts: groupedArray,
      totalAuthors: groupedArray.length,
      totalPosts: posts.length
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message })
  }
}
export const submitReview = async (req, res) => {
  try {
    const { postId, verdict, notes, confidence, sources, tags } = req.body
    const reviewerId = req.user.id
    if (req.user.role !== 'Reviewer') {
      return res.status(403).json({ success: false, message: 'Only reviewers can submit reviews' })
    }
    const post = await Post.findById(postId).populate('author')
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    if (post.author._id.toString() === reviewerId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You cannot review your own posts. This post will be assigned to another reviewer.' 
      })
    }
    const review = await Review.create({
      post: postId,
      reviewer: reviewerId,
      verdict,
      notes,
      confidence,
      sources: sources || [],
      tags: tags || [],
      status: 'approved'
    })
    if (verdict === 'verified') {
      post.verificationStatus = 'approved'
      post.isVerified = true
    } else {
      post.verificationStatus = 'rejected'
      post.isVerified = false
    }
    post.reviewedBy = reviewerId
    post.reviewedAt = new Date()
    await post.save()
    res.status(201).json({ 
      success: true, 
      message: `Post ${verdict === 'verified' ? 'approved' : 'rejected'} successfully`, 
      review 
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message })
  }
}
export const getReviewerStats = async (req, res) => {
  try {
    const reviewerId = req.user.id
    const totalReviews = await Review.countDocuments({ reviewer: reviewerId })
    const approvedReviews = await Review.countDocuments({ 
      reviewer: reviewerId, 
      verdict: 'verified' 
    })
    const rejectedReviews = await Review.countDocuments({ 
      reviewer: reviewerId, 
      verdict: { $in: ['false', 'misleading', 'needs-context'] }
    })
    const pendingReviews = await Post.countDocuments({ 
      verificationStatus: 'pending',
      author: { $ne: reviewerId }
    })
    res.json({
      success: true,
      stats: {
        totalReviews,
        approvedReviews,
        rejectedReviews,
        pendingReviews,
        accuracy: totalReviews > 0 ? Math.round((approvedReviews / totalReviews) * 100) : 0
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message })
  }
}
export const getReviewHistory = async (req, res) => {
  try {
    const reviewerId = req.user.id
    const reviews = await Review.find({ reviewer: reviewerId })
      .populate('post')
      .sort({ createdAt: -1 })
    res.json({ success: true, reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history', error: error.message })
  }
}
