import express from 'express'
import { signup, login, testAuth } from './auth.controller.js'
import { protect } from '../../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/test', testAuth)
router.post('/signup', signup)
router.post('/login', login)

// Protected test route
router.get('/test-protected', protect, testAuth)

export default router
