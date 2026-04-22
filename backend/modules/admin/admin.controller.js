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
    console.log('✅ Admin account created: iamadmin@verity.com / iamAdmin098')
  } catch (e) {
    console.error('Admin seed error:', e.message)
  }
}
