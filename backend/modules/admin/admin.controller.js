import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
import Post from '../../models/Post.js'
import Connection from '../../models/Connection.js'
import Notification from '../../models/Notification.js'
import bcrypt from 'bcryptjs'

// ── helpers ──────────────────────────────────────────────
const allModels = [
  { Model: User,     role: 'User' },
  { Model: Reviewer, role: 'Reviewer' },
  { Model: Business, role: 'Business' },
]

const findUserAnywhere = async (id) => {
  for (const { Model, role } of allModels) {
    const u = await Model.findById(id).select('-password')
    if (u) return { user: u, role }
  }
  return null
}

const formatUser = (u, role) => ({
  id: u._id,
  fullName: u.user_info?.fullName || '',
  email: u.email,
  role: u.role || role,
  avatar: u.profile_info?.avatar || null,
  bio: u.profile_info?.bio || '',
  isBanned: u.trust_security?.isActive === false,
  isVerified: u.trust_security?.isVerified || false,
  isBlocked: u.trust_security?.isBlocked || false,
  trustScore: u.trust_security?.trustScore || 50,
  followersCount: u.social_stats?.followersCount || 0,
  postsCount: u.social_stats?.postsCount || 0,
  createdAt: u.createdAt,
})

// ── stats ─────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const [users, reviewers, businesses, posts, connections] = await Promise.all([
      User.countDocuments(),
      Reviewer.countDocuments(),
      Business.countDocuments(),
      Post.countDocuments(),
      Connection.countDocuments({ status: 'active' }),
    ])
    res.json({ success: true, stats: { users, reviewers, businesses, posts, connections, total: users + reviewers + businesses } })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

// ── get all users ─────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const [users, reviewers, businesses] = await Promise.all([
      User.find().select('-password'),
      Reviewer.find().select('-password'),
      Business.find().select('-password'),
    ])
    const all = [
      ...users.map(u => formatUser(u, 'User')),
      ...reviewers.map(u => formatUser(u, 'Reviewer')),
      ...businesses.map(u => formatUser(u, 'Business')),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ success: true, users: all })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

// ── delete user ───────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    let deleted = false
    for (const { Model } of allModels) {
      const result = await Model.findByIdAndDelete(userId)
      if (result) { deleted = true; break }
    }
    if (!deleted) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, message: 'User deleted' })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

// ── ban / unban ───────────────────────────────────────────
export const toggleBan = async (req, res) => {
  try {
    const { userId } = req.params
    const found = await findUserAnywhere(userId)
    if (!found) return res.status(404).json({ success: false, message: 'User not found' })
    const { user } = found
    const isBanned = user.trust_security?.isActive === false
    const newStatus = isBanned // currently banned → unban
    const Model = user.constructor
    await Model.findByIdAndUpdate(userId, { 'trust_security.isActive': newStatus })

    // notify user
    await Notification.create({
      user: userId,
      userModel: found.role,
      type: newStatus ? 'unban' : 'ban',
      title: newStatus ? 'Account Reinstated' : 'Account Banned',
      message: newStatus
        ? 'Your account has been reinstated by an administrator.'
        : 'Your account has been banned by an administrator. Contact support if you think this is a mistake.',
    })
    res.json({ success: true, isBanned: !newStatus, message: newStatus ? 'User unbanned' : 'User banned' })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

// ── send warning ──────────────────────────────────────────
export const sendWarning = async (req, res) => {
  try {
    const { userId } = req.params
    const { message } = req.body
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Warning message required' })
    const found = await findUserAnywhere(userId)
    if (!found) return res.status(404).json({ success: false, message: 'User not found' })
    await Notification.create({
      user: userId,
      userModel: found.role,
      type: 'warning',
      title: '⚠️ Official Warning',
      message: message.trim(),
    })
    res.json({ success: true, message: 'Warning sent' })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

// ── verify / unverify ─────────────────────────────────────
export const toggleVerify = async (req, res) => {
  try {
    const { userId } = req.params
    const found = await findUserAnywhere(userId)
    if (!found) return res.status(404).json({ success: false, message: 'User not found' })
    const { user } = found
    const Model = user.constructor
    const isVerified = user.trust_security?.isVerified || false
    await Model.findByIdAndUpdate(userId, { 'trust_security.isVerified': !isVerified })
    if (!isVerified) {
      await Notification.create({
        user: userId,
        userModel: found.role,
        type: 'verification',
        title: '✅ Account Verified',
        message: 'Congratulations! Your account has been verified by an administrator. A green tick now appears on your profile.',
      })
    }
    res.json({ success: true, isVerified: !isVerified, message: !isVerified ? 'User verified' : 'Verification removed' })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}
export const promoteToReviewer = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found (must be a regular User)' })
    // create reviewer with same data
    const reviewer = await Reviewer.create({
      email: user.email,
      password: user.password, // already hashed
      role: 'Reviewer',
      user_info: user.user_info,
      profile_info: user.profile_info,
      social_stats: user.social_stats,
      trust_security: user.trust_security,
    })
    await User.findByIdAndDelete(userId)
    await Notification.create({
      user: reviewer._id,
      userModel: 'Reviewer',
      type: 'promotion',
      title: '🎉 You\'ve been promoted!',
      message: 'Congratulations! An administrator has promoted your account to Reviewer. You can now review posts on the platform.',
    })
    res.json({ success: true, message: 'User promoted to Reviewer' })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

/**
 * Get all reviewers with their stats and trust scores (leaderboard)
 * Sorted by trust score descending - shows ALL reviewers including inactive
 */
export const getReviewerLeaderboard = async (req, res) => {
  try {
    console.log('[GetReviewerLeaderboard] ===== START =====')
    console.log('[GetReviewerLeaderboard] Request URL:', req.originalUrl)
    console.log('[GetReviewerLeaderboard] Request headers:', req.headers)
    
    // First check if any reviewers exist
    const count = await Reviewer.countDocuments({})
    console.log('[GetReviewerLeaderboard] Total reviewers in database:', count)
    
    const reviewers = await Reviewer.find({})
      .select('-password')
      .sort({ 'trust_security.trustScore': -1 })
      .lean()

    console.log('[GetReviewerLeaderboard] Found and sorted reviewers:', reviewers.length)

    if (reviewers.length > 0) {
      console.log('[GetReviewerLeaderboard] First reviewer:', {
        fullName: reviewers[0].user_info?.fullName,
        email: reviewers[0].email,
        trustScore: reviewers[0].trust_security?.trustScore
      })
    }

    const leaderboard = reviewers.map((reviewer, index) => ({
      rank: index + 1,
      id: reviewer._id,
      fullName: reviewer.user_info?.fullName || 'Unknown',
      email: reviewer.email,
      avatar: reviewer.profile_info?.avatar || null,
      bio: reviewer.profile_info?.bio || '',
      
      // Trust & Scoring
      trustScore: reviewer.trust_security?.trustScore || 50,
      isVerified: reviewer.trust_security?.isVerified || false,
      isActive: reviewer.trust_security?.isActive !== false,
      
      // Reviewer Stats
      reviewsCompleted: reviewer.reviewer_stats?.reviewsCompleted || 0,
      reviewsPending: reviewer.reviewer_stats?.reviewsPending || 0,
      accuracy: reviewer.reviewer_stats?.accuracy || 0,
      approvedCount: reviewer.reviewer_stats?.approvedCount || 0,
      rejectedCount: reviewer.reviewer_stats?.rejectedCount || 0,
      
      // Activity
      expertise: reviewer.reviewer_profile?.expertiseLevel || 'Junior',
      specialization: reviewer.reviewer_profile?.specialization || ['General'],
      lastReviewAt: reviewer.activity_tracking?.lastReviewAt || null,
      joinedAt: reviewer.createdAt,
    }))

    console.log('[GetReviewerLeaderboard] Returning leaderboard with', leaderboard.length, 'reviewers')
    console.log('[GetReviewerLeaderboard] Response object:', JSON.stringify({ 
      success: true, 
      total: leaderboard.length,
      leaderboard: leaderboard.slice(0, 1) // log first one only
    }, null, 2))

    const response = { 
      success: true, 
      total: leaderboard.length,
      leaderboard,
      message: leaderboard.length === 0 ? 'No reviewers found' : `Found ${leaderboard.length} reviewers`
    }
    
    console.log('[GetReviewerLeaderboard] ===== END - Sending response =====')
    res.json(response)
  } catch (e) { 
    console.error('[GetReviewerLeaderboard] ERROR:', e.message)
    console.error('[GetReviewerLeaderboard] Error stack:', e.stack)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch leaderboard: ' + e.message
    }) 
  }
}

// ── get all posts ─────────────────────────────────────────
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('author', 'user_info.fullName email profile_info.avatar role')
      .limit(200)
    res.json({ success: true, posts })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

export const getAdminFeed = async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('author', 'user_info.fullName email profile_info.avatar role')
    res.json({ success: true, posts })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

// ── delete post ───────────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId)
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })
    res.json({ success: true, message: 'Post deleted' })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

// ── seed admin (called once) ──────────────────────────────
export const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'iamadmin@verity.com' })
    if (existing) return
    // Use Model.create but bypass the pre-save hook by inserting raw
    // We store a plain password and let the pre-save hook hash it once
    await User.create({
      email: 'iamadmin@verity.com',
      password: 'iamAdmin098',  // pre-save hook will hash this
      role: 'Admin',
      user_info: { fullName: 'Admin', firstName: 'Admin', lastName: '' },
      profile_info: { bio: 'Platform Administrator' },
      trust_security: { isVerified: true, isActive: true, trustScore: 100 },
    })
      } catch (e) {
      }
}

// ── Reviewer Requests ────────────────────────────────────

export const getReviewerRequests = async (req, res) => {
  try {
    // Get all PENDING reviewer requests
    const ReviewerRequest = (await import('../../models/ReviewerRequest.js')).default
    
    const requests = await ReviewerRequest.find({ status: 'pending' })
      .populate('user', 'user_info.fullName email profile_info.avatar')
      .sort({ createdAt: -1 })
    
    // Map to response format
    const formattedRequests = requests.map(req => ({
      requestId: req._id,
      userId: req.user._id,
      user: {
        fullName: req.user.user_info?.fullName,
        email: req.user.email,
        avatar: req.user.profile_info?.avatar
      },
      reason: req.reason,
      requestedAt: req.createdAt
    }))
    
    res.json({ success: true, requests: formattedRequests })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const approveReviewerRequest = async (req, res) => {
  try {
    const { userId } = req.params
    const ReviewerRequest = (await import('../../models/ReviewerRequest.js')).default
    
    // Find the request
    const request = await ReviewerRequest.findOne({ user: userId, status: 'pending' })
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Create Reviewer account with same email and password
    const reviewer = await Reviewer.create({
      email: user.email,
      password: user.password,
      role: 'Reviewer',
      user_info: user.user_info,
      profile_info: user.profile_info,
      social_stats: user.social_stats,
      trust_security: { ...user.trust_security, isActive: true }
    })
    
    // Update request status
    request.status = 'approved'
    request.reviewedBy = req.user.id
    request.reviewedAt = new Date()
    await request.save()
    
    // Create notification
    await Notification.create({
      user: user._id,
      userModel: 'User',
      type: 'promotion',
      title: '🎉 Reviewer Request Approved!',
      message: `Congratulations! Your reviewer request has been approved. You can now login with your email (${user.email}) as a Reviewer and start reviewing posts on the platform.`,
      relatedUser: reviewer._id
    })
    
    res.json({ success: true, message: 'Request approved and Reviewer account created', reviewer })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const rejectReviewerRequest = async (req, res) => {
  try {
    const { userId } = req.params
    const { reason } = req.body
    const ReviewerRequest = (await import('../../models/ReviewerRequest.js')).default
    
    // Find the request
    const request = await ReviewerRequest.findOne({ user: userId, status: 'pending' })
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Update request status
    request.status = 'rejected'
    request.reviewedBy = req.user.id
    request.reviewedAt = new Date()
    request.rejectionReason = reason || 'Request rejected by admin'
    await request.save()
    
    // Create notification
    await Notification.create({
      user: user._id,
      userModel: 'User',
      type: 'request_rejected',
      title: '❌ Reviewer Request Rejected',
      message: `Your reviewer request has been rejected. Reason: ${reason || 'No reason provided'}. You can apply again later.`,
    })
    
    res.json({ success: true, message: 'Request rejected' })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}



// User submits a reviewer request
export const submitReviewerRequest = async (req, res) => {
  try {
    const userId = req.user.id
    const ReviewerRequest = (await import('../../models/ReviewerRequest.js')).default
    
    // Check if user already has a pending request
    const existingRequest = await ReviewerRequest.findOne({ 
      user: userId, 
      status: 'pending' 
    })
    
    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a pending reviewer request' 
      })
    }
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Create reviewer request
    const request = await ReviewerRequest.create({
      user: userId,
      email: user.email,
      fullName: user.user_info?.fullName || user.email,
      status: 'pending'
    })
    
    res.json({ 
      success: true, 
      message: 'Your request has been sent to admin. Please wait for approval.',
      request 
    })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

// User checks their reviewer request status
export const checkReviewerRequestStatus = async (req, res) => {
  try {
    const userId = req.user.id
    const ReviewerRequest = (await import('../../models/ReviewerRequest.js')).default
    
    const request = await ReviewerRequest.findOne({ user: userId })
    
    if (!request) {
      return res.json({ 
        success: true, 
        hasRequest: false,
        message: 'No request found'
      })
    }
    
    res.json({ 
      success: true, 
      hasRequest: true,
      request: {
        status: request.status,
        createdAt: request.createdAt,
        reviewedAt: request.reviewedAt,
        rejectionReason: request.rejectionReason
      }
    })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}


// Called during signup if user selects Reviewer role
export const createReviewerRequestOnSignup = async (req, res) => {
  try {
    const userId = req.user.id
    const ReviewerRequest = (await import('../../models/ReviewerRequest.js')).default
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Create reviewer request
    const request = await ReviewerRequest.create({
      user: userId,
      email: user.email,
      fullName: user.user_info?.fullName || user.email,
      status: 'pending'
    })
    
    res.json({ 
      success: true, 
      message: 'Signup successful! Your reviewer request has been sent to admin. Please wait for approval to access reviewer features.',
      request 
    })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

// ── block / unblock user ──────────────────────────────────
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { reason } = req.body
    const found = await findUserAnywhere(userId)
    if (!found) return res.status(404).json({ success: false, message: 'User not found' })
    
    const { user } = found
    const Model = user.constructor
    
    // Check if already blocked
    if (user.trust_security?.isBlocked) {
      return res.status(400).json({ success: false, message: 'User is already blocked' })
    }
    
    // Block the user
    await Model.findByIdAndUpdate(userId, { 
      'trust_security.isBlocked': true,
      'trust_security.blockedAt': new Date(),
      'trust_security.blockedReason': reason || 'Blocked by admin'
    })
    
    // Send notification
    await Notification.create({
      user: userId,
      userModel: found.role,
      type: 'blocked',
      title: '🚫 Account Blocked',
      message: `Your account has been blocked by an administrator. Reason: ${reason || 'Violation of terms'}. You cannot login or access the platform.`
    })
    
    res.json({ success: true, message: 'User blocked successfully' })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params
    const found = await findUserAnywhere(userId)
    if (!found) return res.status(404).json({ success: false, message: 'User not found' })
    
    const { user } = found
    const Model = user.constructor
    
    // Check if not blocked
    if (!user.trust_security?.isBlocked) {
      return res.status(400).json({ success: false, message: 'User is not blocked' })
    }
    
    // Unblock the user
    await Model.findByIdAndUpdate(userId, { 
      'trust_security.isBlocked': false,
      'trust_security.blockedAt': null,
      'trust_security.blockedReason': ''
    })
    
    // Send notification
    await Notification.create({
      user: userId,
      userModel: found.role,
      type: 'unblocked',
      title: '✅ Account Unblocked',
      message: 'Your account has been unblocked by an administrator. You can now login and access the platform.'
    })
    
    res.json({ success: true, message: 'User unblocked successfully' })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}
