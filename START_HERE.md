# 👋 START HERE - New Developer Guide

Welcome to the Verity project! This guide will get you up and running in **15 minutes**.

---

## 🎯 Choose Your Path

### ⚡ Super Quick (Using Shared Database) - RECOMMENDED
**If your team member shared the database connection string:**
1. Follow **[QUICK_SETUP.md](./QUICK_SETUP.md)** ← Easiest way!
2. No MongoDB setup needed
3. Ready in 5 minutes

### 🚀 Quick Start (Experienced Developers)
1. Install Node.js & MongoDB
2. Clone repo
3. `cd backend && npm install && npm start`
4. `cd Verity_FYP && npm install && npm run dev`
5. Open `http://localhost:5173`

### 📚 Detailed Setup (First Time with Own Database)
Follow the guides in this order:

1. **[GETTING_STARTED.md](./GETTING_STARTED.md)** ← Start here for visual guide
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** ← Detailed step-by-step
3. **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** ← Verify your setup
4. **[README.md](./README.md)** ← Complete documentation

---

## ⚡ Super Quick Setup

### 1. Prerequisites
```bash
# Check if you have Node.js
node --version    # Should show v16 or higher

# Check if you have npm
npm --version     # Should show 8 or higher
```

Don't have them? Download from https://nodejs.org/

### 2. MongoDB Setup
**Easiest Option:** Use MongoDB Atlas (Cloud)
- Go to https://www.mongodb.com/cloud/atlas
- Sign up (free)
- Create cluster
- Get connection string
- Save it for step 4

### 3. Install Project
```bash
# Clone
git clone <repo-url>
cd Verity

# Backend
cd backend
npm install

# Frontend (new terminal)
cd Verity_FYP
npm install
```

### 4. Configure Backend
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=my_super_secret_key_12345
```

### 5. Run Everything
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd Verity_FYP
npm run dev
```

### 6. Open Browser
Go to: `http://localhost:5173`

---

## 📖 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **START_HERE.md** | Quick overview | First time (you are here!) |
| **GETTING_STARTED.md** | Visual setup guide | Setting up project |
| **SETUP_GUIDE.md** | Detailed instructions | Need step-by-step help |
| **SETUP_CHECKLIST.md** | Verify setup | After installation |
| **README.md** | Complete docs | Reference & troubleshooting |
| **PROJECT_STRUCTURE.md** | Code organization | Understanding codebase |
| **BACKEND_STRUCTURE.md** | Backend architecture | Working on backend |
| **DATABASE_SCHEMA_COMPLETE.md** | Database design | Working with data |
| **REVIEW_SYSTEM_EXPLAINED.md** | Review workflow | Understanding reviews |
| **USER_MODEL_STRUCTURE.md** | User data structure | Working with users |

---

## 🎓 What This Project Does

**Verity** is a social media platform with content verification:

1. **Users** create posts with images/videos
2. **Reviewers** verify content authenticity
3. **Approved posts** appear in the feed
4. **Stories** disappear after 24 hours
5. **Business accounts** get analytics

### Key Features
- ✅ User authentication & profiles
- ✅ Post creation with media upload
- ✅ Content review system
- ✅ 24-hour stories
- ✅ Role-based access (User, Reviewer, Business)
- ✅ Real-time feed updates

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Styled Components** - Styling
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads

---

## 🎯 Your First Task

After setup, try this:

1. **Create a User account** (Sign up)
2. **Add profile picture** (Edit profile)
3. **Create a post** with an image
4. **Create a Reviewer account** (Sign up again)
5. **Approve the post** (Review Center)
6. **Check the feed** (Login as User)

This tests the entire workflow! ✅

---

## 🆘 Need Help?

### Common Issues

**"Cannot connect to MongoDB"**
→ Check your `.env` file, verify connection string

**"Port already in use"**
→ Close other apps using port 5000 or 5173

**"Module not found"**
→ Run `npm install` in the correct folder

**"Page not loading"**
→ Make sure both backend AND frontend are running

### Getting Support

1. Check the documentation files
2. Look at terminal error messages
3. Check browser console (F12)
4. Ask your team members
5. Review the code comments

---

## 📞 Quick Reference

### Start Development
```bash
# Backend (Terminal 1)
cd backend && npm start

# Frontend (Terminal 2)
cd Verity_FYP && npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

### Stop Servers
Press `Ctrl + C` in each terminal

---

## ✅ Setup Verification

Run these checks:

```bash
# Check Node.js
node --version    # ✅ v16+

# Check npm
npm --version     # ✅ 8+

# Check backend dependencies
cd backend && npm list --depth=0    # ✅ No errors

# Check frontend dependencies
cd Verity_FYP && npm list --depth=0    # ✅ No errors
```

---

## 🎉 You're Ready!

Once you see:
- ✅ Backend: "MongoDB Connected"
- ✅ Frontend: "Local: http://localhost:5173"
- ✅ Browser: Login page loads

**You're all set! Happy coding! 🚀**

---

## 📚 Next Steps

1. ✅ Complete setup
2. 📖 Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. 🔍 Explore the codebase
4. 💻 Start developing
5. 🧪 Write tests
6. 🚀 Deploy

---

**Questions? Check the other documentation files or ask your team!**
