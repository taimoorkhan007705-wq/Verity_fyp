import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Reviewer from '../models/Reviewer.js'
import Business from '../models/Business.js'
const getModelByRole = (role) => {
  const models = { Reviewer, Business, User }
  return models[role] || User
}
export const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
      console.log('[Auth] No token provided')
      return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const requestedRole = decoded.role
    const Model = getModelByRole(requestedRole)
    const user = await Model.findById(decoded.id).select('-password')

    if (!user) {
      console.log('[Auth] User not found for ID:', decoded.id)
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('[Auth] Protect middleware error:', error.message)
    res.status(401).json({ success: false, message: 'Not authorized, token failed', error: error.message })
  }
}
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user.role} is not allowed to perform this action` 
      })
    }
    next()
  }
}

