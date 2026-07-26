import nodemailer from 'nodemailer'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
})

// ═══════════════════════════════════════════════════════════════
// 📧 EMAIL OTP SERVICE
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to user's email
 */
export const sendOTPEmail = async (email, otp, userName = 'User') => {
  try {
    console.log(`[OTP Service] Sending OTP to ${email}`)
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@verity.com',
      to: email,
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
            
            <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
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
    
    const info = await transporter.sendMail(mailOptions)
    console.log(`[OTP Service] ✅ Email sent: ${info.response}`)
    return true
  } catch (error) {
    console.error(`[OTP Service] ❌ Failed to send email:`, error.message)
    throw new Error('Failed to send OTP email')
  }
}

// ═══════════════════════════════════════════════════════════════
// 🔑 AUTHENTICATOR APP SERVICE
// ═══════════════════════════════════════════════════════════════

/**
 * Generate authenticator secret and QR code
 */
export const generateAuthenticatorSecret = async (email, appName = 'Verity') => {
  try {
    console.log(`[Auth Service] Generating secret for ${email}`)
    
    const secret = speakeasy.generateSecret({
      name: `${appName} (${email})`,
      issuer: appName,
      length: 32
    })
    
    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(secret.otpauth_url)
    
    console.log(`[Auth Service] ✅ Secret generated`)
    
    return {
      secret: secret.base32,
      qrCode: qrCode,
      manualEntry: secret.base32,
      message: `Scan this QR code with Google Authenticator, Microsoft Authenticator, or Authy`
    }
  } catch (error) {
    console.error(`[Auth Service] ❌ Failed to generate secret:`, error.message)
    throw new Error('Failed to generate authenticator secret')
  }
}

/**
 * Verify authenticator code
 */
export const verifyAuthenticatorCode = (secret, code) => {
  try {
    console.log(`[Auth Service] Verifying code`)
    
    const isValid = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: 2 // Allow codes from ±2 time windows (2 * 30 = 60 seconds)
    })
    
    console.log(`[Auth Service] Code verification:`, isValid ? '✅ Valid' : '❌ Invalid')
    return isValid
  } catch (error) {
    console.error(`[Auth Service] ❌ Verification error:`, error.message)
    return false
  }
}

/**
 * Verify OTP code
 */
export const verifyOTP = (storedOTP, providedOTP) => {
  if (!storedOTP || !providedOTP) {
    console.warn('[OTP Service] Missing OTP values')
    return false
  }
  const isValid = storedOTP === providedOTP
  console.log(`[OTP Service] OTP verification:`, isValid ? '✅ Valid' : '❌ Invalid')
  return isValid
}

/**
 * Check if OTP is expired (10 minutes)
 */
export const isOTPExpired = (createdAt) => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  const isExpired = new Date(createdAt) < tenMinutesAgo
  console.log(`[OTP Service] OTP expiry check:`, isExpired ? '⏰ Expired' : '✅ Valid')
  return isExpired
}

export default {
  generateOTP,
  sendOTPEmail,
  generateAuthenticatorSecret,
  verifyAuthenticatorCode,
  verifyOTP,
  isOTPExpired
}
