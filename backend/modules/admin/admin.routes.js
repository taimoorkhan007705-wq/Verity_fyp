import express from 'express'
import { protect, restrictTo } from '../../middleware/auth.js'
import { getStats, getAllUsers, deleteUser, toggleBan, toggleVerify, sendWarning, promoteToReviewer, getAllPosts, getAdminFeed, deletePost, getReviewerLeaderboard } from './admin.controller.js'

const router = express.Router()

// ── Public routes (anyone can access) ──────────────────────
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Admin routes working', timestamp: new Date().toISOString() })
})

router.get('/test-reviewers', async (req, res) => {
  try {
    const Reviewer = (await import('../../models/Reviewer.js')).default
    const count = await Reviewer.countDocuments({})
    const reviewers = await Reviewer.find({}).select('email user_info.fullName')
    res.json({ 
      success: true, 
      count,
      reviewers: reviewers.map(r => ({ name: r.user_info.fullName, email: r.email }))
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.get('/reviewers/leaderboard', getReviewerLeaderboard)

// ── Admin-only routes ──────────────────────────────────────
router.use(protect, restrictTo('Admin'))

router.get('/stats', getStats)
router.get('/users', getAllUsers)
router.delete('/users/:userId', deleteUser)
router.patch('/users/:userId/ban', toggleBan)
router.patch('/users/:userId/verify', toggleVerify)
router.post('/users/:userId/warn', sendWarning)
router.post('/users/:userId/promote', promoteToReviewer)
router.get('/posts', getAllPosts)
router.get('/feed', getAdminFeed)
router.delete('/posts/:postId', deletePost)

export default router


