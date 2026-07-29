import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import User from '../../models/User.js'
import Reviewer from '../../models/Reviewer.js'
import Business from '../../models/Business.js'
import Post from '../../models/Post.js'
import { assignReviewersToPost } from '../../services/reviewerAssignment.js'
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../services/emailService.js'
import { 
  generateOTP, 
  sendOTPEmail, 
  verifyOTP, 
  isOTPExpired,
  generateAuthenticatorSecret,
  verifyAuthenticatorCode
} from '../../services/otpService.js'
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
    
    // If user wants to be a Reviewer, create them as User instead and submit a request
    const userRole = role === 'Reviewer' ? 'User' : (role || 'User')
    const shouldRequestReviewer = role === 'Reviewer'
    
    const Model = getModelByRole(userRole)
    const userData = {
      email,
      password,
      role: userRole,
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

    // If user requested Reviewer role, create a reviewer request
    if (shouldRequestReviewer) {
      const ReviewerRequest = (await import('../../models/ReviewerRequest.js')).default
      await ReviewerRequest.create({
        user: user._id,
        email: user.email,
        fullName: user.user_info.fullName,
        status: 'pending'
      })
    }

    // Don't return token if requesting reviewer role - they must wait for admin approval
    if (shouldRequestReviewer) {
      console.log('[SIGNUP] Reviewer request detected, NOT returning token')
      console.log('[SIGNUP] Returning response with waitingForApproval: true')
      return res.status(201).json({
        success: true,
        message: 'Signup successful! Your reviewer request has been sent to admin. Please wait for approval before you can login.',
        waitingForApproval: true,
        user: {
          id: user._id,
          fullName: user.user_info.fullName,
          email: user.email,
          role: 'User'
        }
      })
    }

    console.log('[SIGNUP] Regular user signup, returning token')
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

    // Check if user is blocked
    if (foundUser.trust_security?.isBlocked) {
      return res.status(403).json({ 
        success: false, 
        message: `Your account has been blocked. Reason: ${foundUser.trust_security?.blockedReason || 'Violation of terms'}. Please contact support.` 
      })
    }

    const token = generateToken(foundUser._id, foundUser.role)
    return res.status(200).json({
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
    console.error('[Auth] Login error:', error)
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message })
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



// ═══════════════════════════════════════════════════════════════
// 📧 OTP PASSWORD RESET SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Send OTP using the user's own email OR fallback to main account
 */
const sendOTPEmailForUser = async (user, targetEmail, otp, userName) => {
  let transporter = null
  
  // Check if user has their own email credentials stored
  if (user && user.emailConfig && user.emailConfig.email && user.emailConfig.password) {
    console.log(`[OTP Service] Using user's own email: ${user.emailConfig.email}`)
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: user.emailConfig.email,
          pass: user.emailConfig.password
        }
      })
      
      // Test the transporter
      await new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
          if (error) reject(error)
          else resolve(success)
        })
      })
      
      console.log(`[OTP Service] ✅ User's email transporter verified`)
    } catch (error) {
      console.warn(`[OTP Service] ⚠️ User's email failed, falling back to main account`)
      console.warn(`[OTP Service] Error:`, error.message)
      transporter = null
    }
  }
  
  // Fallback to main account
  if (!transporter) {
    console.log(`[OTP Service] Using main account: ${process.env.EMAIL_USER}`)
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }
  
  // Send the email
  const mailOptions = {
    from: user?.emailConfig?.email || process.env.EMAIL_USER || 'noreply@verity.com',
    to: targetEmail,
    subject: '🔐 Verity Password Reset Code',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
        </div>
        
        <div style="background: white; padding: 40px; text-align: center; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="color: #1f2937; font-size: 16px; margin-bottom: 30px;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 30px;">
            We received a request to reset your password. Use the code below to proceed:
          </p>
          
          <div style="background: #f0fdfa; border: 3px dashed #14b8a6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <div style="font-size: 48px; font-weight: 900; color: #14b8a6; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #ef4444; font-size: 14px; font-weight: 600; margin-bottom: 30px;">
            ⏰ This code expires in 10 minutes
          </p>
          
          <p style="color: #6b7280; font-size: 12px; line-height: 1.6;">
            If you didn't request this, you can safely ignore this email.<br>
            Your account remains secure.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #94a3b8; font-size: 11px;">
            © ${new Date().getFullYear()} Verity. All rights reserved.
          </p>
        </div>
      </div>
    `
  }
  
  try {
    const result = await transporter.sendMail(mailOptions)
    console.log(`[OTP Service] ✅ Email sent via ${mailOptions.from}`)
    console.log(`[OTP Service] Message ID: ${result.messageId}`)
    return true
  } catch (error) {
    console.error(`[OTP Service] ❌ Failed to send email:`, error.message)
    throw new Error('Failed to send OTP email')
  }
}

/**
 * Step 1: Request password reset - Send OTP ONLY if email exists in database
 * Must be an existing User/Reviewer/Business account
 */
export const requestPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      })
    }
    
    console.log(`[Auth] ===== OTP REQUEST =====`)
    console.log(`[Auth] Email: ${email}`)
    
    // REQUIRED: Check if user exists in database
    let foundUser = await User.findOne({ email })
    let userType = 'User'
    
    if (!foundUser) {
      foundUser = await Reviewer.findOne({ email })
      if (foundUser) userType = 'Reviewer'
    }
    
    if (!foundUser) {
      foundUser = await Business.findOne({ email })
      if (foundUser) userType = 'Business'
    }
    
    // EMAIL MUST EXIST IN DATABASE
    if (!foundUser) {
      console.log(`[Auth] ❌ Email not found in any database: ${email}`)
      return res.status(404).json({
        success: false,
        message: 'This email does not exist in our system. Please sign up first.',
        code: 'EMAIL_NOT_FOUND'
      })
    }
    
    console.log(`[Auth] ✅ Found ${userType}: ${foundUser.email}`)
    
    const targetEmail = foundUser.email
    const userName = foundUser.user_info?.fullName || foundUser.fullName || foundUser.business_details?.businessName || 'User'
    
    // Check if user has their own email configured
    if (foundUser.emailConfig?.email) {
      console.log(`[Auth] User has own email configured: ${foundUser.emailConfig.email}`)
    } else {
      console.log(`[Auth] Using main account for delivery`)
    }
    
    // Generate OTP
    const otp = generateOTP()
    console.log(`[Auth] Generated OTP: ${otp}`)
    
    // Send OTP using user's email or fallback
    try {
      await sendOTPEmailForUser(foundUser, targetEmail, otp, userName)
      console.log(`[Auth] ✅ OTP sent successfully to ${targetEmail}`)
    } catch (emailError) {
      console.error(`[Auth] Email send failed:`, emailError.message)
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again later.',
        error: emailError.message
      })
    }
    
    // Store OTP in temporary storage with expiry
    if (!global.otpStorage) {
      global.otpStorage = {}
    }
    
    global.otpStorage[email] = {
      otp: otp,
      createdAt: new Date(),
      attempts: 0,
      verified: false,
      targetEmail: targetEmail,
      userType: userType,
      userId: foundUser._id,
      userExists: true
    }
    
    console.log(`[Auth] ✅ OTP stored for: ${email}`)
    console.log(`[Auth] ===== END REQUEST =====\n`)
    
    res.status(200).json({
      success: true,
      message: `OTP sent to ${targetEmail}. Valid for 10 minutes.`,
      maskedEmail: targetEmail.replace(/(.{2})(.*)(@)/, '$1***$3'),
      userExists: true,
      userType: userType
    })
  } catch (error) {
    console.error('[Auth] Request OTP error:', error)
    console.error('[Auth] Stack:', error.stack)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again.',
      error: error.message 
    })
  }
}

/**
 * Step 2: Verify OTP (doesn't need account lookup)
 */
export const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      })
    }
    
    console.log(`[Auth] Verifying OTP for: ${email}`)
    
    // Initialize storage if needed
    if (!global.otpStorage) {
      global.otpStorage = {}
    }
    
    // Check if OTP exists for this email
    if (!global.otpStorage[email]) {
      console.log(`[Auth] No OTP found for: ${email}`)
      return res.status(400).json({ 
        success: false, 
        message: 'No OTP requested. Please request a new one.' 
      })
    }
    
    const otpRecord = global.otpStorage[email]
    
    // Check if OTP is expired (10 minutes)
    if (isOTPExpired(otpRecord.createdAt)) {
      console.log(`[Auth] OTP expired for: ${email}`)
      delete global.otpStorage[email]
      return res.status(400).json({ 
        success: false, 
        message: 'OTP expired. Please request a new one.' 
      })
    }
    
    // Check attempts (max 5)
    if ((otpRecord.attempts || 0) >= 5) {
      console.log(`[Auth] Too many attempts for: ${email}`)
      delete global.otpStorage[email]
      return res.status(429).json({ 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      })
    }
    
    // Verify OTP
    const isValidOTP = verifyOTP(otpRecord.otp, otp)
    
    if (!isValidOTP) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1
      const remainingAttempts = 5 - otpRecord.attempts
      console.log(`[Auth] Invalid OTP for ${email}. Attempts: ${otpRecord.attempts}/5`)
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        attemptsRemaining: remainingAttempts
      })
    }
    
    // OTP is valid - mark as verified
    otpRecord.verified = true
    console.log(`[Auth] ✅ OTP verified for ${email}`)
    
    // Generate temporary reset token (valid for 5 minutes)
    const tempToken = jwt.sign(
      { email, type: 'otp-reset', verified: true, targetEmail: otpRecord.targetEmail },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    )
    
    console.log(`[Auth] Generated reset token for ${email}`)
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.',
      resetToken: tempToken
    })
  } catch (error) {
    console.error('[Auth] Verify OTP error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP',
      error: error.message 
    })
  }
}

/**
 * Step 3: Reset password with verified OTP token
 * Updates password for email (finds user account if exists)
 */
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body
    
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      })
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      })
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters' 
      })
    }
    
    console.log('[Auth] Resetting password with OTP token')
    
    // Verify token
    let decoded
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
      if (decoded.type !== 'otp-reset' || !decoded.verified) {
        throw new Error('Invalid token type')
      }
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      })
    }
    
    const email = decoded.email
    const targetEmail = decoded.targetEmail || email
    
    console.log(`[Auth] Processing password reset for: ${email}`)
    console.log(`[Auth] Target email: ${targetEmail}`)
    
    // Find user by email in any collection (User, Reviewer, or Business)
    let foundUser = await User.findOne({ email })
    if (!foundUser) foundUser = await Reviewer.findOne({ email })
    if (!foundUser) foundUser = await Business.findOne({ email })
    
    // If user exists, update password
    if (foundUser) {
      console.log(`[Auth] ✅ User found in ${foundUser.constructor.modelName}. Updating password...`)
      foundUser.password = newPassword
      foundUser.passwordReset = {
        otp: null,
        otpCreatedAt: null,
        otpAttempts: 0,
        isOTPVerified: false
      }
      await foundUser.save()
      console.log(`[Auth] ✅ Password updated successfully for user: ${email}`)
    } else {
      console.log(`[Auth] ℹ️ No account found for ${email}`)
      console.log(`[Auth] New user can create account or sign up with email: ${email}`)
    }
    
    // Clean up OTP storage
    if (global.otpStorage && global.otpStorage[email]) {
      delete global.otpStorage[email]
      console.log(`[Auth] Cleaned up OTP storage for ${email}`)
    }
    
    // Generate login token if user exists
    let token = null
    if (foundUser) {
      token = generateToken(foundUser._id, foundUser.role)
      console.log(`[Auth] ✅ Generated login token for ${email}`)
    }
    
    res.status(200).json({
      success: true,
      message: foundUser 
        ? '🎉 Password reset successfully! You are now logged in.'
        : 'Password reset successful! You can now create your account or log in.',
      token: token, // Auto-login token
      autoLogin: foundUser ? true : false,
      user: foundUser ? {
        id: foundUser._id,
        fullName: foundUser.user_info?.fullName || foundUser.fullName,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.profile_info?.avatar || foundUser.avatar,
        trustScore: foundUser.trust_security?.trustScore || 50
      } : null
    })
  } catch (error) {
    console.error('[Auth] Reset password error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset password',
      error: error.message 
    })
  }
}

// ═══════════════════════════════════════════════════════════════
// 🔑 2FA AUTHENTICATOR APP SETUP
// ═══════════════════════════════════════════════════════════════

/**
 * Enable 2FA - Generate QR code
 */
export const enableTwoFactorAuth = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      })
    }
    
    console.log('[Auth] Enabling 2FA for user:', userId)
    
    // Find user
    let foundUser = await User.findById(userId)
    if (!foundUser) foundUser = await Reviewer.findById(userId)
    if (!foundUser) foundUser = await Business.findById(userId)
    
    if (!foundUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      })
    }
    
    // Generate authenticator secret
    const { secret, qrCode, manualEntry } = await generateAuthenticatorSecret(
      foundUser.email,
      'Verity'
    )
    
    // Store temporary secret (not enabled yet)
    foundUser.twoFactor.secret = secret
    await foundUser.save()
    
    console.log('[Auth] ✅ 2FA QR code generated for:', foundUser.email)
    
    res.status(200).json({
      success: true,
      message: 'Scan this QR code with your authenticator app',
      qrCode: qrCode,
      manualEntry: manualEntry,
      instructions: [
        '1. Download an authenticator app (Google Authenticator, Microsoft Authenticator, or Authy)',
        '2. Scan the QR code or enter the key manually',
        '3. Enter the 6-digit code to verify'
      ]
    })
  } catch (error) {
    console.error('[Auth] Enable 2FA error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to enable 2FA',
      error: error.message 
    })
  }
}

/**
 * Verify 2FA setup - User enters code from authenticator app
 */
export const verifyTwoFactorSetup = async (req, res) => {
  try {
    const userId = req.user?.id
    const { code } = req.body
    
    if (!userId || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and verification code required' 
      })
    }
    
    console.log('[Auth] Verifying 2FA setup for user:', userId)
    
    // Find user
    let foundUser = await User.findById(userId)
    if (!foundUser) foundUser = await Reviewer.findById(userId)
    if (!foundUser) foundUser = await Business.findById(userId)
    
    if (!foundUser || !foundUser.twoFactor?.secret) {
      return res.status(400).json({ 
        success: false, 
        message: 'No 2FA secret found. Please initiate 2FA setup first.' 
      })
    }
    
    // Verify code
    const isValidCode = verifyAuthenticatorCode(foundUser.twoFactor.secret, code)
    
    if (!isValidCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code. Please try again.' 
      })
    }
    
    // Enable 2FA
    foundUser.twoFactor.isEnabled = true
    foundUser.twoFactor.enabledAt = new Date()
    await foundUser.save()
    
    console.log('[Auth] ✅ 2FA enabled for:', foundUser.email)
    
    res.status(200).json({
      success: true,
      message: '2FA enabled successfully!',
      twoFactorEnabled: true
    })
  } catch (error) {
    console.error('[Auth] Verify 2FA error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify 2FA setup',
      error: error.message 
    })
  }
}

/**
 * Disable 2FA
 */
export const disableTwoFactorAuth = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      })
    }
    
    console.log('[Auth] Disabling 2FA for user:', userId)
    
    // Find user
    let foundUser = await User.findById(userId)
    if (!foundUser) foundUser = await Reviewer.findById(userId)
    if (!foundUser) foundUser = await Business.findById(userId)
    
    if (!foundUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      })
    }
    
    // Disable 2FA
    foundUser.twoFactor = {
      isEnabled: false,
      secret: null,
      backupCodes: [],
      enabledAt: null
    }
    await foundUser.save()
    
    console.log('[Auth] ✅ 2FA disabled for:', foundUser.email)
    
    res.status(200).json({
      success: true,
      message: '2FA disabled successfully',
      twoFactorEnabled: false
    })
  } catch (error) {
    console.error('[Auth] Disable 2FA error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to disable 2FA',
      error: error.message 
    })
  }
}

// Change password endpoint
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user?.id || req.body.userId
    const userRole = req.user?.role || req.body.role

    console.log('[Auth] Change password request for:', userId, 'Role:', userRole)

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      })
    }

    // Get the user model based on role
    const UserModel = getModelByRole(userRole)
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role'
      })
    }

    // Find user
    const user = await UserModel.findById(userId)
    if (!user) {
      console.log('[Auth] User not found:', userId)
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      console.log('[Auth] Current password incorrect for:', user.email)
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    console.log('[Auth] ✅ Password changed successfully for:', user.email)

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('[Auth] Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    })
  }
}
