import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
import Post from '../../models/Post.js'
import { assignReviewersToPost } from '../../services/reviewerAssignment.js'
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../services/emailService.js'
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '30d' })
}
const getModelByRole = (role) => {
  const models = { Reviewer, Business, User }
  return models[role] || User
}
const cleanFullName = (fullName) => {
  if (!fullName) return fullName
  const nameParts = fullName.trim().split(/\s+/)
  const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))]
  return uniqueParts.map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join(' ')
}
export const signup = async (req, res) => {
  try {
    let { fullName, name, email, password, role } = req.body
    fullName = fullName || name
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide fullName (or name), email, and password' 
      })
    }
    fullName = cleanFullName(fullName)
    const existingUser = await User.findOne({ email }) || 
                         await Reviewer.findOne({ email}) || 
                         await Business.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }
    const Model = getModelByRole(role)
    const userData = {
      email,
      password,
      role: role || 'User',
      user_info: {
        fullName,
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || ''
      },
      profile_info: {},
      social_stats: {},
      trust_security: {},
      activity_tracking: {}
    }
    const user = await Model.create(userData)

    if (user.role === 'Reviewer') {
      try {
        const pendingPosts = await Post.find({ verificationStatus: 'awaiting_review' }).select('_id')
        for (const post of pendingPosts) {
          await assignReviewersToPost(post._id)
        }
      } catch (assignError) {
        console.warn('Could not assign existing pending review posts to the new reviewer:', assignError.message)
      }
    }

    const token = generateToken(user._id, user.role)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.user_info.fullName,
        email: user.email,
        role: user.role,
        avatar: user.profile_info.avatar,
        trustScore: user.trust_security?.trustScore || 50
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message })
  }
}
export const testAuth = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Auth API is working!',
      timestamp: new Date().toISOString(),
      user: req.user ? {
        id: req.user.id,
        role: req.user.role
      } : null
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Test failed', error: error.message })
  }
}
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body
    const normalizedRole = role || 'User'

    let Model = User
    let filter = { email }

    if (normalizedRole === 'Reviewer') {
      Model = Reviewer
    } else if (normalizedRole === 'Business') {
      Model = Business
    } else if (normalizedRole === 'Admin') {
      Model = User
      filter = { email, role: 'Admin' }
    } else {
      Model = User
      filter = { email, role: 'User' }
    }

    const foundUser = await Model.findOne(filter)

    if (!foundUser) {
      return res.status(401).json({ 
        success: false, 
        message: `No ${normalizedRole.toLowerCase()} account found with this email address` 
      })
    }

    const isPasswordValid = await foundUser.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      })
    }

    const token = generateToken(foundUser._id, foundUser.role)
    res.status(200).json({
      success: true,
      token,
      user: {
        id: foundUser._id,
        fullName: foundUser.user_info?.fullName || foundUser.fullName,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.profile_info?.avatar || foundUser.avatar,
        trustScore: foundUser.trust_security?.trustScore || foundUser.trustScore || 50,
        reviewsCompleted: foundUser.reviewer_stats?.reviewsCompleted || foundUser.reviewsCompleted,
        accuracy: foundUser.reviewer_stats?.accuracy || foundUser.accuracy,
        pendingReviews: foundUser.reviewer_stats?.reviewsPending || foundUser.pendingReviews,
        businessType: foundUser.business_details?.businessType || foundUser.businessType,
        subscriptionPlan: foundUser.subscription?.plan || foundUser.subscriptionPlan,
        totalPosts: foundUser.business_analytics?.totalPosts || foundUser.totalPosts
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' })
    }
    
    // Check all user tables
    let foundUser = await User.findOne({ email })
    if (!foundUser) {
      foundUser = await Reviewer.findOne({ email })
    }
    if (!foundUser) {
      foundUser = await Business.findOne({ email })
    }
    
    if (!foundUser) {
      return res.status(404).json({ success: false, message: 'No account found with this email' })
    }
    
    // Generate reset token (valid for 15 minutes)
    const resetToken = jwt.sign({ id: foundUser._id, type: 'reset' }, process.env.JWT_SECRET, { expiresIn: '15m' })
    
    // Store reset token in user document
    foundUser.resetToken = resetToken
    foundUser.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    await foundUser.save()
    
    // Build reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    
    // Send email with reset link
    const emailResult = await sendPasswordResetEmail(email, resetToken, resetLink)
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email service temporarily unavailable. Try again later.',
        error: emailResult.error
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email. Please check your inbox.',
      // Don't return resetToken in production - only for testing
      testToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process forgot password', error: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
    }
    
    // Verify token
    let decoded
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Reset token expired or invalid. Please request a new one.' })
    }
    
    // Find user and check token
    let foundUser = await User.findById(decoded.id)
    if (!foundUser) {
      foundUser = await Reviewer.findById(decoded.id)
    }
    if (!foundUser) {
      foundUser = await Business.findById(decoded.id)
    }
    
    if (!foundUser || foundUser.resetToken !== resetToken) {
      return res.status(400).json({ success: false, message: 'Invalid reset token' })
    }
    
    if (new Date() > foundUser.resetTokenExpiry) {
      return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' })
    }
    
    // Update password
    foundUser.password = newPassword
    foundUser.resetToken = undefined
    foundUser.resetTokenExpiry = undefined
    await foundUser.save()
    
    res.status(200).json({ success: true, message: 'Password reset successfully! You can now log in with your new password.' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message })
  }
}


