# 🚀 Quick Setup Guide for Colleagues

## One-Time Setup (First Time Only)

### 1️⃣ Install Prerequisites

Download and install these (if not already installed):
- **Node.js**: https://nodejs.org/ (Download LTS version)
- **Git**: https://git-scm.com/

### 2️⃣ Clone the Project

```bash
git clone <repository-url>
cd Verity
```

### 3️⃣ Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux

# Edit .env file and add your MongoDB connection string
# Use any text editor to open backend/.env
```

**Important:** Edit `backend/.env` and replace:
- `MONGODB_URI` with your MongoDB connection string
- `JWT_SECRET` with a random secret key

### 4️⃣ Setup Frontend

```bash
# Open a new terminal, navigate to frontend
cd Verity_FYP

# Install dependencies
npm install
```

---

## 🏃 Daily Usage (Every Time You Work)

### Start Backend (Terminal 1)

```bash
cd backend
npm start
```

Wait for: `✅ MongoDB Connected`

### Start Frontend (Terminal 2)

```bash
cd Verity_FYP
npm run dev
```

Open browser: `http://localhost:5173`

---

## 🔑 MongoDB Setup Options

### Option A: MongoDB Atlas (Cloud - Easiest)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Paste in `backend/.env` as `MONGODB_URI`
7. Replace `<username>` and `<password>` with your credentials

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.xxxxx.mongodb.net/verity_fyp?retryWrites=true&w=majority
```

### Option B: Local MongoDB

1. Download MongoDB Community Server
2. Install and start MongoDB service
3. Use this in `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/verity_fyp
```

---

## ✅ Verify Setup

After starting both servers:

1. Backend should show:
   ```
   🚀 Server running on port 5000
   ✅ MongoDB Connected
   ```

2. Frontend should show:
   ```
   ➜  Local:   http://localhost:5173/
   ```

3. Open browser to `http://localhost:5173`
4. You should see the login page

---

## 🆘 Quick Troubleshooting

### Backend won't start?
- Check if MongoDB connection string is correct in `.env`
- Make sure port 5000 is not in use
- Run `npm install` again in backend folder

### Frontend won't start?
- Make sure backend is running first
- Run `npm install` again in Verity_FYP folder
- Clear browser cache

### Can't connect to database?
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
- Verify username/password in connection string
- Check internet connection

---

## 📞 Need Help?

1. Check the main [README.md](./README.md) for detailed instructions
2. Review error messages in terminal
3. Check browser console (F12) for frontend errors
4. Ask team members for help

---

## 🎯 Quick Test

After setup, test the app:

1. **Create Account**: Sign up as a User
2. **Complete Profile**: Add profile picture
3. **Create Post**: Make a post with an image
4. **Create Reviewer**: Sign up another account as Reviewer
5. **Review Post**: Login as reviewer, approve the post
6. **Check Feed**: Login as user, see approved post in feed

---

**That's it! You're ready to develop! 🎉**
