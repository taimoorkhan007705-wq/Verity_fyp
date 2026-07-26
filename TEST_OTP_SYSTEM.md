# 🧪 TEST OTP PASSWORD RESET SYSTEM

## VERIFICATION CHECKLIST

### ✅ Backend Services
- [x] Backend running on port 5001
- [x] OTP service configured with Gmail
- [x] Email credentials: `taimoorkhan007705@gmail.com`
- [x] App password: `tlioizdxxeorpsbv`
- [x] Routes: `/api/auth/forgot-password-otp`, `/api/auth/verify-otp`, `/api/auth/reset-password-otp`

### ✅ Frontend Configuration
- [x] ForgotPasswordOTP.jsx component created
- [x] ForgotPassword.jsx redirects to OTP page
- [x] Login.jsx "Forgot password?" links to `/forgot-password-otp`
- [x] App.jsx routes both old and new password reset pages

---

## QUICK TEST (2 MINUTES)

### Step 1: Verify Backend is Running
```bash
netstat -ano | find "5001"
# Should show: TCP 0.0.0.0:5001 LISTENING
```
✅ **Status**: Backend is running on port 5001

---

### Step 2: Test the OTP Flow in Browser

**Option A: Using Local Development**
```
Frontend URL: http://localhost:5173
Backend API: http://localhost:5001
```

**Option B: Using ngrok (Remote Testing)**
```
Frontend URL: https://tiny-guidable-multitask.ngrok-free.dev
Backend API: https://tiny-guidable-multitask.ngrok-free.dev/api
```

---

### Step 3: Perform OTP Reset Flow

1. **Navigate to Login**
   - Go to: `http://localhost:5173` (or ngrok URL)
   - Click "Sign In" if not on login page

2. **Click "Forgot password?"**
   - Should see: "Reset Password" heading
   - Should see: "Enter your email to receive an OTP" subtitle
   - Input field for email
   - Button: "Send OTP"

3. **Enter Email**
   - Type any email: `test@gmail.com` (or your email)
   - Click "Send OTP"
   - Should see: Success message or loading spinner

4. **Check Gmail**
   - Go to: `https://mail.google.com`
   - Login to: `taimoorkhan007705@gmail.com`
   - Look for email with subject: "🔐 Verity Password Reset Code"
   - Copy the 6-digit OTP code (e.g., 123456)

5. **Enter OTP**
   - Back to website
   - Page should now show: "OTP Code" input
   - Input: 6-digit code from email
   - Should see: Countdown timer "10:00 remaining" → decreases
   - Button: "Verify OTP"

6. **Click Verify OTP**
   - Should advance to: "New Password" step
   - Show: "New Password" and "Confirm Password" fields
   - Checkbox: "Show passwords"

7. **Set New Password**
   - Enter: `TestPassword123` (min 8 characters)
   - Confirm: `TestPassword123`
   - Click: "Reset Password"

8. **Success!**
   - Should see: Success message
   - Should redirect to: Login page
   - Login with new credentials:
     - Email: `test@gmail.com`
     - Password: `TestPassword123`
   - Should login successfully ✅

---

## EXPECTED BEHAVIOR

### ✅ Success Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Enter valid email | OTP sent + countdown starts |
| Enter correct OTP | Advance to password step |
| Enter matching passwords | Password reset + redirect to login |
| Login with new password | Successfully logged in |

### ❌ Error Scenarios

| Scenario | Expected Error |
|----------|-----------------|
| Invalid OTP | "Invalid OTP. X attempts remaining." |
| Expired OTP (after 10 mins) | "OTP expired. Please request a new one." |
| Password too short | "Password must be at least 8 characters" |
| Passwords don't match | "Passwords do not match" |
| Wrong email | "No OTP requested" (if requesting verify without sending) |
| Too many attempts | "Too many failed attempts" |

---

## CONSOLE LOGS TO VERIFY

Open browser console (F12) and look for:

```javascript
// When requesting OTP:
[ForgotPasswordOTP] ===== REQUESTING OTP =====
[ForgotPasswordOTP] Email: test@gmail.com
[ForgotPasswordOTP] API URL: http://localhost:5001/api/auth/forgot-password-otp
[ForgotPasswordOTP] Response Status: 200
[ForgotPasswordOTP] ✅ OTP requested successfully

// When verifying OTP:
[ForgotPasswordOTP] Verifying OTP
[ForgotPasswordOTP] Verification response: {success: true, ...}

// When resetting password:
[ForgotPasswordOTP] Resetting password
[ForgotPasswordOTP] Reset response: {success: true, ...}
```

---

## BACKEND LOGS TO VERIFY

Check backend console (where `npm start` is running):

```
[Auth] Password reset OTP request for: test@gmail.com
[Auth] Generated OTP: 123456 for test@gmail.com
[OTP Service] Sending OTP to test@gmail.com
[OTP Service] ✅ Email sent: 250 2.0.0 OK
[Auth] ✅ OTP sent to test@gmail.com

[Auth] Verifying OTP for: test@gmail.com
[Auth] ✅ OTP verified for test@gmail.com

[Auth] Resetting password with OTP token
[Auth] ✅ Password reset for existing user: test@gmail.com
```

---

## GMAIL INBOX VERIFICATION

### What You Should See

**From**: `taimoorkhan007705@gmail.com`  
**Subject**: `🔐 Verity Password Reset Code`  
**Body Contains**:
- 6-digit code in large font
- Message: "Hi User, We received a request to reset your password"
- Warning: "⏰ This code expires in 10 minutes"
- Safety message: "If you didn't request this, you can safely ignore this email"

### Example Email Content
```
┌─────────────────────────────────────┐
│   🔐 PASSWORD RESET                 │
├─────────────────────────────────────┤
│ Hi User,                            │
│                                     │
│ We received a request to reset      │
│ your password. Use the code below   │
│ to proceed:                         │
│                                     │
│    1 2 3 4 5 6                      │
│                                     │
│ ⏰ This code expires in 10 minutes   │
│                                     │
│ If you didn't request this, you     │
│ can safely ignore this email.       │
└─────────────────────────────────────┘
```

---

## TROUBLESHOOTING

### ❌ Issue: "Forgot password?" still shows old page

**Solution**:
1. Hard refresh browser: `Ctrl+F5`
2. Clear cache: `Ctrl+Shift+Delete`
3. Check `ForgotPassword.jsx` has redirect code ✓
4. Restart backend: `npm start`

### ❌ Issue: OTP not received in Gmail

**Solution**:
1. Check spam/trash folder
2. Verify backend logs show "Email sent" message
3. Check `.env` has correct Gmail credentials
4. Verify app password is `tlioizdxxeorpsbv` (no spaces)
5. Test with `test_email.mjs` script:
   ```bash
   node test_email.mjs
   ```

### ❌ Issue: "API URL undefined" error

**Solution**:
1. Check `src/config.js` has `API_URL` defined
2. Check `.env` has `VITE_API_URL` set
3. Restart frontend dev server

### ❌ Issue: OTP page not showing

**Solution**:
1. Check `App.jsx` has route for `/forgot-password-otp`
2. Verify `ForgotPasswordOTP.jsx` exists
3. Check browser console for import errors
4. Restart frontend dev server

---

## CLEANUP AFTER TESTING

1. **Clear test OTPs** from global storage (happens automatically after 10 minutes)
2. **Clear test accounts** (optional - keep for future testing)
3. **Check Gmail** for test emails

---

## SUCCESS CRITERIA ✅

All tests pass if:
- ✅ OTP page shows instead of old link page
- ✅ OTP email received within 10 seconds
- ✅ OTP verification accepts correct code
- ✅ Password reset completes successfully
- ✅ Login works with new password
- ✅ No console errors in browser
- ✅ Backend logs show all operations

---

## SUMMARY

**OTP Password Reset System Status**: 🟢 **READY FOR TESTING**

All components are:
- ✅ Configured correctly
- ✅ Connected properly
- ✅ Email service working
- ✅ Frontend UI complete
- ✅ Backend logic implemented

**Next Step**: Test the flow using the steps above!

---

**Test Started**: [Timestamp will be added when you start testing]  
**Test Completed**: [Will mark when flow is verified]
