# ✅ Setup Checklist

Use this checklist to ensure everything is set up correctly.

## Prerequisites
- [ ] Node.js installed (v16+)
- [ ] Git installed
- [ ] MongoDB Atlas account created OR Local MongoDB installed
- [ ] Code editor installed (VS Code recommended)

## Backend Setup
- [ ] Navigated to `backend` folder
- [ ] Ran `npm install`
- [ ] Created `.env` file from `.env.example`
- [ ] Added MongoDB connection string to `.env`
- [ ] Added JWT_SECRET to `.env`
- [ ] Ran `npm start`
- [ ] Saw "✅ MongoDB Connected" message
- [ ] Backend running on http://localhost:5000

## Frontend Setup
- [ ] Navigated to `Verity_FYP` folder
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Frontend running on http://localhost:5173
- [ ] Can access login page in browser

## Testing
- [ ] Created a User account
- [ ] Logged in successfully
- [ ] Can see the feed page
- [ ] Created a Reviewer account
- [ ] Can access Review Center as reviewer

## Common Issues Fixed
- [ ] MongoDB connection working
- [ ] No port conflicts (5000, 5173)
- [ ] All dependencies installed
- [ ] Environment variables set correctly

---

## If Everything is Checked ✅

**Congratulations! Your setup is complete! 🎉**

You can now start developing. Keep both terminals running:
- Terminal 1: Backend (`cd backend && npm start`)
- Terminal 2: Frontend (`cd Verity_FYP && npm run dev`)

---

## Quick Commands Reference

### Start Development
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd Verity_FYP
npm run dev
```

### Stop Servers
Press `Ctrl + C` in each terminal

### Restart After Changes
- Backend: Restart manually (Ctrl+C, then npm start)
- Frontend: Auto-reloads on file changes

---

**Need help? Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) or [README.md](./README.md)**
