import express from 'express'
import { protect } from '../../middleware/auth.js'
import { chat, generate, health } from './ai.controller.js'

const router = express.Router()

router.get('/health', health)               // public — check if  is up
router.post('/chat', protect, chat)         // auth required —  chat
router.post('/generate', protect, generate) // auth required —  prompt

export default router
