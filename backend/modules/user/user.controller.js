import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
import Connection from '../../models/Connection.js'
import Message from '../../models/Message.js'
import Notification from '../../models/Notification.js'
import Post from '../../models/Post.js'
import fs from 'fs'
import path from 'path'
const getModelByRole = (role) => {
  const models = { Reviewer, Business, User }
  return models[role] || User
}
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id  // Changed from req.user.id to req.user._id
    const userRole = req.user.role
    const Model = getModelByRole(userRole)
    const user = await Model.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.user_info?.firstName || '',
        lastName: user.user_info?.lastName || '',
        fullName: user.user_info?.fullName || '',
        email: user.email,
        bio: user.profile_info?.bio || '',
        website: user.profile_info?.website || '',
        avatar: user.profile_info?.avatar || null,
        role: user.role,
        trustScore: user.trust_security?.trustScore || 50,
        followersCount: user.social_stats?.followersCount || 0,
        followingCount: user.social_stats?.followingCount || 0,
        postsCount: user.social_stats?.postsCount || 0,
        isVerified: user.trust_security?.isVerified || false
      }
    })
  } catch (error) {
    console.error('[User] Get profile error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message })
  }
}
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const { firstName, lastName, bio, website } = req.body
    const Model = getModelByRole(userRole)
    const user = await Model.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if (!user.user_info) user.user_info = {}
    if (!user.profile_info) user.profile_info = {}
    if (!user.social_stats) user.social_stats = {}
    if (!user.trust_security) user.trust_security = {}
    if (firstName) user.user_info.firstName = firstName
    if (lastName) user.user_info.lastName = lastName
    const fullName = `${firstName || user.user_info.firstName || ''} ${lastName || user.user_info.lastName || ''}`.trim()
    user.user_info.fullName = fullName
    if (bio !== undefined) user.profile_info.bio = bio
    if (website !== undefined) user.profile_info.website = website
    if (req.file) {
      const profileDir = path.join(process.cwd(), 'uploads', 'users', userId.toString(), 'profile')
      if (!fs.existsSync(profileDir)) {
        fs.mkdirSync(profileDir, { recursive: true })
      }
      if (user.profile_info.avatar && user.profile_info.avatar.startsWith('/uploads')) {
        const oldImagePath = path.join(process.cwd(), user.profile_info.avatar)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      user.profile_info.avatar = `/uploads/users/${userId}/profile/${req.file.filename}`
    }
    await user.save()
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.user_info.firstName,
        lastName: user.user_info.lastName,
        fullName: user.user_info.fullName,
        email: user.email,
        bio: user.profile_info.bio,
        website: user.profile_info.website,
        avatar: user.profile_info.avatar,
        role: user.role,
        trustScore: user.trust_security?.trustScore || 50,
        followersCount: user.social_stats?.followersCount || 0,
        followingCount: user.social_stats?.followingCount || 0,
        postsCount: user.social_stats?.postsCount || 0,
        isVerified: user.trust_security?.isVerified || false
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message })
  }
}
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params
    let user = await User.findById(userId).select('-password')
    let userRole = 'User'
    if (!user) {
      user = await Reviewer.findById(userId).select('-password')
      userRole = 'Reviewer'
    }
    if (!user) {
      user = await Business.findById(userId).select('-password')
      userRole = 'Business'
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.user_info?.firstName || '',
        lastName: user.user_info?.lastName || '',
        fullName: user.user_info?.fullName || '',
        email: user.email,
        bio: user.profile_info?.bio || '',
        website: user.profile_info?.website || '',
        avatar: user.profile_info?.avatar || null,
        role: user.role || userRole,
        trustScore: user.trust_security?.trustScore || 50,
        followersCount: user.social_stats?.followersCount || 0,
        followingCount: user.social_stats?.followingCount || 0,
        postsCount: user.social_stats?.postsCount || 0,
        isVerified: user.trust_security?.isVerified || false,
        businessType: user.business_details?.businessType || null,
        businessName: user.business_details?.businessName || null,
        reviewsCompleted: user.reviewer_stats?.reviewsCompleted || 0,
        accuracy: user.reviewer_stats?.accuracy || 0
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message })
  }
}
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    const requesterId = req.user.id
    if (userId !== requesterId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own account' 
      })
    }
    let deletedUser = await User.findByIdAndDelete(userId)
    let userRole = 'User'
    if (!deletedUser) {
      deletedUser = await Reviewer.findByIdAndDelete(userId)
      userRole = 'Reviewer'
    }
    if (!deletedUser) {
      deletedUser = await Business.findByIdAndDelete(userId)
      userRole = 'Business'
    }
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const userUploadDir = path.join(process.cwd(), 'uploads', 'users', userId)
    if (fs.existsSync(userUploadDir)) {
      fs.rmSync(userUploadDir, { recursive: true, force: true })
    }
    res.json({
      success: true,
      message: 'Account deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        email: deletedUser.email,
        role: userRole
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete account', 
      error: error.message 
    })
  }
}

const formatUser = (user, role) => ({
  id: user._id,
  fullName: user.user_info?.fullName || '',
  email: user.email,
  avatar: user.profile_info?.avatar || null,
  bio: user.profile_info?.bio || '',
  role: user.role || role,
  trustScore: user.trust_security?.trustScore || 50,
  isVerified: user.trust_security?.isVerified || false
})

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString()
    const [users, reviewers, businesses] = await Promise.all([
      User.find({ _id: { $ne: currentUserId } }).select('-password'),
      Reviewer.find({ _id: { $ne: currentUserId } }).select('-password'),
      Business.find({ _id: { $ne: currentUserId } }).select('-password')
    ])
    const all = [
      ...users.map(u => formatUser(u, 'User')),
      ...reviewers.map(u => formatUser(u, 'Reviewer')),
      ...businesses.map(u => formatUser(u, 'Business'))
    ]
    const connections = await Connection.find({
      $or: [{ follower: currentUserId }, { following: currentUserId }]
    })
    const statusMap = {}
    connections.forEach(c => {
      const otherId = c.follower.toString() === currentUserId ? c.following.toString() : c.follower.toString()
      if (c.status === 'active') statusMap[otherId] = 'active'
      else if (c.status === 'pending') {
        // I sent the request
        if (c.follower.toString() === currentUserId) statusMap[otherId] = 'pending_sent'
        // they sent me a request
        else statusMap[otherId] = 'pending_received'
      }
    })
    const result = all.map(u => ({ ...u, connectionStatus: statusMap[u.id.toString()] || 'none' }))
    res.json({ success: true, users: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const sendConnectionRequest = async (req, res) => {
  try {
    const followerId = req.user._id.toString()
    const followerRole = req.user.role
    const { targetUserId } = req.params

    if (followerId === targetUserId) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' })
    }

    const existing = await Connection.findOne({ follower: followerId, following: targetUserId })
    if (existing) {
      await existing.deleteOne()
      return res.json({ success: true, status: 'none', message: 'Request cancelled' })
    }

    await Connection.create({
      follower: followerId,
      followerModel: followerRole,
      following: targetUserId,
      followingModel: 'User',
      status: 'pending'
    })
    res.json({ success: true, status: 'pending', message: 'Friend request sent' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const userRole = req.user.role
    const { requesterId } = req.params
    const conn = await Connection.findOne({ follower: requesterId, following: userId, status: 'pending' })
    if (!conn) return res.status(404).json({ success: false, message: 'Request not found' })
    conn.status = 'active'
    await conn.save()

    // update follower/following counts
    const followerModel = getModelByRole(conn.followerModel)
    const followingModel = getModelByRole(userRole)
    await followerModel.findByIdAndUpdate(requesterId, { $inc: { 'social_stats.followingCount': 1 } })
    await followingModel.findByIdAndUpdate(userId, { $inc: { 'social_stats.followersCount': 1 } })

    res.json({ success: true, message: 'Connection accepted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { requesterId } = req.params
    await Connection.findOneAndDelete({ follower: requesterId, following: userId, status: 'pending' })
    res.json({ success: true, message: 'Request rejected' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const pending = await Connection.find({ following: userId, status: 'pending' })
    const requesterIds = pending.map(c => c.follower.toString())

    const [users, reviewers, businesses] = await Promise.all([
      User.find({ _id: { $in: requesterIds } }).select('-password'),
      Reviewer.find({ _id: { $in: requesterIds } }).select('-password'),
      Business.find({ _id: { $in: requesterIds } }).select('-password')
    ])
    const allUsers = [
      ...users.map(u => formatUser(u, 'User')),
      ...reviewers.map(u => formatUser(u, 'Reviewer')),
      ...businesses.map(u => formatUser(u, 'Business'))
    ]
    res.json({ success: true, requests: allUsers })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getConnections = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const connections = await Connection.find({
      $or: [{ follower: userId }, { following: userId }],
      status: 'active'
    })

    const otherIds = connections.map(c =>
      c.follower.toString() === userId ? c.following.toString() : c.follower.toString()
    )

    const [users, reviewers, businesses] = await Promise.all([
      User.find({ _id: { $in: otherIds } }).select('-password'),
      Reviewer.find({ _id: { $in: otherIds } }).select('-password'),
      Business.find({ _id: { $in: otherIds } }).select('-password')
    ])

    const all = [
      ...users.map(u => formatUser(u, 'User')),
      ...reviewers.map(u => formatUser(u, 'Reviewer')),
      ...businesses.map(u => formatUser(u, 'Business'))
    ]
    res.json({ success: true, connections: all })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { otherId } = req.params
    const conversationId = [userId, otherId].sort().join('_')
    const messages = await Message.find({ conversationId, isDeleted: false })
      .sort({ createdAt: 1 })
    await Message.updateMany(
      { conversationId, receiver: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )
    res.json({ success: true, messages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id.toString()
    const senderRole = req.user.role
    const { otherId } = req.params
    const { message } = req.body
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message is empty' })
    const conversationId = [senderId, otherId].sort().join('_')
    const msg = await Message.create({
      conversationId,
      sender: senderId,
      senderModel: senderRole,
      receiver: otherId,
      receiverModel: 'User',
      message: message.trim()
    })

    await Notification.create({
      user: otherId,
      userModel: 'User',
      type: 'message',
      title: 'New Message',
      message: message.trim().slice(0, 100),
      relatedUser: senderId,
      relatedUserModel: senderRole,
      actionUrl: `/messages/${senderId}`
    })

    res.json({ success: true, message: msg })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const mongoose = (await import('mongoose')).default
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ],
          isDeleted: false
        }
      },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' } } }
    ])

    const otherIds = messages.map(m => m._id.split('_').find(p => p !== userId))

    const [users, reviewers, businesses] = await Promise.all([
      User.find({ _id: { $in: otherIds } }).select('-password'),
      Reviewer.find({ _id: { $in: otherIds } }).select('-password'),
      Business.find({ _id: { $in: otherIds } }).select('-password')
    ])
    const allUsers = [
      ...users.map(u => formatUser(u, 'User')),
      ...reviewers.map(u => formatUser(u, 'Reviewer')),
      ...businesses.map(u => formatUser(u, 'Business'))
    ]

    const conversations = messages.map(m => {
      const otherId = m._id.split('_').find(p => p !== userId)
      const other = allUsers.find(u => u.id.toString() === otherId)
      return { conversationId: m._id, other, lastMessage: m.lastMessage }
    }).filter(c => c.other)

    res.json({ success: true, conversations })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getBadgeCounts = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { feedSince } = req.query

    const unreadMessages = await Message.countDocuments({
      receiver: userId,
      isRead: false,
      isDeleted: false
    })

    const unreadRejections = await Notification.countDocuments({
      user: userId,
      type: 'post_rejected',
      isRead: false
    })

    let newFeedAuthors = 0
    if (feedSince) {
      const sinceDate = new Date(feedSince)
      if (!isNaN(sinceDate.getTime())) {
        const connections = await Connection.find({
          follower: userId,
          status: 'active'
        }).select('following')

        const followingIds = connections.map(c => c.following.toString())
        if (followingIds.length > 0) {
          const authors = await Post.distinct('author', {
            author: { $in: followingIds },
            verificationStatus: 'approved',
            createdAt: { $gt: sinceDate }
          })
          newFeedAuthors = authors.length
        }
      }
    }

    res.json({
      success: true,
      badges: { unreadMessages, unreadRejections, newFeedAuthors }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const markRejectionsRead = async (req, res) => {
  try {
    const userId = req.user._id
    await Notification.updateMany(
      { user: userId, type: 'post_rejected', isRead: false },
      { isRead: true, readAt: new Date() }
    )
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getRecentNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    const notifications = await Notification.find({
      user: userId,
      isRead: false,
      type: { $in: ['post_approved', 'post_rejected', 'message'] }
    })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ success: true, notifications })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user._id
    const { ids, type } = req.body

    const query = { user: userId, isRead: false }
    if (ids?.length) query._id = { $in: ids }
    if (type) query.type = type

    await Notification.updateMany(query, { isRead: true, readAt: new Date() })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}



// ─── Payment Methods (Business only) ───────────────────────────────────────

export const getPaymentMethods = async (req, res) => {
  try {
    if (req.user.role !== 'Business') {
      return res.status(403).json({ success: false, message: 'Only businesses can access payment methods' })
    }
    const business = await Business.findById(req.user.id).select('payment_methods')
    if (!business) return res.status(404).json({ success: false, message: 'Business not found' })

    res.json({ success: true, payment_methods: business.payment_methods || {} })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment methods', error: error.message })
  }
}

export const updatePaymentMethods = async (req, res) => {
  try {
    if (req.user.role !== 'Business') {
      return res.status(403).json({ success: false, message: 'Only businesses can update payment methods' })
    }
    const business = await Business.findById(req.user.id)
    if (!business) return res.status(404).json({ success: false, message: 'Business not found' })

    const { easypaisa, jazzcash, bankTransfer, creditCard, cashOnDelivery } = req.body

    if (!business.payment_methods) business.payment_methods = {}

    if (easypaisa !== undefined) business.payment_methods.easypaisa = easypaisa
    if (jazzcash !== undefined) business.payment_methods.jazzcash = jazzcash
    if (bankTransfer !== undefined) business.payment_methods.bankTransfer = bankTransfer
    if (creditCard !== undefined) business.payment_methods.creditCard = creditCard
    if (cashOnDelivery !== undefined) business.payment_methods.cashOnDelivery = cashOnDelivery

    business.markModified('payment_methods')
    await business.save()

    res.json({ success: true, message: 'Payment methods updated successfully', payment_methods: business.payment_methods })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment methods', error: error.message })
  }
}

export const getBusinessPaymentMethods = async (req, res) => {
  try {
    const { businessId } = req.params
    const business = await Business.findById(businessId).select('payment_methods user_info.fullName')
    if (!business) return res.status(404).json({ success: false, message: 'Business not found' })

    res.json({ success: true, payment_methods: business.payment_methods || {}, businessName: business.user_info?.fullName })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment methods', error: error.message })
  }
}
