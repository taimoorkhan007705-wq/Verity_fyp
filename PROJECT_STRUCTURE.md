# Verity FYP - Clean Project Structure

## Overview
A social media platform with content verification system built with React (frontend) and Node.js/Express (backend).

## Project Structure

```
Verity/
├── backend/                          # Backend API server
│   ├── config/                       # Configuration files
│   │   └── passport.js              # Authentication config
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                  # JWT authentication
│   │   └── upload.js                # File upload handling
│   ├── models/                       # MongoDB models
│   │   ├── Business.js              # Business user model
│   │   ├── Notification.js          # Notifications
│   │   ├── Post.js                  # Posts
│   │   ├── Review.js                # Reviews
│   │   ├── Reviewer.js              # Reviewer user model
│   │   ├── Story.js                 # Stories (24h expiry)
│   │   └── User.js                  # Regular user model
│   ├── modules/                      # Feature modules
│   │   ├── auth/                    # Authentication
│   │   ├── post/                    # Post management
│   │   ├── review/                  # Review system
│   │   ├── story/                   # Stories feature
│   │   └── user/                    # User management
│   ├── uploads/                      # User uploaded files
│   ├── .env                         # Environment variables
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Express server entry
│
├── Verity_FYP/                      # Frontend React app
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, icons
│   │   ├── context/                 # React context
│   │   │   └── AuthContext.jsx     # Authentication state
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/               # Login, Signup
│   │   │   ├── business/           # Business dashboard
│   │   │   ├── feed/               # Main feed
│   │   │   ├── post/               # Create post
│   │   │   ├── profile/            # User profile
│   │   │   ├── review/             # Review center
│   │   │   │   └── components/     # Review sub-components
│   │   │   ├── shared/             # Shared components
│   │   │   └── story/              # Stories feature
│   │   ├── services/               # API services (NEW STRUCTURE)
│   │   │   ├── authService.js      # Auth API calls
│   │   │   ├── postService.js      # Post API calls
│   │   │   ├── reviewService.js    # Review API calls
│   │   │   ├── storyService.js     # Story API calls
│   │   │   ├── userService.js      # User API calls
│   │   │   └── index.js            # Service exports
│   │   ├── utils/                  # Utility functions
│   │   │   └── profileCheck.js     # Profile validation
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # React entry point
│   ├── package.json                # Frontend dependencies
│   └── vite.config.js              # Vite configuration
│
└── Documentation/                   # Project documentation
    ├── BACKEND_STRUCTURE.md        # Backend architecture
    ├── DATABASE_SCHEMA_COMPLETE.md # Database schema
    ├── REVIEW_SYSTEM_EXPLAINED.md  # Review workflow
    └── USER_MODEL_STRUCTURE.md     # User model details
```

## Key Features

### 1. User Roles
- **User**: Regular users who create posts
- **Reviewer**: Content moderators who verify posts
- **Business**: Business accounts with analytics

### 2. Core Functionality
- **Posts**: Create, view, like, comment, share
- **Stories**: 24-hour temporary content
- **Reviews**: Content verification workflow
- **Profile**: User profiles with avatars and bio
- **Feed**: Approved posts display

### 3. Security
- JWT authentication
- Profile completion checks
- Anti-cheating (reviewers can't review own posts)
- File upload validation

## Recent Improvements

### Code Organization
✅ Split large files into smaller components
✅ Organized API services by feature
✅ Created reusable utility functions
✅ Removed 18 unnecessary files

### Removed Files
- 5 temporary documentation files
- 13 one-time migration/debug scripts
- Empty business module folder
- Root-level node_modules

## Getting Started

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd Verity_FYP
npm install
npm run dev
```

## Environment Variables
Create `backend/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Tech Stack
- **Frontend**: React, Vite, Styled Components
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT, Passport
- **File Upload**: Multer
- **Styling**: Styled Components, Lucide Icons
