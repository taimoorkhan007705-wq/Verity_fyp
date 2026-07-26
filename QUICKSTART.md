# Quick Start Guide

Fast track to getting Verity running in 5 minutes.

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install

cd ../Verity_FYP
npm install
```

### 2. Create .env Files

**backend/.env:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/verity
PORT=5001
JWT_SECRET=your-super-secret-key-32-chars-min
SIGHTENGINE_USER=your-user
SIGHTENGINE_SECRET=your-secret
NODE_ENV=development
```

**Verity_FYP/.env:**
```
VITE_API_URL=/api
VITE_API_BASE=http://localhost:5173
```

### 3. Start Services

**Terminal 1 - Frontend:**
```bash
cd Verity_FYP
npm run dev
```
👉 Opens http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
PORT=5001 npm run dev
```
👉 Runs on http://localhost:5001

## 📋 Test Accounts

Create your own or use these credentials:

**User:**
```
Email: user@test.com
Password: password123
```

**Reviewer:**
```
Email: reviewer@test.com
Password: password123
```

## 🧪 Quick Test Flow

1. **Create post as user** → Upload image → Submit
2. **Login as reviewer** → Review queue → Vote on post
3. **Vote again** → Check if decision made → See trust score update
4. **View leaderboard** → See all reviewers and scores

## 🎯 Key URLs

| Purpose | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5001 |
| Feed | http://localhost:5173/ |
| Create Post | http://localhost:5173/create-post |
| Review Center | http://localhost:5173/review-center |
| Leaderboard | http://localhost:5173/leaderboard |
| API Status | http://localhost:5001/api/admin/test |

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check git status
git status

# View logs
npm run logs
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Kill process: `netstat -ano \| findstr :5001` |
| Module not found | `npm install` |
| MongoDB error | Check connection string and whitelist |
| Votes not counting | Wait for 2+ votes for decision |
| API 404 | Verify API_URL in .env |

## 📁 Project Structure at a Glance

```
Verity/
├── backend/          ← Express API
├── Verity_FYP/       ← React Frontend
├── README.md         ← Project info
├── SETUP.md          ← Detailed setup
└── GITHUB_UPLOAD.md  ← Push to GitHub
```

## 🚀 Next Steps

1. ✅ **Run locally** - Follow 5-minute setup above
2. ✅ **Test workflow** - Create posts and vote
3. ✅ **Explore code** - Check key files
4. ✅ **Make changes** - Hot reload works!
5. ✅ **Push to GitHub** - See GITHUB_UPLOAD.md
6. ✅ **Deploy** - See DEPLOYMENT.md

## 📚 Key Files to Understand

### Frontend
- `src/App.jsx` - Main routing
- `src/config.js` - API configuration
- `src/modules/feed/Feed.jsx` - Post feed
- `src/modules/review/ReviewCenter.jsx` - Voting
- `src/modules/review/ReviewerLeaderboard.jsx` - Scores

### Backend
- `server.js` - Express app entry
- `modules/*/` - API routes
- `models/*.js` - MongoDB schemas
- `services/reviewerAssignment.js` - Voting logic
- `.env` - Configuration

## 💡 Tips

- **Hot reload works!** Edit code → Save → Auto-updates
- **Check console** (F12) for API errors
- **Check backend terminal** for server logs
- **MongoDB UI** available at MongoDB Atlas dashboard
- **ngrok** if you need remote access: `ngrok http 5001`

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Node.js Docs](https://nodejs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express Docs](https://expressjs.com)

## 🤝 Need Help?

1. Check terminal for errors
2. Read SETUP.md for detailed guide
3. Check GitHub issues
4. Look at console logs (F12)

---

**Happy coding! 🎉**

For detailed guides, see:
- **SETUP.md** - Complete development setup
- **GITHUB_UPLOAD.md** - Push to GitHub
- **DEPLOYMENT.md** - Deploy to production
