# ⚡ Quick Start: Test OTP System in 2 Minutes

## 🚀 Start Here

### Step 1: Make sure servers are running
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd Verity_FYP
npm run dev
```

### Step 2: Open browser
- Frontend: http://localhost:5173
- You should see the login page

---

## 🔐 Test OTP Password Reset

### 1️⃣ Click "Forgot password?"
- On login page, click the link in bottom right

### 2️⃣ You're now on `/forgot-password-otp`
- Beautiful page with "Reset Password" title

### 3️⃣ Enter email
- Email: `taimoorkhan007705@gmail.com`
- Click "Send OTP"

### 4️⃣ Check Gmail inbox
- Wait 1-2 seconds
- Look for email: "🔐 Verity Password Reset Code"
- **Copy the 6-digit code** (e.g., "123456")

### 5️⃣ Enter OTP code
- Paste 6-digit code into the OTP field
- Countdown timer shows how much time is left (10 min)
- Click "Verify OTP"

### 6️⃣ Create new password
- Enter: `NewPassword123!`
- Confirm: `NewPassword123!`
- Check "Show passwords" if needed
- Click "Reset Password"

### 7️⃣ Success! ✅
- Redirected to login page
- Now login with: 
  - Email: `taimoorkhan007705@gmail.com`
  - Password: `NewPassword123!`
- You're logged in! 🎉

---

## 🧪 If Something Goes Wrong

### Email not arriving?
```bash
cd backend
node test_email.mjs
# Should show: "✅ All systems operational!"
```

### Still not working?
- Open browser console (F12)
- Look for API call logs
- Check backend terminal for errors

### Quick reset
- Request new OTP (resets timer)
- Try again with fresh code

---

## 📊 What's Happening Behind the Scenes

1. **Send OTP**: You → Frontend → Backend → Gmail → Your Inbox
2. **Verify**: You enter code → Backend checks → Generates token
3. **Reset**: You enter password → Backend updates → Success!

---

## ✅ Verification Checklist

After testing, you should have:
- [x] Received OTP email from Gmail
- [x] Entered correct 6-digit code
- [x] Created new password successfully
- [x] Logged in with new password
- [x] Email address doesn't change
- [x] Old password no longer works

---

**All set!** The OTP system is ready for production use! 🚀
