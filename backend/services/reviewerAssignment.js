import Reviewer from '../models/Reviewer.js'
import Post from '../models/Post.js'
import Notification from '../models/Notification.js'

/**
 * Assign all active reviewers to a post
 * Ensures every active reviewer receives awaiting-review posts
 * and only increments pending counts for newly assigned reviewers
 * 
 * @param {string} postId - The post ID to assign reviewers to
 * @returns {Promise<Array>} - Array of assigned reviewer IDs
 */
export const assignReviewersToPost = async (postId) => {
  try {
    const post = await Post.findById(postId)

    if (!post) {
            return []
    }

    const reviewers = await Reviewer.find({
      'trust_security.isActive': true
    })
      .sort({ 'reviewer_stats.reviewsPending': 1 })
      .select('_id user_info.fullName reviewer_stats.reviewsPending')

    if (reviewers.length === 0) {
            return []
    }

    const allReviewerIds = reviewers.map(r => r._id)
    const currentAssignedIds = (post.assignedReviewers || []).map(id => id.toString())
    const newReviewerIds = reviewers
      .filter(reviewer => !currentAssignedIds.includes(reviewer._id.toString()))
      .map(reviewer => reviewer._id)

    if (currentAssignedIds.length === allReviewerIds.length && newReviewerIds.length === 0) {
            return post.assignedReviewers
    }

    post.assignedReviewers = allReviewerIds
    post.verificationStatus = 'awaiting_review'
    await post.save()

    for (const reviewer of reviewers) {
      if (!newReviewerIds.some(id => id.toString() === reviewer._id.toString())) {
        continue
      }

      await Reviewer.findByIdAndUpdate(reviewer._id, {
        $inc: { 'reviewer_stats.reviewsPending': 1 }
      })

      await Notification.create({
        user: reviewer._id,
        userModel: 'Reviewer',
        type: 'review_assignment',
        title: '📋 New Post to Review',
        message: 'You have been assigned a new post to review. Please check your reviewer queue.',
        relatedPost: postId
      })
    }

        return allReviewerIds

  } catch (error) {
        return []
  }
}

/**
 * Ensure all awaiting-review posts are assigned to every active reviewer
 * This is a maintenance helper to backfill existing pending posts
 * after assignment rules change or when reviewers are added/activated.
 *
 * @returns {Promise<Object>} - Summary with total posts checked and updated posts
 */
export const syncAwaitingReviewAssignments = async () => {
  const reviewers = await Reviewer.find({
        'trust_security.isActive': true
  }).select('_id')

  if (reviewers.length === 0) {
        return { totalPendingPosts: 0, updatedPosts: 0 }
  }

  const allReviewerIds = reviewers.map(r => r._id)
  const pendingPosts = await Post.find({ verificationStatus: 'awaiting_review' })
  let updatedPosts = 0

  for (const post of pendingPosts) {
        const currentAssignedIds = (post.assignedReviewers || []).map(id => id.toString())
        const needUpdate = allReviewerIds.some(id => !currentAssignedIds.includes(id.toString()))
          || currentAssignedIds.length !== allReviewerIds.length

        if (needUpdate) {
          post.assignedReviewers = allReviewerIds
          await post.save()
          updatedPosts += 1
        }
  }

  return { totalPendingPosts: pendingPosts.length, updatedPosts }
}

/**
 * Process a reviewer's vote on a post
 * Implements 2-vote majority system (2 approve → publish, 2 reject → reject)
 * 
 * @param {string} postId - The post ID being voted on
 * @param {string} reviewerId - The reviewer's ID
 * @param {string} vote - 'approve' or 'reject'
 * @param {string} reasoning - Optional reasoning for the vote
 * @returns {Promise<Object>} - Result with decision status
 */
export const processReviewerVote = async (postId, reviewerId, vote, reasoning = '') => {
  try {
    const post = await Post.findById(postId).populate('author', 'user_info.fullName email')
    
    if (!post) {
      throw new Error('Post not found')
    }

    console.log('[ProcessVote] Checking assignment:', {
      postId,
      reviewerId,
      assignedReviewers: post.assignedReviewers?.map(id => id.toString()),
      isAssigned: post.assignedReviewers?.some(id => id.toString() === reviewerId.toString())
    })

    // Check if reviewer is assigned to this post
    const isAssigned = post.assignedReviewers?.some(id => id.toString() === reviewerId.toString())
    if (!isAssigned) {
      console.error('[ProcessVote] Reviewer not assigned to post:', { postId, reviewerId })
      throw new Error('Reviewer not assigned to this post')
    }

    // Check if reviewer has already voted
    const existingVote = post.reviewerVotes?.find(v => v.reviewer?.toString() === reviewerId.toString())
    if (existingVote) {
      console.error('[ProcessVote] Reviewer already voted:', { postId, reviewerId })
      throw new Error('Reviewer has already voted on this post')
    }

    // Add the vote
    post.reviewerVotes.push({
      reviewer: reviewerId,
      vote: vote.toLowerCase(),
      reasoning,
      votedAt: new Date()
    })

    // Update vote summary
    const approveCount = post.reviewerVotes.filter(v => v.vote === 'approve').length
    const rejectCount = post.reviewerVotes.filter(v => v.vote === 'reject').length
    const totalVotes = post.reviewerVotes.length

    post.votingSummary.approveCount = approveCount
    post.votingSummary.rejectCount = rejectCount
    post.votingSummary.totalVotes = totalVotes

    let finalDecision = null
    let notifyUser = false

    // Log the current vote state for debugging
            console.log(`[ReviewerVote] DEBUG - All votes on post:`, post.reviewerVotes.map(v => ({ voter: v.reviewer, vote: v.vote })))

    // CRITICAL: Only make a decision if we have AT LEAST 2 total votes
    // This prevents single votes from deciding the outcome
    if (totalVotes < 2) {
      // Not enough votes yet - don't make a decision
      post.votingSummary.finalDecision = 'pending'
      console.log(`[ReviewerVote] ⏳ Post ${postId} - Only ${totalVotes} vote(s). Need at least 2 votes to decide. Current: ${approveCount} approve, ${rejectCount} reject`)
      
      // Update the voting reviewer's stats - INCREMENT REVIEW COUNT
      await Reviewer.findByIdAndUpdate(reviewerId, {
        $inc: { 
          'reviewer_stats.reviewsCompleted': 1,  // Always count the vote
          'reviewer_stats.reviewsPending': -1
        },
        'activity_tracking.lastReviewAt': new Date()
      })
      
      await post.save()
      
      return {
        success: true,
        finalDecision: null,
        approveCount,
        rejectCount,
        totalVotes,
        message: `Vote recorded! Current: ${approveCount} approve, ${rejectCount} reject. Need ${3 - totalVotes} more vote(s) to make a decision.`
      }
    }

    // Check if we have a majority (2 votes for approval OR 2 votes for rejection)
    // IMPORTANT: Need 2 votes (out of 3) to make a final decision
    if (approveCount >= 2) {
      // 2+ APPROVE → Post goes live immediately
      post.verificationStatus = 'approved'
      post.votingSummary.finalDecision = 'approved'
      post.votingSummary.decidedAt = new Date()
      finalDecision = 'approved'
      notifyUser = true

      console.log(`[ReviewerVote] ✅ Post ${postId} APPROVED (${approveCount} approve votes)`)
      
      // Update reviewer stats for all who voted
      for (const voteEntry of post.reviewerVotes) {
        // If reviewer voted 'approve' and decision is 'approved' → they voted correctly!
        const votedCorrectly = voteEntry.vote === 'approve'
        const trustScoreIncrease = votedCorrectly ? 5 : -2 // +5 for correct vote, -2 for incorrect
        
        console.log(`[ReviewerVote] Reviewer ${voteEntry.reviewer} vote: ${voteEntry.vote}, Correct: ${votedCorrectly}, Trust change: ${trustScoreIncrease}`)
        
        await Reviewer.findByIdAndUpdate(voteEntry.reviewer, {
          $inc: { 
            'reviewer_stats.reviewsCompleted': 1,
            'reviewer_stats.reviewsPending': -1,
            'reviewer_stats.approvedCount': voteEntry.vote === 'approve' ? 1 : 0,
            'trust_security.trustScore': trustScoreIncrease  // Increase or decrease trust score
          },
          'activity_tracking.lastReviewAt': new Date()
        })
      }

    } else if (rejectCount >= 2) {
      // 2+ REJECT → Post is rejected immediately
      post.verificationStatus = 'rejected'
      post.votingSummary.finalDecision = 'rejected'
      post.votingSummary.decidedAt = new Date()
      post.reviewNotes = post.reviewerVotes
        .filter(v => v.vote === 'reject' && v.reasoning)
        .map(v => v.reasoning)
        .join('; ')
      finalDecision = 'rejected'
      notifyUser = true

      console.log(`[ReviewerVote] ❌ Post ${postId} REJECTED (${rejectCount} reject votes)`)
      
      // Update reviewer stats for all who voted
      for (const voteEntry of post.reviewerVotes) {
        // If reviewer voted 'reject' and decision is 'rejected' → they voted correctly!
        const votedCorrectly = voteEntry.vote === 'reject'
        const trustScoreIncrease = votedCorrectly ? 5 : -2 // +5 for correct vote, -2 for incorrect
        
        console.log(`[ReviewerVote] Reviewer ${voteEntry.reviewer} vote: ${voteEntry.vote}, Correct: ${votedCorrectly}, Trust change: ${trustScoreIncrease}`)
        
        await Reviewer.findByIdAndUpdate(voteEntry.reviewer, {
          $inc: { 
            'reviewer_stats.reviewsCompleted': 1,
            'reviewer_stats.reviewsPending': -1,
            'reviewer_stats.rejectedCount': voteEntry.vote === 'reject' ? 1 : 0,
            'trust_security.trustScore': trustScoreIncrease  // Increase or decrease trust score
          },
          'activity_tracking.lastReviewAt': new Date()
        })
      }

    } else {
      // Still waiting for more votes
      post.votingSummary.finalDecision = 'pending'
      
      // Update the voting reviewer's stats - INCREMENT REVIEW COUNT
      await Reviewer.findByIdAndUpdate(reviewerId, {
        $inc: { 
          'reviewer_stats.reviewsCompleted': 1  // Count the vote even if pending
        },
        'activity_tracking.lastReviewAt': new Date()
      })
    }

    await post.save()

    // Notify the post author if decision is final
    if (notifyUser && post.author) {
      const message = finalDecision === 'approved'
        ? '✅ Your post has been approved by our reviewers and is now live!'
        : `❌ Your post has been rejected by our reviewers. Reason: ${post.reviewNotes || 'Content violates community guidelines'}`

      await Notification.create({
        user: post.author._id,
        userModel: post.authorModel,
        type: finalDecision === 'approved' ? 'post_approved' : 'post_rejected',
        title: finalDecision === 'approved' ? 'Post Approved' : 'Post Rejected',
        message,
        relatedPost: postId
      })
    }

    return {
      success: true,
      finalDecision,
      approveCount,
      rejectCount,
      totalVotes,
      message: finalDecision 
        ? (finalDecision === 'approved' ? '✅ Post APPROVED by reviewers!' : '❌ Post REJECTED by reviewers!')
        : `Vote recorded! Current: ${approveCount} approve, ${rejectCount} reject. Waiting for ${3 - totalVotes} more vote(s).`
    }

  } catch (error) {
        throw error
  }
}

/**
 * Get the reviewer queue for a specific reviewer
 * Returns posts assigned to them that are awaiting their vote
 * 
 * @param {string} reviewerId - The reviewer's ID
 * @returns {Promise<Array>} - Array of posts awaiting review
 */
export const getReviewerQueue = async (reviewerId) => {
  try {
    const posts = await Post.find({
      assignedReviewers: reviewerId,
      verificationStatus: 'awaiting_review'
    })
      .populate('author', 'user_info.fullName email profile_info.avatar trust_security.trustScore social_stats.postsCount')
      .sort({ createdAt: 1 })
      .limit(50)
    const filtered = posts.filter(p => !p.reviewerVotes.some(v => v.reviewer?.toString() === reviewerId.toString()))
        return filtered
  } catch (error) {
        throw error
  }
}

export const getReviewerHistory = async (reviewerId, limit = 20) => {
  try {
    const posts = await Post.find({
      'reviewerVotes.reviewer': reviewerId
    })
      .populate('author', 'user_info.fullName email profile_info.avatar role')
      .sort({ 'votingSummary.decidedAt': -1 })
      .limit(limit)

    return posts

  } catch (error) {
        throw error
  }
}



