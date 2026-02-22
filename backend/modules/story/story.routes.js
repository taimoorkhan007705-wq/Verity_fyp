import express from 'express'
import { protect } from '../../middleware/auth.js'
import { uploadStory } from '../../middleware/upload.js'
import { createStory, getStories, getUserStories, viewStory, deleteStory } from './story.controller.js'
const router = express.Router()
router.post('/', protect, uploadStory.single('media'), createStory)
router.get('/', protect, getStories)
router.get('/user/:userId', protect, getUserStories)
router.post('/:storyId/view', protect, viewStory)
router.delete('/:storyId', protect, deleteStory)
export default router
