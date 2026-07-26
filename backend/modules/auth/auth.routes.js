import express from 'express'
import { signup, login, testAuth, forgotPassword, resetPassword } from './auth.controller.js'
import { protect } from '../../middleware/auth.js'
const router = express.Router()
router.get('/test', testAuth)
router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/test-protected', protect, testAuth)
export default router


