import express from 'express'
import { 
  signup, 
  login, 
  testAuth, 
  forgotPassword, 
  resetPassword,
  requestPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPasswordWithOTP,
  enableTwoFactorAuth,
  verifyTwoFactorSetup,
  disableTwoFactorAuth,
  changePassword
} from './auth.controller.js'
import { protect } from '../../middleware/auth.js'

const router = express.Router()

// ────── Standard Auth ──────
router.get('/test', testAuth)
router.post('/signup', signup)
router.post('/login', login)
router.get('/test-protected', protect, testAuth)

// ────── Legacy Password Reset (token-based) ──────
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// ────── OTP Password Reset (new system) ──────
router.post('/forgot-password-otp', requestPasswordResetOTP)
router.post('/verify-otp', verifyPasswordResetOTP)
router.post('/reset-password-otp', resetPasswordWithOTP)

// ────── 2FA Authenticator Setup ──────
router.post('/enable-2fa', protect, enableTwoFactorAuth)
router.post('/verify-2fa-setup', protect, verifyTwoFactorSetup)
router.post('/disable-2fa', protect, disableTwoFactorAuth)

// ────── Change Password ──────
router.post('/change-password', protect, changePassword)

export default router


