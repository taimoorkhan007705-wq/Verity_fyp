import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
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
    const token = generateToken(user._id)

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

    const userInUsers = await User.findOne({ email })
    const userInReviewers = await Reviewer.findOne({ email })
    const userInBusinesses = await Business.findOne({ email })

    let foundUser = null
    let actualRole = null

    if (userInUsers) {
      foundUser = userInUsers
      actualRole = 'User'
    } else if (userInReviewers) {
      foundUser = userInReviewers
      actualRole = 'Reviewer'
    } else if (userInBusinesses) {
      foundUser = userInBusinesses
      actualRole = 'Business'
    }

    if (!foundUser) {
      return res.status(401).json({ 
        success: false, 
        message: 'No account found with this email address' 
      })
    }

    if (actualRole !== role) {
      return res.status(401).json({ 
        success: false, 
        message: `This email is registered as a ${actualRole} account. Please select ${actualRole} to login.` 
      })
    }

    const isPasswordValid = await foundUser.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      })
    }

    const token = generateToken(foundUser._id)

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
