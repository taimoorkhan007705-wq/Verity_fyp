import express from 'express'
import { protect } from '../../middleware/auth.js'
import { chat, generate, health } from './ai.controller.js'

const router = express.Router()

router.get('/health', health)               // public — check if AI is up
router.post('/chat', protect, chat)         // auth required — AI chat
router.post('/generate', protect, generate) // auth required — AI prompt

export default router
