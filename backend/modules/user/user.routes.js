import express from 'express'
import { getProfile, updateProfile, getUserById, deleteUser } from './user.controller.js'
import { protect } from '../../middleware/auth.js'
import { uploadProfile } from '../../middleware/upload.js'

const router = express.Router()

router.get('/profiles', protect, getProfile)
router.get('/profiles/:userId', protect, getUserById)
router.put('/profiles', protect, uploadProfile.single('avatar'), updateProfile)
router.delete('/profiles/:userId', protect, deleteUser)

export default router
