import Story from '../../models/Story.js'
import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
import fs from 'fs'
import path from 'path'
export const createStory = async (req, res) => {
  try {
    const { caption } = req.body
    const userId = req.user.id
    const userRole = req.user.role
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Media file is required' })
    }
    const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video'
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)
    const story = await Story.create({
      author: userId,
      authorModel: userRole,
      mediaUrl: `/uploads/users/${userId}/stories/${req.file.filename}`,
      mediaType,
      caption: caption || '',
      expiresAt
    })
    await story.populate('author', 'user_info.fullName profile_info.avatar role')
    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      story
    })
  } catch (error) {
    console.error('Create story error:', error)
    res.status(500).json({ success: false, message: 'Failed to create story', error: error.message })
  }
}
export const getStories = async (req, res) => {
  try {
    const currentTime = new Date()
    const stories = await Story.find({
      expiresAt: { $gt: currentTime }
    })
      .populate('author', 'user_info.fullName profile_info.avatar role')
      .sort({ createdAt: -1 })
    const groupedStories = {}
    stories.forEach(story => {
      const authorId = story.author._id.toString()
      if (!groupedStories[authorId]) {
        groupedStories[authorId] = {
          author: story.author,
          stories: []
        }
      }
      groupedStories[authorId].stories.push({
        _id: story._id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        viewCount: story.viewCount,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        hasViewed: story.views.some(v => v.user.toString() === req.user.id)
      })
    })
    const storiesArray = Object.values(groupedStories)
    res.status(200).json({
      success: true,
      stories: storiesArray
    })
  } catch (error) {
    console.error('Get stories error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch stories', error: error.message })
  }
}
export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params
    const currentTime = new Date()
    const stories = await Story.find({
      author: userId,
      expiresAt: { $gt: currentTime }
    })
      .populate('author', 'user_info.fullName profile_info.avatar role')
      .sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      stories
    })
  } catch (error) {
    console.error('Get user stories error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch user stories', error: error.message })
  }
}
export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params
    const userId = req.user.id
    const story = await Story.findById(storyId)
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' })
    }
    const alreadyViewed = story.views.some(v => v.user.toString() === userId)
    if (!alreadyViewed) {
      story.views.push({ user: userId })
      story.viewCount += 1
      await story.save()
    }
    res.status(200).json({
      success: true,
      message: 'Story viewed',
      viewCount: story.viewCount
    })
  } catch (error) {
    console.error('View story error:', error)
    res.status(500).json({ success: false, message: 'Failed to view story', error: error.message })
  }
}
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params
    const userId = req.user.id
    const story = await Story.findById(storyId)
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' })
    }
    if (story.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this story' })
    }
    const filePath = path.join(process.cwd(), story.mediaUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    await Story.findByIdAndDelete(storyId)
    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    })
  } catch (error) {
    console.error('Delete story error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete story', error: error.message })
  }
}
