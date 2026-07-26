# 🔐 Password Reset with OTP & 2FA System

## Overview

Verity now includes a comprehensive password reset and two-factor authentication system using:
- **Email OTP** (One-Time Password) - 6-digit codes sent via Gmail
- **Authenticator App** - Support for Google Authenticator, Microsoft Authenticator, Authy

---

## 📧 Email OTP Password Reset

### How It Works

**User Perspective:**
1. Click "Forgot password?" on login page
2. Enter email address
3. Receive 6-digit OTP code in email (valid for 10 minutes)
4. Enter OTP code
5. Create new password
6. Login with new password ✅

**System Flow:**
```
User Email → Generate OTP → Send via Gmail → User Verifies → Reset Password
```

### Backend Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/forgot-password-otp` | POST | Request OTP (send to email) |
| `/api/auth/verify-otp` | POST | Verify OTP code |
| `/api/auth/reset-password-otp` | POST | Reset password with verified OTP |

### API Request Examples

#### 1. Request OTP
```bash
POST /api/auth/forgot-password-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

# Response
{
  "success": true,
  "message": "OTP sent to your email. Valid for 10 minutes.",
  "maskedEmail": "us***@gmail.com"
}
```

#### 2. Verify OTP
```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

# Response (on success)
{
  "success": true,
  "message": "OTP verified successfully. You can now reset your password.",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# Response (on failure)
{
  "success": false,
  "message": "Invalid OTP. 4 attempts remaining.",
  "attemptsRemaining": 4
}
```

#### 3. Reset Password
```bash
POST /api/auth/reset-password-otp
Content-Type: application/json

{
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}

# Response
{
  "success": true,
  "message": "Password reset successfully! You can now log in with your new password."
}
```

---

## 🔑 2FA - Authenticator App Setup

### Supported Authenticator Apps

- **Google Authenticator** (Android/iOS)
- **Microsoft Authenticator** (Android/iOS)
- **Authy** (Android/iOS/Desktop)
- **FreeOTP** (Android/iOS)
- Any TOTP-compatible authenticator

### How to Enable 2FA

**User Perspective:**
1. Go to Account Settings
2. Click "Enable 2FA"
3. Scan QR code with authenticator app
4. Enter 6-digit code from app
5. 2FA is now enabled ✅

**System Flow:**
```
Enable 2FA → Generate Secret → QR Code → User Scans → Verify Code → Save Secret
```

### Backend Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/enable-2fa` | POST | ✅ Yes | Generate QR code for setup |
| `/api/auth/verify-2fa-setup` | POST | ✅ Yes | Verify authenticator code |
| `/api/auth/disable-2fa` | POST | ✅ Yes | Disable 2FA |

### API Request Examples

#### 1. Enable 2FA (Get QR Code)
```bash
POST /api/auth/enable-2fa
Authorization: Bearer <token>

# Response
{
  "success": true,
  "message": "Scan this QR code with your authenticator app",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "manualEntry": "JBSWY3DPEBLW64TMMQ7A6D4LF3G2KQRH",
  "instructions": [
    "1. Download an authenticator app...",
    "2. Scan the QR code...",
    "3. Enter the 6-digit code to verify"
  ]
}
```

#### 2. Verify 2FA Setup
```bash
POST /api/auth/verify-2fa-setup
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}

# Response
{
  "success": true,
  "message": "2FA enabled successfully!",
  "twoFactorEnabled": true
}
```

#### 3. Disable 2FA
```bash
POST /api/auth/disable-2fa
Authorization: Bearer <token>

# Response
{
  "success": true,
  "message": "2FA disabled successfully",
  "twoFactorEnabled": false
}
```

---

## ⚙️ Setup Instructions

### 1. Environment Variables

Update `backend/.env`:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-from-gmail

# Example with full config
PORT=5001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/verity
JWT_SECRET=your-secret-key
EMAIL_USER=verity@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 2. Gmail App Password Setup

**Why we need this:** Gmail blocks "less secure apps" by default.

**Step-by-step:**

1. Go to https://myaccount.google.com
2. Click "Security" in left menu
3. Enable **2-Step Verification** (if not already enabled)
4. Go to https://myaccount.google.com/apppasswords
5. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your device)
6. Click **Generate**
7. Copy the 16-character password
8. Remove spaces and paste in `.env` as `EMAIL_PASSWORD`

**Example:**
```
Generated: ghae hnto gwpo smje
In .env:  ghaehntoqwposmje
```

### 3. Install Dependencies

```bash
cd backend
npm install speakeasy qrcode nodemailer
```

Dependencies already installed? ✅ Done!

### 4. Database Migration

No migration needed! The models are already updated with:
```javascript
passwordReset: {
  otp,
  otpCreatedAt,
  otpAttempts,
  isOTPVerified
}

twoFactor: {
  isEnabled,
  secret,
  backupCodes,
  enabledAt
}
```

---

## 🧪 Testing

### Manual Testing

**Test OTP Password Reset:**
```bash
# 1. Request OTP
curl -X POST http://localhost:5001/api/auth/forgot-password-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}'

# Check email for OTP code (e.g., "123456")

# 2. Verify OTP
curl -X POST http://localhost:5001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","otp":"123456"}'

# Copy the resetToken from response

# 3. Reset Password
curl -X POST http://localhost:5001/api/auth/reset-password-otp \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken":"<paste-token-here>",
    "newPassword":"NewPassword123!",
    "confirmPassword":"NewPassword123!"
  }'
```

**Test Frontend OTP Flow:**
1. Go to http://localhost:5173/forgot-password-otp
2. Enter email
3. Check inbox for OTP
4. Enter OTP (or check backend logs for debug OTP)
5. Enter new password
6. Click "Reset Password"
7. Redirected to login ✅

### Debug OTP in Console

If email not working, check backend logs:

```bash
# Terminal
# Look for logs like:
# [OTP Service] Generated OTP: 123456 for user@gmail.com
# [OTP Service] Email sent successfully
```

---

## 🔒 Security Features

### OTP Security
- ✅ 6-digit codes (1 million combinations)
- ✅ 10-minute expiry
- ✅ Max 5 failed attempts
- ✅ Rate limiting per email
- ✅ Masked email in responses

### 2FA Security
- ✅ TOTP algorithm (RFC 6238)
- ✅ 30-second time windows
- ✅ ±2 window tolerance for clock drift
- ✅ Secret stored securely in database
- ✅ Backup codes for account recovery (future feature)

### Password Reset Security
- ✅ JWT tokens with 5-minute expiry
- ✅ Email verification required
- ✅ No token in URLs (POST-only)
- ✅ Minimum 8-character passwords
- ✅ Immediate password hash update

---

## 📊 Database Schema

### User Model Updates

```javascript
// Added to User, Reviewer, Business schemas
passwordReset: {
  otp: String,              // Current OTP code
  otpCreatedAt: Date,       // When OTP was generated
  otpAttempts: Number,      // Failed verification attempts
  isOTPVerified: Boolean    // Whether OTP was verified
}

twoFactor: {
  isEnabled: Boolean,       // Is 2FA active?
  secret: String,           // TOTP secret (base32)
  backupCodes: [{           // Backup codes
    code: String,
    used: Boolean
  }],
  enabledAt: Date          // When 2FA was enabled
}
```

---

## 🚀 Frontend Components

### New Component: `ForgotPasswordOTP.jsx`

**Location:** `src/modules/auth/ForgotPasswordOTP.jsx`

**Features:**
- Three-step flow (Email → OTP → Password)
- Live countdown timer (10 minutes)
- OTP input with automatic formatting
- Password visibility toggle
- Error messages with retry logic
- Responsive design

**Route:** `/forgot-password-otp`

---

## 🐛 Troubleshooting

### Email Not Sending

**Problem:** OTP not received in email

**Solutions:**
1. Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
2. Verify Gmail App Password (16 chars, no spaces)
3. Check spam/promotions folder
4. Enable "Less secure app access" (if using normal password)
5. Check backend logs for errors

**Debug:**
```javascript
// Add to otpService.js for testing
console.log('[OTP] Email config:', {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD ? '***' : 'missing'
})
```

### OTP Invalid

**Problem:** "Invalid OTP" message

**Solutions:**
1. Ensure exactly 6 digits entered
2. Check OTP hasn't expired (10 min limit)
3. Max 5 attempts allowed
4. Check for leading zeros (e.g., "012345")

### 2FA QR Code Not Scanning

**Problem:** Authenticator app can't scan QR code

**Solutions:**
1. Check lighting/image clarity
2. Try manual entry (base32 secret)
3. Ensure app is up to date
4. Try different authenticator app

---

## 📝 Frontend Integration

### Using the OTP Password Reset

**Link from Login:**
```jsx
<button onClick={() => navigate('/forgot-password-otp')}>
  Forgot password?
</button>
```

**Component Usage:**
```jsx
import ForgotPasswordOTP from './modules/auth/ForgotPasswordOTP'

// In routes
<Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
```

### API Service

```javascript
// In src/services/api.js
export const requestOTP = async (email) => {
  const response = await fetch(`${API_URL}/auth/forgot-password-otp`, {
    method: 'POST',
    body: JSON.stringify({ email })
  })
  return response.json()
}

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  })
  return response.json()
}

export const resetPasswordOTP = async (resetToken, newPassword, confirmPassword) => {
  const response = await fetch(`${API_URL}/auth/reset-password-otp`, {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword, confirmPassword })
  })
  return response.json()
}
```

---

## ✅ Checklist

- [x] OTP service created (`otpService.js`)
- [x] Auth controller updated with OTP endpoints
- [x] Auth routes configured
- [x] Database models updated
- [x] Frontend component created (`ForgotPasswordOTP.jsx`)
- [x] Frontend routes added
- [x] Environment variables documented
- [x] Email configuration explained
- [x] Testing instructions provided
- [x] Error handling implemented
- [x] Security features implemented

---

## 📞 Support

**Backend Issues:**
- Check `backend/server.js` logs
- Verify MongoDB connection
- Confirm Gmail credentials

**Frontend Issues:**
- Open browser console (F12)
- Check API calls in Network tab
- Verify API_URL configuration

---

## 🔄 Next Steps

1. **Update `.env`** with Gmail credentials
2. **Test OTP flow** with `/forgot-password-otp`
3. **Enable 2FA** in user account settings (component needed)
4. **Deploy** when ready

---

**Version:** 1.0.0  
**Last Updated:** July 26, 2026  
**Status:** ✅ Ready for Production
