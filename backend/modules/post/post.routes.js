import express from 'express'
import { createPost, getFeed, getPostById, likePost, commentOnPost, deletePost, sharePost, getUserPosts, getMyRejectedPosts, getMyPendingPosts, checkPostStatus } from './post.controller.js'
import { protect } from '../../middleware/auth.js'
import { uploadPost } from '../../middleware/upload.js'
const router = express.Router()

// Specific routes first
router.post('/', protect, uploadPost.array('media', 10), createPost)
router.get('/feed', getFeed)
router.get('/user/:userId', protect, getUserPosts)
router.get('/my', protect, getUserPosts)
router.get('/my/rejected', protect, getMyRejectedPosts)
router.get('/my/pending', protect, getMyPendingPosts)

// ID-based routes
router.get('/:id/status', protect, checkPostStatus)
router.post('/:id/comment', protect, commentOnPost)
router.post('/:id/like', protect, likePost)
router.post('/:id/share', protect, sharePost)
router.delete('/:id', protect, deletePost)
router.get('/:id', getPostById)

export default router


