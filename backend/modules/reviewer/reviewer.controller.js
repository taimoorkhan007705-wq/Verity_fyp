import Post from '../../models/Post.js'
import Reviewer from '../../models/Reviewer.js'
import { 
  getReviewerQueue, 
  getReviewerHistory, 
  processReviewerVote 
} from '../../services/reviewerAssignment.js'

/**
 * Get the reviewer's queue - posts awaiting their vote
 */
export const getMyQueue = async (req, res) => {
  try {
    const reviewerId = req.user.id
    const posts = await getReviewerQueue(reviewerId)
    
    res.json({ 
      success: true, 
      posts,
      count: posts.length
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviewer queue', 
      error: error.message 
    })
  }
}

/**
 * Get a specific post for review with full details
 */
export const getPostForReview = async (req, res) => {
  try {
    const { postId } = req.params
    const reviewerId = req.user.id

    const post = await Post.findById(postId)
      .populate('author', 'user_info.fullName email profile_info.avatar role')
      .populate('assignedReviewers', 'user_info.fullName reviewer_stats')
      .populate('reviewerVotes.reviewer', 'user_info.fullName')

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    // Check if reviewer is assigned to this post
    const isAssigned = post.assignedReviewers.some(r => r._id.toString() === reviewerId.toString())
    if (!isAssigned) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not assigned to review this post' 
      })
    }

    // Check if reviewer has already voted
    const hasVoted = post.reviewerVotes.some(v => v.reviewer._id.toString() === reviewerId.toString())

    res.json({ 
      success: true, 
      post,
      hasVoted,
      votingSummary: post.votingSummary
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch post', 
      error: error.message 
    })
  }
}

/**
 * Submit a vote on a post (approve or reject)
 */
export const voteOnPost = async (req, res) => {
  try {
    const { postId } = req.params
    const { vote, reasoning } = req.body
    const reviewerId = req.user.id

    console.log('[VoteOnPost] Received vote request:', {
      postId,
      vote,
      reviewerId,
      reasoning: reasoning?.substring(0, 50)
    })

    // Validate vote
    if (!vote || !['approve', 'reject'].includes(vote.toLowerCase())) {
      console.error('[VoteOnPost] Invalid vote value:', vote)
      return res.status(400).json({ 
        success: false, 
        message: 'Vote must be either "approve" or "reject"' 
      })
    }

    // Get post before voting to see current state
    const postBefore = await Post.findById(postId)
    if (!postBefore) {
      console.error('[VoteOnPost] Post not found:', postId)
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      })
    }

    console.log('[VoteOnPost] Post found:', {
      postId,
      isAssignedToReviewer: postBefore.assignedReviewers?.some(id => id.toString() === reviewerId.toString()),
      hasAlreadyVoted: postBefore.reviewerVotes?.some(v => v.reviewer?.toString() === reviewerId.toString()),
      totalAssignedReviewers: postBefore.assignedReviewers?.length,
      totalVotes: postBefore.reviewerVotes?.length
    })

    // Process the vote
    const result = await processReviewerVote(postId, reviewerId, vote, reasoning)

    console.log('[VoteOnPost] Vote processed successfully:', {
      postId,
      approveCount: result.approveCount,
      rejectCount: result.rejectCount,
      finalDecision: result.finalDecision
    })

    res.json({ 
      success: true, 
      ...result
    })
  } catch (error) {
    console.error('[VoteOnPost] Error:', {
      message: error.message,
      postId: req.params.postId,
      reviewerId: req.user.id
    })
    
    if (error.message.includes('not assigned') || error.message.includes('already voted')) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      })
    }
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process vote', 
      error: error.message 
    })
  }
}

/**
 * Get reviewer's history - posts they've already voted on
 */
export const getMyHistory = async (req, res) => {
  try {
    const reviewerId = req.user.id
    const limit = parseInt(req.query.limit) || 20
    
    const posts = await getReviewerHistory(reviewerId, limit)
    
    res.json({ 
      success: true, 
      posts,
      count: posts.length
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch review history', 
      error: error.message 
    })
  }
}

/**
 * Get reviewer's stats and performance metrics
 */
export const getMyStats = async (req, res) => {
  try {
    const reviewerId = req.user.id
    
    const reviewer = await Reviewer.findById(reviewerId)
      .select('reviewer_stats activity_tracking')

    if (!reviewer) {
      return res.status(404).json({ success: false, message: 'Reviewer not found' })
    }

    // Get additional stats
    const pendingPosts = await Post.countDocuments({
      assignedReviewers: reviewerId,
      verificationStatus: 'awaiting_review',
      'reviewerVotes.reviewer': { $ne: reviewerId }
    })

    res.json({ 
      success: true, 
      stats: {
        ...reviewer.reviewer_stats.toObject(),
        pendingInQueue: pendingPosts,
        lastActive: reviewer.activity_tracking.lastActive,
        lastReview: reviewer.activity_tracking.lastReviewAt
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviewer stats', 
      error: error.message 
    })
  }
}

/**
 * Get all posts awaiting review (for reviewer dashboard overview)
 */
export const getAllPendingReviews = async (req, res) => {
  try {
    const reviewerId = req.user.id
    
    const allPending = await Post.find({
      verificationStatus: 'awaiting_review'
    })
      .populate('author', 'user_info.fullName email profile_info.avatar')
      .populate('assignedReviewers', 'user_info.fullName')
      .sort({ createdAt: 1 })
      .limit(100)

    // Separate into my queue and others
    const myQueue = allPending.filter(post => 
      post.assignedReviewers.some(r => r._id.toString() === reviewerId.toString()) &&
      !post.reviewerVotes.some(v => v.reviewer.toString() === reviewerId.toString())
    )

    const otherPending = allPending.filter(post => 
      !post.assignedReviewers.some(r => r._id.toString() === reviewerId.toString())
    )

    res.json({ 
      success: true, 
      myQueue,
      myQueueCount: myQueue.length,
      totalPending: allPending.length,
      otherPending: otherPending.length
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending reviews', 
      error: error.message 
    })
  }
}


