import Post from '../../models/Post.js'
import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
const getModelByRole = (role) => {
  const models = { Reviewer, Business, User }
  return models[role] || User
}
export const createPost = async (req, res) => {
  try {
    const { content, hashtags, visibility } = req.body
    const userId = req.user.id
    const userRole = req.user.role
    const media = req.files ? req.files.map(file => ({
      type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      url: `/uploads/users/${userId}/posts/${file.filename}`
    })) : []
    const post = await Post.create({
      author: userId,
      authorModel: userRole,
      content,
      media,
      hashtags: hashtags ? JSON.parse(hashtags) : [],
      visibility: visibility || 'public',
      verificationStatus: 'pending' // All posts start as pending
    })
    await post.populate('author', 'user_info.fullName email profile_info.avatar role')
    res.status(201).json({
      success: true,
      message: 'Post submitted for review',
      post
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message })
  }
}
export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const posts = await Post.find({ 
      visibility: 'public',
      verificationStatus: 'approved'
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'user_info.fullName email profile_info.avatar role')
    const count = await Post.countDocuments({ 
      visibility: 'public',
      verificationStatus: 'approved'
    })
    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch feed', error: error.message })
  }
}
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'user_info.fullName email profile_info.avatar role')
      .populate('comments.user', 'user_info.fullName profile_info.avatar')
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    res.json({ success: true, post })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch post', error: error.message })
  }
}
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    const userId = req.user.id
    const userRole = req.user.role
    const likeIndex = post.likes.findIndex(like => like.user.toString() === userId)
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1)
    } else {
      post.likes.push({ user: userId, userModel: userRole })
    }
    await post.save()
    res.json({ success: true, likes: post.likes.length })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like post', error: error.message })
  }
}
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    post.comments.push({
      user: req.user.id,
      userModel: req.user.role,
      text
    })
    await post.save()
    await post.populate('comments.user', 'user_info.fullName profile_info.avatar')
    res.json({ success: true, comments: post.comments })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to comment', error: error.message })
  }
}
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    await post.deleteOne()
    res.json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post', error: error.message })
  }
}
