import express from 'express'
import { protect } from '../../middleware/auth.js'
import { uploadStory } from '../../middleware/upload.js'
import { createStory, getStories, getUserStories, viewStory, deleteStory } from './story.controller.js'

const router = express.Router()

// Create story (protected, with file upload)
router.post('/', protect, uploadStory.single('media'), createStory)

// Get all active stories (protected)
router.get('/', protect, getStories)

// Get stories by specific user (protected)
router.get('/user/:userId', protect, getUserStories)

// View a story (protected)
router.post('/:storyId/view', protect, viewStory)

// Delete a story (protected)
router.delete('/:storyId', protect, deleteStory)

export default router
