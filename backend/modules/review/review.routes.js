import express from 'express'
import { getPendingReviews, submitReview, getReviewerStats, getReviewHistory } from './review.controller.js'
import { protect, restrictTo } from '../../middleware/auth.js'
const router = express.Router()
router.get('/pending', protect, restrictTo('Reviewer'), getPendingReviews)
router.post('/submit', protect, restrictTo('Reviewer'), submitReview)
router.get('/stats', protect, restrictTo('Reviewer'), getReviewerStats)
router.get('/history', protect, restrictTo('Reviewer'), getReviewHistory)
export default router
