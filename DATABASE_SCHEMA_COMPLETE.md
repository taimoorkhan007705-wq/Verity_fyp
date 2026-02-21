# Complete Database Schema for Verity Platform

## Overview
This schema covers all aspects of the platform: users, posts, reviews, connections, messages, and analytics.

---

## 1. USERS Collection
**Purpose:** Store all regular user accounts

```javascript
{
  _id: ObjectId,
  
  // Personal Information
  firstName: String,              // "Taimoor"
  lastName: String,               // "Khan"
  fullName: String,               // "Taimoor Khan" (auto-generated)
  email: String (unique),         // "taimoor@gmail.com"
  password: String (hashed),      // bcrypt hashed
  
  // Profile
  avatar: String,                 // "/uploads/users/{userId}/profile/avatar-123.jpg"
  coverPhoto: String,             // "/uploads/users/{userId}/profile/cover-123.jpg"
  bio: String (max 150),          // "Software developer..."
  website: String,                // "https://taimoor.dev"
  location: String,               // "Lahore, Pakistan"
  dateOfBirth: Date,              // 1995-05-15
  gender: String,                 // "male", "female", "other"
  
  // Account Settings
  role: String,                   // "User" (default)
  isVerified: Boolean,            // false (blue checkmark)
  isActive: Boolean,              // true
  isPrivate: Boolean,             // false (private account)
  
  // Social Stats
  followersCount: Number,         // 0
  followingCount: Number,         // 0
  postsCount: Number,             // 0
  
  // Trust & Reputation
  trustScore: Number,             // 50 (0-100)
  reportsReceived: Number,        // 0
  reportsSubmitted: Number,       // 0
  
  // Activity Tracking
  lastActive: Date,               // 2026-02-21T10:30:00Z
  lastLogin: Date,                // 2026-02-21T10:30:00Z
  loginCount: Number,             // 5
  
  // Preferences
  preferences: {
    language: String,             // "en"
    theme: String,                // "light", "dark"
    notifications: {
      email: Boolean,             // true
      push: Boolean,              // true
      likes: Boolean,             // true
      comments: Boolean,          // true
      follows: Boolean,           // true
    }
  },
  
  // OAuth
  googleId: String,               // Google OAuth ID
  facebookId: String,             // Facebook OAuth ID
  
  // Timestamps
  createdAt: Date,                // 2026-02-21T10:30:00Z
  updatedAt: Date,                // 2026-02-21T10:30:00Z
  
  __v: Number
}
```

---

## 2. REVIEWERS Collection
**Purpose:** Store content reviewer accounts

```javascript
{
  _id: ObjectId,
  
  // Personal Information (same as Users)
  firstName: String,
  lastName: String,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  
  // Profile
  avatar: String,
  coverPhoto: String,
  bio: String,
  website: String,
  location: String,
  
  // Account Settings
  role: String,                   // "Reviewer"
  isVerified: Boolean,
  isActive: Boolean,
  
  // Reviewer-Specific Stats
  reviewsCompleted: Number,       // 150
  reviewsPending: Number,         // 5
  accuracy: Number,               // 95.5 (percentage)
  averageReviewTime: Number,      // 120 (seconds)
  
  // Specialization
  specialization: [String],       // ["Politics", "Health", "Technology"]
  expertiseLevel: String,         // "Junior", "Senior", "Expert"
  
  // Performance Metrics
  approvedCount: Number,          // 120
  rejectedCount: Number,          // 30
  flaggedCount: Number,           // 5
  
  // Social Stats
  followersCount: Number,
  followingCount: Number,
  postsCount: Number,
  trustScore: Number,
  
  // Activity
  lastReviewAt: Date,
  lastActive: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  __v: Number
}
```

---

## 3. BUSINESSES Collection
**Purpose:** Store business accounts

```javascript
{
  _id: ObjectId,
  
  // Business Information
  businessName: String,           // "Tech Solutions Inc"
  fullName: String,               // Same as businessName
  firstName: String,              // For compatibility
  lastName: String,               // For compatibility
  email: String (unique),
  password: String (hashed),
  
  // Profile
  avatar: String,                 // Logo
  coverPhoto: String,
  bio: String,
  website: String,
  
  // Business Details
  businessType: String,           // "Technology", "Retail", "Service"
  industry: String,               // "Software Development"
  companySize: String,            // "1-10", "11-50", "51-200", "200+"
  foundedYear: Number,            // 2020
  
  // Contact Information
  phone: String,                  // "+92-300-1234567"
  address: String,                // "123 Main St, Lahore"
  city: String,                   // "Lahore"
  country: String,                // "Pakistan"
  
  // Account Settings
  role: String,                   // "Business"
  isVerified: Boolean,            // Blue checkmark
  isActive: Boolean,
  
  // Subscription
  subscriptionPlan: String,       // "Free", "Basic", "Premium", "Enterprise"
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  
  // Business Stats
  totalPosts: Number,             // 50
  totalReach: Number,             // 10000
  totalEngagement: Number,        // 5000
  followersCount: Number,
  followingCount: Number,
  postsCount: Number,
  
  // Analytics
  monthlyViews: Number,           // 5000
  monthlyClicks: Number,          // 500
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  __v: Number
}
```

---

## 4. POSTS Collection
**Purpose:** Store all posts from all users

```javascript
{
  _id: ObjectId,
  
  // Author Information
  author: ObjectId,               // Reference to User/Reviewer/Business
  authorModel: String,            // "User", "Reviewer", "Business"
  
  // Content
  content: String (max 500),      // "Today I ate pizza 😇"
  media: [
    {
      type: String,               // "image", "video"
      url: String,                // "/uploads/users/{userId}/posts/media-123.jpg"
      thumbnail: String,          // For videos
      width: Number,              // 1920
      height: Number,             // 1080
      size: Number,               // File size in bytes
      duration: Number,           // For videos (seconds)
    }
  ],
  
  // Categorization
  hashtags: [String],             // ["pizza", "food", "yummy"]
  mentions: [ObjectId],           // References to mentioned users
  location: String,               // "Lahore, Pakistan"
  
  // Visibility & Privacy
  visibility: String,             // "public", "private", "connections"
  
  // Verification Status
  verificationStatus: String,     // "pending", "approved", "rejected"
  isVerified: Boolean,            // false (content verified)
  reviewedBy: ObjectId,           // Reference to Reviewer
  reviewedAt: Date,
  reviewNotes: String,            // Reviewer's notes
  
  // Engagement
  likes: [
    {
      user: ObjectId,             // Reference to User
      userModel: String,          // "User", "Reviewer", "Business"
      createdAt: Date
    }
  ],
  likesCount: Number,             // 45 (denormalized for performance)
  
  comments: [
    {
      _id: ObjectId,
      user: ObjectId,
      userModel: String,
      text: String (max 200),
      likes: [ObjectId],
      likesCount: Number,
      createdAt: Date
    }
  ],
  commentsCount: Number,          // 12
  
  shares: [
    {
      user: ObjectId,
      userModel: String,
      createdAt: Date
    }
  ],
  sharesCount: Number,            // 8
  
  // Analytics
  views: Number,                  // 1000
  reach: Number,                  // 800
  engagement: Number,             // 65 (likes + comments + shares)
  
  // Flags & Reports
  reports: [
    {
      reportedBy: ObjectId,
      reason: String,             // "spam", "inappropriate", "false-info"
      description: String,
      createdAt: Date
    }
  ],
  reportsCount: Number,           // 0
  
  // Status
  isActive: Boolean,              // true
  isDeleted: Boolean,             // false (soft delete)
  deletedAt: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  __v: Number
}
```

---

## 5. REVIEWS Collection
**Purpose:** Store review records for posts

```javascript
{
  _id: ObjectId,
  
  // Review Details
  post: ObjectId,                 // Reference to Post
  reviewer: ObjectId,             // Reference to Reviewer
  
  // Verdict
  verdict: String,                // "verified", "false", "misleading", "needs-context"
  confidence: Number,             // 90 (0-100)
  
  // Analysis
  notes: String,                  // Detailed review notes
  sources: [
    {
      title: String,              // "BBC News Article"
      url: String,                // "https://bbc.com/..."
      credibility: Number         // 95 (0-100)
    }
  ],
  
  // Categorization
  tags: [String],                 // ["politics", "fact-checked", "verified"]
  category: String,               // "News", "Opinion", "Entertainment"
  
  // Time Tracking
  reviewStartedAt: Date,
  reviewCompletedAt: Date,
  reviewDuration: Number,         // Seconds
  
  // Status
  status: String,                 // "completed", "in-progress", "disputed"
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  __v: Number
}
```

---

## 6. CONNECTIONS Collection
**Purpose:** Store follower/following relationships

```javascript
{
  _id: ObjectId,
  
  // Relationship
  follower: ObjectId,             // User who follows
  followerModel: String,          // "User", "Reviewer", "Business"
  
  following: ObjectId,            // User being followed
  followingModel: String,         // "User", "Reviewer", "Business"
  
  // Status
  status: String,                 // "active", "blocked", "muted"
  
  // Notifications
  notificationsEnabled: Boolean,  // true
  
  // Timestamps
  createdAt: Date,
  
  __v: Number
}
```

---

## 7. MESSAGES Collection
**Purpose:** Store direct messages between users

```javascript
{
  _id: ObjectId,
  
  // Conversation
  conversationId: String,         // Unique conversation ID
  
  // Participants
  sender: ObjectId,
  senderModel: String,
  
  receiver: ObjectId,
  receiverModel: String,
  
  // Content
  message: String,
  media: [
    {
      type: String,               // "image", "video", "file"
      url: String,
      name: String,
      size: Number
    }
  ],
  
  // Status
  isRead: Boolean,                // false
  readAt: Date,
  isDeleted: Boolean,             // false
  deletedBy: [ObjectId],          // Users who deleted this message
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  __v: Number
}
```

---

## 8. NOTIFICATIONS Collection
**Purpose:** Store user notifications

```javascript
{
  _id: ObjectId,
  
  // Recipient
  user: ObjectId,
  userModel: String,
  
  // Notification Details
  type: String,                   // "like", "comment", "follow", "mention", "review"
  title: String,                  // "New follower"
  message: String,                // "John Doe started following you"
  
  // Related Data
  relatedUser: ObjectId,          // User who triggered notification
  relatedPost: ObjectId,          // Related post (if applicable)
  relatedComment: ObjectId,       // Related comment (if applicable)
  
  // Action
  actionUrl: String,              // "/post/123" or "/profile/456"
  
  // Status
  isRead: Boolean,                // false
  readAt: Date,
  
  // Timestamps
  createdAt: Date,
  
  __v: Number
}
```

---

## 9. ANALYTICS Collection
**Purpose:** Store platform analytics and metrics

```javascript
{
  _id: ObjectId,
  
  // Time Period
  date: Date,                     // 2026-02-21
  period: String,                 // "daily", "weekly", "monthly"
  
  // User Metrics
  totalUsers: Number,
  activeUsers: Number,
  newUsers: Number,
  
  // Content Metrics
  totalPosts: Number,
  approvedPosts: Number,
  rejectedPosts: Number,
  pendingPosts: Number,
  
  // Engagement Metrics
  totalLikes: Number,
  totalComments: Number,
  totalShares: Number,
  totalViews: Number,
  
  // Review Metrics
  totalReviews: Number,
  averageReviewTime: Number,
  reviewAccuracy: Number,
  
  // Timestamps
  createdAt: Date,
  
  __v: Number
}
```

---

## Relationships Diagram

```
USERS ──────┐
            ├──> POSTS ──> REVIEWS ──> REVIEWERS
REVIEWERS ──┤
            │
BUSINESSES ─┘

USERS ←──> CONNECTIONS ←──> USERS
  │
  ├──> MESSAGES ←──> USERS
  │
  └──> NOTIFICATIONS
```

---

## Indexes for Performance

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ fullName: "text" })
db.users.createIndex({ createdAt: -1 })

// Posts
db.posts.createIndex({ author: 1, createdAt: -1 })
db.posts.createIndex({ verificationStatus: 1 })
db.posts.createIndex({ hashtags: 1 })
db.posts.createIndex({ createdAt: -1 })

// Reviews
db.reviews.createIndex({ post: 1 })
db.reviews.createIndex({ reviewer: 1, createdAt: -1 })

// Connections
db.connections.createIndex({ follower: 1, following: 1 }, { unique: true })
db.connections.createIndex({ following: 1 })

// Messages
db.messages.createIndex({ conversationId: 1, createdAt: -1 })
db.messages.createIndex({ receiver: 1, isRead: 1 })

// Notifications
db.notifications.createIndex({ user: 1, isRead: 1, createdAt: -1 })
```

---

## File System Structure

```
backend/uploads/users/
├── {userId}/
│   ├── profile/
│   │   ├── avatar-{timestamp}.jpg
│   │   └── cover-{timestamp}.jpg
│   ├── posts/
│   │   ├── media-{timestamp}-1.jpg
│   │   ├── media-{timestamp}-2.mp4
│   │   └── thumbnail-{timestamp}.jpg
│   └── messages/
│       └── file-{timestamp}.pdf
```

---

This structure provides complete control over all aspects of your platform!
