# Backend Structure Documentation

## Database Schema (MongoDB)

### Collections:
1. **users** - Regular users
2. **reviewers** - Content reviewers
3. **businesses** - Business accounts
4. **posts** - All posts from all users
5. **reviews** - Review records

## File System Structure

```
backend/
├── uploads/
│   └── users/
│       └── {userId}/
│           ├── profile/
│           │   └── avatar-{timestamp}.jpg
│           └── posts/
│               ├── media-{timestamp}-1.jpg
│               └── media-{timestamp}-2.mp4
├── models/
│   ├── User.js
│   ├── Reviewer.js
│   ├── Business.js
│   ├── Post.js
│   └── Review.js
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   └── oauth.routes.js
│   ├── user/
│   │   ├── user.controller.js
│   │   └── user.routes.js
│   ├── post/
│   │   ├── post.controller.js
│   │   └── post.routes.js
│   └── review/
│       ├── review.controller.js
│       └── review.routes.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── config/
│   └── passport.js
└── server.js
```

## User Data Structure

### In Database (MongoDB Document):
```json
{
  "_id": "6996e768a1296fc08ee8d827",
  "firstName": "Taimoor",
  "lastName": "Khan",
  "fullName": "Taimoor Khan",
  "email": "taimoor@gmail.com",
  "password": "$2a$10$hashed...",
  "role": "User",
  "avatar": "/uploads/users/6996e768a1296fc08ee8d827/profile/avatar-1234567890.jpg",
  "bio": "Software developer passionate about tech",
  "website": "https://taimoor.dev",
  "trustScore": 50,
  "isVerified": false,
  "followersCount": 0,
  "followingCount": 0,
  "postsCount": 0,
  "createdAt": "2026-02-21T10:35:20.649Z"
}
```

### In File System:
```
uploads/users/6996e768a1296fc08ee8d827/
├── profile/
│   └── avatar-1708509320649.jpg
└── posts/
    ├── media-1708509450123-1.jpg
    └── media-1708509450123-2.mp4
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new account
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout

### User Profile
- GET `/api/user/profile` - Get current user profile
- PUT `/api/user/profile` - Update profile (with image upload)
- GET `/api/user/:id` - Get specific user profile

### Posts
- POST `/api/posts` - Create post (with media upload)
- GET `/api/posts/feed` - Get all approved posts
- GET `/api/posts/user/:userId` - Get user's posts
- GET `/api/posts/:id` - Get specific post
- PUT `/api/posts/:id` - Update post
- DELETE `/api/posts/:id` - Delete post

### Reviews (Reviewer only)
- GET `/api/reviews/pending` - Get pending posts
- POST `/api/reviews/submit` - Submit review
- GET `/api/reviews/stats` - Get reviewer stats

## Data Flow

1. **User Signup/Login**
   - User submits credentials
   - Backend creates user document in MongoDB
   - Backend creates user folder structure
   - Returns JWT token + user data

2. **Profile Update**
   - User uploads profile image
   - Backend saves to `/uploads/users/{userId}/profile/`
   - Backend updates user document with image path
   - Returns updated user data

3. **Create Post**
   - User uploads media files
   - Backend saves to `/uploads/users/{userId}/posts/`
   - Backend creates post document with media paths
   - Post goes to pending review

4. **Display Content**
   - Frontend requests data via API
   - Backend returns user data with image paths
   - Frontend constructs full URL: `http://localhost:5000{imagePath}`
   - Images are served as static files

## Security
- All user files are isolated in their own folders
- JWT authentication required for protected routes
- File upload validation (type, size)
- Password hashing with bcrypt
