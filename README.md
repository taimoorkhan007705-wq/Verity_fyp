# Verity - Social Media Platform with Content Verification

A full-stack social media application with an integrated content verification system. Users can create posts, stories, and connect with others, while reviewers verify content authenticity before it appears in the feed.

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (Local or Atlas account) - [Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd Verity
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express (Web framework)
- Mongoose (MongoDB ODM)
- JWT (Authentication)
- Multer (File uploads)
- Bcrypt (Password hashing)
- And more...

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Or create it manually with this content:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/verity_fyp?retryWrites=true&w=majority

# JWT Secret (Change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# OAuth Configuration (Optional - for Google/Facebook login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

### Step 4: Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and database name in your `.env` file

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/verity_fyp?retryWrites=true&w=majority
```

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use this connection string in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/verity_fyp
```

### Step 5: Start the Backend Server

```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

The backend API is now running at `http://localhost:5000`

---

## 🎨 Frontend Setup

### Step 1: Open a New Terminal

Keep the backend terminal running and open a new terminal window.

### Step 2: Navigate to Frontend Directory

```bash
cd Verity_FYP
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- React
- Vite
- Styled Components
- React Router
- Lucide Icons
- And more...

### Step 4: Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open your browser and go to: `http://localhost:5173`

---

## 🎯 Testing the Application

### Create Test Accounts

1. **Regular User Account**
   - Go to Signup page
   - Select role: "User"
   - Fill in details and create account

2. **Reviewer Account**
   - Create another account
   - Select role: "Reviewer"
   - This account can review posts

3. **Business Account**
   - Create a third account
   - Select role: "Business"
   - Access business analytics

### Test the Workflow

1. **Login as User** → Create a post with image
2. **Login as Reviewer** → Go to Review Center → Approve/Reject the post
3. **Login as User** → Check Feed → See approved post

---

## 📁 Project Structure

```
Verity/
├── backend/              # Node.js/Express API
│   ├── models/          # MongoDB schemas
│   ├── modules/         # Feature modules (auth, post, review, etc.)
│   ├── middleware/      # Authentication & file upload
│   ├── uploads/         # User uploaded files
│   └── server.js        # Entry point
│
└── Verity_FYP/          # React frontend
    ├── src/
    │   ├── modules/     # Feature components
    │   ├── services/    # API calls
    │   ├── context/     # React context
    │   └── utils/       # Helper functions
    └── public/          # Static assets
```

---

## 🔑 Default Test Credentials

After setting up, you can create test accounts or use these if seeded:

```
User Account:
Email: user@test.com
Password: password123

Reviewer Account:
Email: reviewer@test.com
Password: password123

Business Account:
Email: business@test.com
Password: password123
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
**Solution:** 
- Check your `MONGODB_URI` in `.env`
- Ensure MongoDB is running (if local)
- Check network connection (if Atlas)
- Whitelist your IP in MongoDB Atlas

### Issue 2: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in `backend/.env`:
```
PORT=5001
```

### Issue 3: "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Frontend can't connect to backend
**Solution:**
- Ensure backend is running on port 5000
- Check `Verity_FYP/src/services/*.js` files
- Verify API_URL is set to `http://localhost:5000/api`

---

## 📦 Available Scripts

### Backend
```bash
npm start          # Start the server
npm run dev        # Start with nodemon (auto-restart)
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🌟 Features

- ✅ User Authentication (JWT)
- ✅ Role-based Access (User, Reviewer, Business)
- ✅ Post Creation with Images/Videos
- ✅ Stories (24-hour expiry)
- ✅ Content Review System
- ✅ Profile Management
- ✅ Feed with Approved Posts
- ✅ Real-time Updates
- ✅ File Upload System

---

## 📚 Additional Documentation

- [Backend Structure](./BACKEND_STRUCTURE.md)
- [Database Schema](./DATABASE_SCHEMA_COMPLETE.md)
- [Review System](./REVIEW_SYSTEM_EXPLAINED.md)
- [User Model](./USER_MODEL_STRUCTURE.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues:
1. Check the documentation files
2. Review the console logs (both frontend and backend)
3. Check MongoDB connection
4. Ensure all environment variables are set correctly

---

## 📝 License

This project is part of a Final Year Project (FYP).

---

## 👥 Team

Developed by [Your Name/Team Name]

---

**Happy Coding! 🚀**
