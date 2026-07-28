import express from 'express'
import { protect, restrictTo } from '../../middleware/auth.js'
import {
  getMyQueue,
  getPostForReview,
  voteOnPost,
  getMyHistory,
  getMyStats,
  getAllPendingReviews,
  getReviewerLeaderboard,
  recalculateTrustScores
} from './reviewer.controller.js'

const router = express.Router()

// Public routes
// Get reviewer leaderboard (anyone can view)
router.get('/leaderboard', getReviewerLeaderboard)

// All routes below require authentication and Reviewer role
// The auth middleware should check req.user.role === 'Reviewer'

// Get reviewer's queue - posts awaiting their vote
router.get('/queue', protect, restrictTo('Reviewer'), getMyQueue)

// Get all pending reviews (dashboard overview)
router.get('/pending', protect, restrictTo('Reviewer'), getAllPendingReviews)

// Get specific post for review
router.get('/posts/:postId', protect, restrictTo('Reviewer'), getPostForReview)

// Submit vote on a post
router.post('/posts/:postId/vote', protect, restrictTo('Reviewer'), voteOnPost)

// Get reviewer's history
router.get('/history', protect, restrictTo('Reviewer'), getMyHistory)

// Get reviewer's stats
router.get('/stats', protect, restrictTo('Reviewer'), getMyStats)

// Admin: Recalculate all trust scores
router.post('/admin/recalculate-trust-scores', protect, restrictTo('Admin'), recalculateTrustScores)

export default router


