# 🎯 Getting Started - Visual Guide

## 📋 What You'll Need

```
✅ Node.js (v16+)
✅ MongoDB (Atlas or Local)
✅ Git
✅ Text Editor (VS Code)
✅ 2 Terminal Windows
```

---

## 🗺️ Setup Flow

```
1. Clone Repo
    ↓
2. Setup Backend
    ↓
3. Setup Frontend
    ↓
4. Start Both Servers
    ↓
5. Open Browser
    ↓
6. Create Account & Test
```

---

## 📦 Installation Steps

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd Verity
```

### Step 2: Backend Setup
```bash
cd backend
npm install
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux
```

**Edit `backend/.env`:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/verity_fyp
JWT_SECRET=your_random_secret_key_here
```

### Step 3: Frontend Setup
```bash
cd ../Verity_FYP
npm install
```

---

## 🚀 Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

### Terminal 2 - Frontend
```bash
cd Verity_FYP
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the **Login Page** 🎉

---

## 🧪 First Test

### 1. Create a User Account
- Click "Sign Up"
- Fill in details
- Select Role: "User"
- Submit

### 2. Complete Your Profile
- Add profile picture
- Add bio
- Save

### 3. Create a Post
- Click "Create Post"
- Write something
- Add an image
- Submit

### 4. Create a Reviewer Account
- Logout
- Sign up again
- Select Role: "Reviewer"

### 5. Review the Post
- Login as Reviewer
- Go to "Review Center"
- Approve the post

### 6. Check the Feed
- Login as User
- Go to "Feed"
- See your approved post! ✅

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│            http://localhost:5173                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP Requests
                 ↓
┌─────────────────────────────────────────────────┐
│              Frontend (React)                    │
│         Verity_FYP - Port 5173                  │
│  • Components  • Services  • Context            │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 ↓
┌─────────────────────────────────────────────────┐
│           Backend (Node.js/Express)              │
│            backend - Port 5000                   │
│  • Routes  • Controllers  • Middleware          │
└────────────────┬────────────────────────────────┘
                 │
                 │ Database Queries
                 ↓
┌─────────────────────────────────────────────────┐
│              MongoDB Database                    │
│         (Atlas Cloud or Local)                   │
│  • Users  • Posts  • Reviews  • Stories         │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Development Workflow

```
1. Start Backend (Terminal 1)
   cd backend && npm start
   
2. Start Frontend (Terminal 2)
   cd Verity_FYP && npm run dev
   
3. Make Changes
   - Edit files in your code editor
   - Frontend auto-reloads
   - Backend needs manual restart
   
4. Test Changes
   - Check browser
   - Check terminal logs
   - Check browser console (F12)
   
5. Commit Changes
   git add .
   git commit -m "Your message"
   git push
```

---

## 📁 Important Files

```
Verity/
├── README.md                    ← Main documentation
├── SETUP_GUIDE.md              ← Detailed setup steps
├── SETUP_CHECKLIST.md          ← Quick checklist
├── GETTING_STARTED.md          ← This file
│
├── backend/
│   ├── .env                    ← Your config (create this!)
│   ├── .env.example            ← Template
│   ├── server.js               ← Entry point
│   └── package.json            ← Dependencies
│
└── Verity_FYP/
    ├── src/                    ← React code
    ├── package.json            ← Dependencies
    └── vite.config.js          ← Vite config
```

---

## 🆘 Quick Fixes

### Problem: "Cannot connect to MongoDB"
**Solution:** Check your `.env` file, verify MongoDB URI

### Problem: "Port 5000 already in use"
**Solution:** Kill the process or change port in `.env`

### Problem: "Module not found"
**Solution:** Run `npm install` again

### Problem: "Cannot GET /"
**Solution:** Make sure you're accessing `localhost:5173` not `localhost:5000`

---

## 📚 Next Steps

1. ✅ Complete this setup
2. 📖 Read [README.md](./README.md) for detailed info
3. 🏗️ Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
4. 💾 Review [DATABASE_SCHEMA_COMPLETE.md](./DATABASE_SCHEMA_COMPLETE.md)
5. 🔍 Understand [REVIEW_SYSTEM_EXPLAINED.md](./REVIEW_SYSTEM_EXPLAINED.md)

---

## 🎓 Learning Resources

- **React**: https://react.dev/
- **Node.js**: https://nodejs.org/docs
- **Express**: https://expressjs.com/
- **MongoDB**: https://www.mongodb.com/docs/
- **Styled Components**: https://styled-components.com/

---

**Ready to code? Let's build something amazing! 🚀**
