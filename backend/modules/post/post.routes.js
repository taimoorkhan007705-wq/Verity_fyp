import express from 'express'
import { createPost, getFeed, getPostById, likePost, commentOnPost, deletePost } from './post.controller.js'
import { protect } from '../../middleware/auth.js'
import { uploadPost } from '../../middleware/upload.js'
const router = express.Router()
router.post('/', protect, uploadPost.array('media', 10), createPost)
router.get('/feed', getFeed)
router.get('/:id', getPostById)
router.post('/:id/like', protect, likePost)
router.post('/:id/comment', protect, commentOnPost)
router.delete('/:id', protect, deletePost)
export default router
