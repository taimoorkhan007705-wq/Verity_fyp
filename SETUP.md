# Development Setup Guide

Complete guide to set up and run the Verity project locally.

## 📦 Prerequisites

Before starting, ensure you have:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **ngrok** (optional, for remote testing) ([Download](https://ngrok.com/))

### API Keys Required
1. **Sightengine** - For AI content detection
   - Sign up at https://sightengine.com
   - Get USER_ID and API_KEY

2. **MongoDB Atlas** - For database
   - Create cluster and get connection string

3. **SMTP** (optional) - For emails
   - Use Ethereal for testing or configure your own

## 🔧 Step-by-Step Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/Verity.git
cd Verity
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# MONGODB_URI, SIGHTENGINE keys, etc.
```

**Backend .env template:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/verity
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# Sightengine (for AI detection)
SIGHTENGINE_USER_ID=your-user-id
SIGHTENGINE_API_KEY=your-api-key

# Email (Ethereal for testing)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-email@ethereal.email
SMTP_PASS=your-ethereal-password

# Environment
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Go back to root
cd ..

# Navigate to frontend
cd Verity_FYP

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (usually defaults work for local dev)
```

**Frontend .env template:**
```
# Local development
VITE_API_URL=/api
VITE_API_BASE=http://localhost:5173

# For ngrok remote access (optional)
# VITE_API_URL=https://your-ngrok-url.ngrok-free.dev/api
# VITE_API_BASE=https://your-ngrok-url.ngrok-free.dev
```

### 4. Database Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Set up database user with username/password
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/verity`
5. Whitelist your IP (or allow all IPs: 0.0.0.0/0)
6. Add to `backend/.env` as `MONGODB_URI`

## ▶️ Running the Project

### Option 1: Local Development (Recommended for initial setup)

**Terminal 1 - Frontend:**
```bash
cd Verity_FYP
npm run dev
```
Opens http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# With PORT
PORT=5001 npm run dev
```
Runs on http://localhost:5001

### Option 2: With ngrok (Remote access)

**Terminal 1 - Frontend:**
```bash
cd Verity_FYP
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
PORT=5001 npm run dev
```

**Terminal 3 - ngrok:**
```bash
ngrok http 5001
```
- Note the Forwarding URL (e.g., https://random-url.ngrok-free.dev)
- Update `Verity_FYP/.env`:
  ```
  VITE_API_URL=https://random-url.ngrok-free.dev/api
  VITE_API_BASE=https://random-url.ngrok-free.dev
  ```
- Frontend will auto-reload with new URL

## 🧪 Testing

### Create Test Accounts

**Regular User:**
```
Email: user@test.com
Password: password123
```

**Reviewer:**
```
Email: reviewer@test.com
Password: password123
```

Or use the signup page to create accounts.

### Test Workflow

1. **Create a post as User**
   - Login as user@test.com
   - Go to Create Post
   - Upload image and add content
   - Submit

2. **Review as Reviewer**
   - Login as reviewer@test.com
   - Go to Review Center
   - Vote on posts
   - Check leaderboard

3. **See Trust Score Updates**
   - Vote on posts
   - Wait for 2+ votes (decision made)
   - Check leaderboard for updated scores

## 📊 Useful Endpoints for Testing

```bash
# Check API health
curl http://localhost:5001/api/admin/test

# Get leaderboard (public endpoint)
curl http://localhost:5001/api/admin/reviewers/leaderboard

# Get user profile (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/users/profiles
```

## 🐛 Debugging Tips

### Frontend Issues
- Check browser console (F12)
- Look for `[API]` or `[RightSidebar]` logs
- Verify VITE_API_URL matches backend
- Clear cache: `Ctrl+Shift+Delete` in browser

### Backend Issues
- Check terminal where backend is running
- Look for errors in MongoDB connection
- Verify .env file has correct values
- Check if port 5001 is available (`netstat -ano | findstr :5001`)

### Database Issues
- Verify MongoDB Atlas IP whitelist
- Check cluster is running
- Ensure database user has correct permissions
- Test connection string directly

## 📦 npm Commands

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend
```bash
npm run dev        # Start dev server with nodemon
npm start          # Start production server
npm run test       # Run tests
```

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Sightengine**: https://www.sightengine.com
- **ngrok**: https://ngrok.com

## ❌ Troubleshooting

### Port Already in Use
```bash
# Check what's using port 5001
netstat -ano | findstr :5001

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### MongoDB Connection Failed
- Check internet connection
- Verify IP is whitelisted in MongoDB Atlas
- Ensure MONGODB_URI is correct
- Try simple connection test

### ngrok URL Changed
- ngrok URLs reset when service restarts
- Update both `Verity_FYP/.env` and frontend will reload
- Or run `ngrok http 5001` again

### Votes Not Counting
- Ensure at least 2 reviewers vote
- Check backend logs for vote processing
- Verify post status is "awaiting_review"

## 📝 Environment Checklist

Before pushing to production:
- [ ] All .env files have production values
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] API keys are secured (never commit .env)
- [ ] JWT_SECRET is strong and unique
- [ ] CORS is configured for your domain
- [ ] Email service is configured
- [ ] Database backups are enabled

## 🚀 Deployment

### Hosting Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, AWS, DigitalOcean
- **Database**: MongoDB Atlas (managed)

## 📞 Support

For setup help:
1. Check this guide again
2. Review error messages in terminal
3. Check browser console (F12)
4. Create GitHub issue with error details

---

**Happy coding! 🎉**
