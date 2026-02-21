import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
import fs from 'fs'
import path from 'path'

const getModelByRole = (role) => {
  const models = { Reviewer, Business, User }
  return models[role] || User
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const Model = getModelByRole(userRole)

    const user = await Model.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.user_info?.firstName || '',
        lastName: user.user_info?.lastName || '',
        fullName: user.user_info?.fullName || '',
        email: user.email,
        bio: user.profile_info?.bio || '',
        website: user.profile_info?.website || '',
        avatar: user.profile_info?.avatar || null,
        role: user.role,
        trustScore: user.trust_security?.trustScore || 50,
        followersCount: user.social_stats?.followersCount || 0,
        followingCount: user.social_stats?.followingCount || 0,
        postsCount: user.social_stats?.postsCount || 0,
        isVerified: user.trust_security?.isVerified || false
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const { firstName, lastName, bio, website } = req.body
    const Model = getModelByRole(userRole)

    const user = await Model.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Initialize nested objects if they don't exist
    if (!user.user_info) user.user_info = {}
    if (!user.profile_info) user.profile_info = {}
    if (!user.social_stats) user.social_stats = {}
    if (!user.trust_security) user.trust_security = {}

    // Update fields
    if (firstName) user.user_info.firstName = firstName
    if (lastName) user.user_info.lastName = lastName
    
    // Update fullName
    const fullName = `${firstName || user.user_info.firstName || ''} ${lastName || user.user_info.lastName || ''}`.trim()
    user.user_info.fullName = fullName

    if (bio !== undefined) user.profile_info.bio = bio
    if (website !== undefined) user.profile_info.website = website

    // Handle profile image upload
    if (req.file) {
      // Create user profile directory if it doesn't exist
      const profileDir = path.join(process.cwd(), 'uploads', 'users', userId.toString(), 'profile')
      if (!fs.existsSync(profileDir)) {
        fs.mkdirSync(profileDir, { recursive: true })
      }

      // Delete old profile image if exists
      if (user.profile_info.avatar && user.profile_info.avatar.startsWith('/uploads')) {
        const oldImagePath = path.join(process.cwd(), user.profile_info.avatar)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      // Set new avatar path
      user.profile_info.avatar = `/uploads/users/${userId}/profile/${req.file.filename}`
    }

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.user_info.firstName,
        lastName: user.user_info.lastName,
        fullName: user.user_info.fullName,
        email: user.email,
        bio: user.profile_info.bio,
        website: user.profile_info.website,
        avatar: user.profile_info.avatar,
        role: user.role,
        trustScore: user.trust_security?.trustScore || 50,
        followersCount: user.social_stats?.followersCount || 0,
        followingCount: user.social_stats?.followingCount || 0,
        postsCount: user.social_stats?.postsCount || 0,
        isVerified: user.trust_security?.isVerified || false
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params

    // Try to find user in all collections
    let user = await User.findById(userId).select('-password')
    let userRole = 'User'

    if (!user) {
      user = await Reviewer.findById(userId).select('-password')
      userRole = 'Reviewer'
    }

    if (!user) {
      user = await Business.findById(userId).select('-password')
      userRole = 'Business'
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.user_info?.firstName || '',
        lastName: user.user_info?.lastName || '',
        fullName: user.user_info?.fullName || '',
        email: user.email,
        bio: user.profile_info?.bio || '',
        website: user.profile_info?.website || '',
        avatar: user.profile_info?.avatar || null,
        role: user.role || userRole,
        trustScore: user.trust_security?.trustScore || 50,
        followersCount: user.social_stats?.followersCount || 0,
        followingCount: user.social_stats?.followingCount || 0,
        postsCount: user.social_stats?.postsCount || 0,
        isVerified: user.trust_security?.isVerified || false,
        // Business specific fields
        businessType: user.business_details?.businessType || null,
        businessName: user.business_details?.businessName || null,
        // Reviewer specific fields
        reviewsCompleted: user.reviewer_stats?.reviewsCompleted || 0,
        accuracy: user.reviewer_stats?.accuracy || 0
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    const requesterId = req.user.id

    // Check if user is trying to delete their own account
    if (userId !== requesterId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own account' 
      })
    }

    // Try to find and delete user from all collections
    let deletedUser = await User.findByIdAndDelete(userId)
    let userRole = 'User'

    if (!deletedUser) {
      deletedUser = await Reviewer.findByIdAndDelete(userId)
      userRole = 'Reviewer'
    }

    if (!deletedUser) {
      deletedUser = await Business.findByIdAndDelete(userId)
      userRole = 'Business'
    }

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Delete user's uploaded files
    const userUploadDir = path.join(process.cwd(), 'uploads', 'users', userId)
    if (fs.existsSync(userUploadDir)) {
      fs.rmSync(userUploadDir, { recursive: true, force: true })
    }

    res.json({
      success: true,
      message: 'Account deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        email: deletedUser.email,
        role: userRole
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete account', 
      error: error.message 
    })
  }
}
