import express from 'express'
import { protect, restrictTo } from '../../middleware/auth.js'
import { getStats, getAllUsers, deleteUser, toggleBan, toggleVerify, sendWarning, promoteToReviewer, getAllPosts, getAdminFeed, deletePost } from './admin.controller.js'

const router = express.Router()
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
