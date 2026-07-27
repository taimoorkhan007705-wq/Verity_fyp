import express from 'express'
import { getProfile, updateProfile, getUserById, deleteUser, getAllUsers, sendConnectionRequest, acceptRequest, rejectRequest, getPendingRequests, getConnections, getMessages, sendMessage, getConversations, getBadgeCounts, markRejectionsRead, getRecentNotifications, markNotificationsRead, getPaymentMethods, updatePaymentMethods, getBusinessPaymentMethods } from './user.controller.js'
import { protect } from '../../middleware/auth.js'
import { uploadProfile } from '../../middleware/upload.js'
const router = express.Router()

router.get('/profiles', protect, getProfile)
router.get('/profiles/:userId', protect, getUserById)
router.put('/profiles', protect, uploadProfile.single('avatar'), updateProfile)
router.delete('/profiles/:userId', protect, deleteUser)

// Discover
router.get('/all', protect, getAllUsers)

// Connections
router.post('/connect/:targetUserId', protect, sendConnectionRequest)
router.post('/accept/:requesterId', protect, acceptRequest)
router.post('/reject/:requesterId', protect, rejectRequest)
router.get('/requests', protect, getPendingRequests)
router.get('/connections', protect, getConnections)

// Messages
router.get('/conversations', protect, getConversations)
router.get('/messages/:otherId', protect, getMessages)
router.post('/messages/:otherId', protect, sendMessage)

// Badges & notifications
router.get('/badges', protect, getBadgeCounts)
router.post('/badges/rejections/read', protect, markRejectionsRead)
router.get('/notifications', protect, getRecentNotifications)
router.post('/notifications/read', protect, markNotificationsRead)

// Payment Methods
router.get('/payment-methods', protect, getPaymentMethods)
router.put('/payment-methods', protect, updatePaymentMethods)
router.get('/payment-methods/:businessId', getBusinessPaymentMethods)

export default router


