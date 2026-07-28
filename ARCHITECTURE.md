# Verity - Complete Architecture Diagram

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          VERITY SOCIAL PLATFORM                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────────┐
                    │       INTERNET / NGROK           │
                    │  (Public HTTPS Tunnel)           │
                    │  https://tiny-guidable-...       │
                    └──────────────────────────────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
         ┌──────────▼──────────┐    ┌───────────▼──────────┐
         │  FRONTEND (React)   │    │  MOBILE APP / API    │
         │  Port 5173          │    │  Consumers           │
         │  Vite Dev Server    │    │                      │
         └─────────────────────┘    └──────────────────────┘
                    │                            │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   BACKEND SERVER           │
                    │   Node.js + Express        │
                    │   Port 5000                │
                    └─────────────┬──────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
   ┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
   │   MongoDB       │  │  External APIs  │  │  AI Services    │
   │   Cluster0      │  │  & Services     │  │  (Ollama)       │
   │   Database      │  │  - Email        │  │  localhost:11434│
   │   (Cloud)       │  │  - Storage      │  │  llama3.2       │
   └────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 📱 Frontend Architecture

```
┌─────────────────────────────────────────────────┐
│            FRONTEND (React + Vite)              │
│            localhost:5173                       │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼────┐      ┌───▼────┐     ┌───▼────┐
    │ Admin  │      │Business│     │Reviewer│
    │Panel   │      │Dashboard       │Center │
    └────────┘      └────────┘     └────────┘
        │               │               │
        │               │               │
    ┌───▼──────────────▼───────────────▼────┐
    │        SHARED COMPONENTS               │
    ├────────────────────────────────────────┤
    │ • Sidebar Navigation                   │
    │ • Header / Footer                      │
    │ • Layout Wrapper                       │
    │ • Auth Guards                          │
    └────────────────────────────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │     CORE MODULES                 │
    ├──────────────────────────────────┤
    │ • Auth (Login/Signup/ForgotPwd)  │
    │ • Feed (Posts/Stories)           │
    │ • Profile (View/Edit)            │
    │ • Messages / Connections         │
    │ • Shopping / Cart                │
    │ • Review System                  │
    └──────────────────────────────────┘
```

---

## 🗄️ Backend Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                    │
│                     Port 5000                                    │
└──────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼────────┐      ┌───▼──────────┐    ┌───▼──────────┐
    │ MODULES    │      │  MIDDLEWARE  │    │  SERVICES    │
    └────────────┘      └──────────────┘    └──────────────┘
```

### 📦 API Modules (routes + controller)

```
backend/modules/
├── auth/                    → Authentication & Authorization
│   ├── auth.routes.js       (signup, login, logout, OTP)
│   └── auth.controller.js   (JWT token management)
│
├── user/                    → User Management
│   ├── user.routes.js       (profile, update, payment methods)
│   └── user.controller.js   (user CRUD operations)
│
├── post/                    → Posts & Feed
│   ├── post.routes.js       (create, get, update, delete posts)
│   └── post.controller.js   (post with AI verification, comments)
│
├── product/                 → E-commerce Products
│   ├── product.routes.js    (create, list, search products)
│   └── product.controller.js (product management)
│
├── order/                   → Order Management
│   ├── order.routes.js      (create, track, manage orders)
│   └── order.controller.js  (order processing)
│
├── review/                  → Post Review & Verification
│   ├── review.routes.js     (get queue, submit review, stats)
│   └── review.controller.js (review logic)
│
├── reviewer/                → Reviewer Management
│   ├── reviewer.routes.js   (reviewer profile, stats)
│   └── reviewer.controller.js (reviewer operations)
│
├── admin/                   → Admin Panel
│   ├── admin.routes.js      (manage users, reviewers, requests)
│   └── admin.controller.js  (block/unblock, approve/reject)
│
├── ai/                      → AI Assistant
│   ├── ai.routes.js         (chat, generate, health)
│   └── ai.controller.js     (Ollama integration)
│
└── story/                   → Stories Feature
    ├── story.routes.js      (create, view, delete stories)
    └── story.controller.js  (story management)
```

---

## 🔌 Middleware

```
middleware/
├── auth.js                  → JWT token verification
└── upload.js                → File upload handling (images/videos)
```

---

## 🛠️ Services

```
services/
├── ollamaService.js         → Ollama AI Integration (llama3.2)
├── aiDetection.js           → AI-based content detection
├── categoryClassifier.js     → Product category classification
├── emailService.js          → Email sending (Ethereal)
├── factCheckService.js      → Fact-checking service
├── fakeContentDetector.js   → Detect fake/manipulated content
├── ocrService.js            → Optical Character Recognition
├── otpService.js            → OTP generation & verification
├── reviewerAssignment.js    → Auto-assign reviewers to posts
├── videoAnalysisService.js  → Video content analysis
└── profanityFilter.js       → Filter inappropriate language
```

---

## 💾 Database Models

```
models/
├── User.js                  → User accounts (firstName, email, role)
├── Post.js                  → Posts (content, images, verification)
├── Review.js                → Post reviews by reviewers
├── Reviewer.js              → Reviewer profiles & stats
├── ReviewerRequest.js       → Requests to become reviewer
├── Product.js               → E-commerce products
├── Order.js                 → Customer orders
├── Cart.js                  → Shopping cart items
├── Story.js                 → User stories (24hr content)
├── Message.js               → Direct messages
├── Notification.js          → User notifications
├── Connection.js            → User connections/follows
└── Business.js              → Business profiles & settings
```

---

## 🔐 Authentication Flow

```
USER LOGIN
    │
    ▼
POST /api/auth/login
    │
    ▼
├─ Validate email/password
├─ Check if user blocked
│
    ▼
├─ Generate JWT token
└─ Store in localStorage
    │
    ▼
AUTHENTICATED REQUESTS
    │
    ├─ Include: Authorization: Bearer <token>
    │
    ▼
auth.middleware
    │
    ├─ Verify JWT
    ├─ Extract userId
    └─ Pass to route handler
```

---

## 👥 User Roles & Permissions

```
┌─────────────────────────────────────────────────────────┐
│                    USER ROLES                           │
└─────────────────────────────────────────────────────────┘

1. ADMIN
   ├─ Access: Full admin panel
   ├─ Features: Manage users, reviewers, requests
   ├─ Posts: Auto-approved (bypass verification)
   ├─ Profile: Not required to complete
   └─ Permissions: Block/unblock users, approve reviewers

2. BUSINESS
   ├─ Access: Business Dashboard
   ├─ Features: Manage products, payments, inquiries
   ├─ Products: List and sell items
   ├─ AI: Chat assistant for support
   └─ Payments: Configure multiple payment methods

3. REVIEWER
   ├─ Access: Review Center
   ├─ Features: Review pending posts, leaderboard
   ├─ Queue: Auto-assigned posts to review
   ├─ Stats: Vote count, trust score tracking
   └─ Rewards: Based on review accuracy

4. USER (Regular)
   ├─ Access: Feed, stories, shopping
   ├─ Features: Create posts, comment, connect
   ├─ Posts: Require AI + human review
   ├─ Reviews: Can review other posts
   └─ Shopping: Browse & purchase products
```

---

## 📊 Post Verification Flow

```
USER CREATES POST
    │
    ▼
POST /api/posts
    │
    ├─ Check user role
    │
    ▼
IF ADMIN
    └─ Set verificationStatus = 'approved' (SKIP AI & review)
    │
    ▼
IF NOT ADMIN
    │
    ├─ Save post with status = 'awaiting-ai-detection'
    │
    ▼
AI_DETECTION_SERVICE
    │
    ├─ Check for fake/manipulated content
    ├─ Analyze text for misinformation
    │
    ▼
    ├─ If flagged: Set status = 'flagged-ai'
    │
    └─ If clean: Set status = 'awaiting-review'
            │
            ▼
    REVIEWER_ASSIGNMENT_SERVICE
            │
            ├─ Auto-assign to available reviewers
            │
            ▼
    REVIEWER_REVIEWS_POST
            │
            ├─ Approve/Reject with vote
            │
            ▼
    FINAL_STATUS
            ├─ 'approved' → Post visible to all
            ├─ 'rejected' → Post hidden
            └─ 'flagged' → Review needed
```

---

## 🎨 Business Dashboard Features

```
BUSINESS_DASHBOARD
├── 📊 Dashboard Tab
│   ├─ Total Products
│   ├─ Total Views
│   ├─ Total Likes
│   └─ Inquiries Count
│
├── 📦 My Products Tab
│   ├─ Create new product
│   ├─ View all products
│   ├─ Edit/delete products
│   └─ Track views & inquiries
│
├── 💬 Messages Tab
│   ├─ View customer inquiries
│   ├─ Reply to inquiries
│   └─ Track conversation history
│
├── 💳 Payment Methods Tab
│   ├─ Easypaisa
│   ├─ JazzCash
│   ├─ Bank Transfer
│   ├─ Credit Card
│   └─ Cash on Delivery
│
└── 🤖 AI Assistant Tab
    ├─ Chat interface
    ├─ Conversation history
    ├─ Context-aware responses
    └─ Ollama llama3.2 powered
```

---

## 📱 Admin Dashboard Features

```
ADMIN_DASHBOARD
├── 👥 Users Tab
│   ├─ View all users
│   ├─ Block/Unblock users
│   ├─ Manage user profiles
│   └─ View user statistics
│
├── 🔍 Reviewer Requests Tab
│   ├─ View pending requests
│   ├─ Approve reviewer requests
│   ├─ Reject with reason
│   └─ Track approvals
│
├── ⭐ Reviewer Management Tab
│   ├─ View all reviewers
│   ├─ Check reviewer stats
│   ├─ Remove reviewers
│   └─ View leaderboard
│
└── 📊 Reports Tab
    ├─ User statistics
    ├─ Post verification stats
    ├─ AI detection reports
    └─ System health
```

---

## 🔄 Data Flow Example: Comment System

```
1. USER WRITES COMMENT
   └─ POST /api/posts/:postId/comment
           │
           ├─ Validate comment text
           ├─ Apply profanity filter
           │
           ▼
           PROFANITY_FILTER_SERVICE
           │
           ├─ Replace bad words with ***
           └─ Maintain same character length
           │
           ▼
2. SAVE TO DATABASE
   └─ Post.comments.push({
        userId,
        text: (filtered),
        createdAt
      })
           │
           ▼
3. POPULATE RESPONSE
   └─ Get user info
   └─ Format comment with avatar
           │
           ▼
4. SEND TO FRONTEND
   └─ GET /api/posts/feed
           │
           ├─ Get all posts
           ├─ Populate user details
           ├─ Populate comments
           │
           ▼
5. DISPLAY IN FEED
   └─ Show comment with profanity filtered
```

---

## 🔌 API Endpoints Summary

```
AUTH
  POST   /api/auth/signup           → Register new user
  POST   /api/auth/login            → Login user
  POST   /api/auth/logout           → Logout
  POST   /api/auth/verify-otp       → Verify OTP
  POST   /api/auth/forgot-password  → Send reset email

USER
  GET    /api/users/profiles        → Get user profile
  PUT    /api/users/profiles        → Update profile
  GET    /api/users/payment-methods → Get payment methods
  PUT    /api/users/payment-methods → Save payment methods
  POST   /api/users/:userId/block   → Block user
  POST   /api/users/:userId/unblock → Unblock user

POST
  GET    /api/posts/feed            → Get posts feed
  POST   /api/posts                 → Create post
  GET    /api/posts/:id             → Get single post
  PUT    /api/posts/:id             → Update post
  DELETE /api/posts/:id             → Delete post
  POST   /api/posts/:id/comment     → Add comment
  POST   /api/posts/:id/like        → Like post
  POST   /api/posts/:id/share       → Share post

REVIEW
  GET    /api/reviews/queue         → Get posts to review
  POST   /api/reviews/submit        → Submit review vote
  GET    /api/reviews/stats         → Get reviewer stats

PRODUCT
  GET    /api/products              → List products
  POST   /api/products              → Create product
  GET    /api/products/:id          → Get product details
  PUT    /api/products/:id          → Update product
  DELETE /api/products/:id          → Delete product

ORDER
  GET    /api/shop/orders           → Get user orders
  POST   /api/shop/orders           → Create order
  GET    /api/shop/orders/:id       → Get order details

ADMIN
  GET    /api/admin/users           → List all users
  GET    /api/admin/reviewer-requests → List requests
  POST   /api/admin/reviewer-requests/:id/approve
  POST   /api/admin/reviewer-requests/:id/reject

AI
  GET    /api/ai/health             → Check Ollama status
  POST   /api/ai/chat               → Chat with AI
  POST   /api/ai/generate           → Generate text
```

---

## 🚀 Deployment Stack

```
LOCAL DEVELOPMENT
├─ Frontend: npm run dev (Vite) → localhost:5173
├─ Backend: npm start (Node) → localhost:5000
├─ Ollama: ollama serve → localhost:11434
├─ MongoDB: Cloud (Atlas)
└─ ngrok: ngrok http 5000 → Public HTTPS URL

PRODUCTION (Ready for deployment)
├─ Frontend: npm run build → /dist folder
├─ Backend: Node.js server (express)
├─ Database: MongoDB Atlas (Cloud)
├─ AI: Ollama (local or remote)
└─ Storage: File uploads to /uploads
```

---

## 🔒 Security Features

```
✅ JWT Authentication
✅ Password hashing (bcrypt)
✅ Rate limiting on auth routes
✅ CORS configuration
✅ NoSQL injection prevention (mongo-sanitize)
✅ Helmet security headers
✅ Input validation & sanitization
✅ Protected routes (auth middleware)
✅ User blocking system
✅ Profanity filtering
✅ File upload validation
```

---

## 📦 Tech Stack

```
FRONTEND
├─ React 19
├─ React Router 7
├─ Styled Components
├─ Lucide Icons
├─ Vite (build tool)
└─ Node.js

BACKEND
├─ Node.js
├─ Express.js
├─ MongoDB + Mongoose
├─ JWT (jsonwebtoken)
├─ Bcrypt (password hashing)
├─ Multer (file uploads)
├─ Nodemailer (email)
├─ Helmet (security)
└─ CORS middleware

AI/ML
├─ Ollama (LLM server)
├─ llama3.2 (language model)
└─ Tesseract.js (OCR)

EXTERNAL SERVICES
├─ MongoDB Atlas (database)
├─ Ethereal Email (testing)
├─ ngrok (tunneling)
└─ Ollama (local AI)
```

---

## 📝 File Structure

```
Verity/
├── backend/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── post/
│   │   ├── product/
│   │   ├── order/
│   │   ├── review/
│   │   ├── reviewer/
│   │   ├── admin/
│   │   ├── ai/
│   │   └── story/
│   ├── services/
│   ├── middleware/
│   ├── models/
│   └── server.js
│
├── Verity_FYP/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── feed/
│   │   │   ├── profile/
│   │   │   ├── business/
│   │   │   ├── review/
│   │   │   ├── admin/
│   │   │   ├── shopping/
│   │   │   └── shared/
│   │   ├── services/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── dist/ (built frontend)
│   └── package.json
│
└── .git/
```

---

## 🎯 Key Features Summary

```
✅ User Authentication (signup, login, OTP, password reset)
✅ Role-Based Access Control (Admin, Business, Reviewer, User)
✅ Post Verification System (AI + Human review)
✅ AI-Powered Content Detection
✅ Reviewer Assignment & Leaderboard
✅ Business Dashboard with Products & Payments
✅ E-commerce (Products, Orders, Cart)
✅ Messaging & Notifications
✅ Comment System with Profanity Filtering
✅ Story Feature (24-hour content)
✅ AI Assistant (Ollama integration)
✅ Admin Panel
✅ Block/Unblock Users
✅ Reviewer Request Management
✅ Video & Image Analysis
✅ Mobile Responsive Design
✅ Ngrok Public Access
```

---

Created: July 28, 2026


---

# 💾 Database Schema (MongoDB)

## User Model

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String,
  phoneNumber: String,
  
  // Profile Info
  avatar: String (file path),
  bio: String (max 150 chars),
  role: String enum: ['User', 'Admin', 'Business', 'Reviewer'],
  
  // Account Status
  isBlocked: Boolean (default: false),
  blockedAt: Date,
  blockedReason: String,
  
  // Location
  city: String,
  country: String,
  
  // Verification
  isVerified: Boolean (default: false),
  verifiedAt: Date,
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto),
  
  // Payment Methods (stored as object)
  paymentMethods: {
    easypaisa: {
      enabled: Boolean,
      accountNumber: String,
      accountName: String
    },
    jazzcash: {
      enabled: Boolean,
      accountNumber: String,
      accountName: String
    },
    bankTransfer: {
      enabled: Boolean,
      bankName: String,
      accountTitle: String,
      accountNumber: String,
      iban: String,
      branchCode: String
    },
    creditCard: {
      enabled: Boolean,
      instructions: String
    },
    cashOnDelivery: {
      enabled: Boolean,
      areas: String
    }
  }
}
```

---

## Post Model

```javascript
{
  _id: ObjectId,
  
  // Content
  content: String (required),
  images: [{
    url: String,
    uploadedAt: Date
  }],
  videos: [{
    url: String,
    thumbnail: String,
    uploadedAt: Date
  }],
  
  // Author
  userId: ObjectId (ref: User),
  userName: String,
  userAvatar: String,
  
  // Verification Status
  verificationStatus: String enum: [
    'approved',
    'rejected',
    'flagged-ai',
    'awaiting-ai-detection',
    'awaiting-review',
    'in-progress'
  ],
  
  // AI Detection
  aiDetectionResults: {
    isFake: Boolean,
    confidence: Number (0-100),
    detectionType: String,
    flaggedAt: Date
  },
  
  // Reviews
  reviews: [{
    reviewerId: ObjectId (ref: Reviewer),
    reviewerName: String,
    vote: String enum: ['approve', 'reject', 'flag'],
    reason: String,
    submittedAt: Date
  }],
  
  // Comments
  comments: [{
    userId: ObjectId (ref: User),
    userName: String,
    userRole: String,
    text: String (profanity filtered),
    createdAt: Date,
    likes: Number (default: 0)
  }],
  
  // Engagement
  likes: [{
    userId: ObjectId (ref: User),
    userRole: String
  }],
  shares: [{
    userId: ObjectId (ref: User),
    userRole: String,
    sharedAt: Date
  }],
  
  // Stats
  viewCount: Number (default: 0),
  likesCount: Number (default: 0),
  commentsCount: Number (default: 0),
  sharesCount: Number (default: 0),
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Review Model

```javascript
{
  _id: ObjectId,
  
  // Post Reference
  postId: ObjectId (ref: Post, required),
  
  // Reviewer
  reviewerId: ObjectId (ref: Reviewer, required),
  reviewerName: String,
  
  // Review Decision
  vote: String enum: ['approve', 'reject', 'flag'] (required),
  reason: String,
  confidence: Number (0-100),
  
  // Content Analysis
  contentFlags: [{
    type: String,
    severity: String enum: ['low', 'medium', 'high'],
    description: String
  }],
  
  // Timestamps
  submittedAt: Date (auto),
  reviewedAt: Date,
  
  // Status
  isActive: Boolean (default: true)
}
```

---

## Reviewer Model

```javascript
{
  _id: ObjectId,
  
  // Link to User
  userId: ObjectId (ref: User, required, unique),
  email: String,
  fullName: String,
  avatar: String,
  
  // Stats
  totalReviews: Number (default: 0),
  approvalsCount: Number (default: 0),
  rejectionsCount: Number (default: 0),
  flagsCount: Number (default: 0),
  
  // Scoring
  trustScore: Number (default: 0, range: 0-100),
  voteUpCount: Number (default: 0),
  voteDownCount: Number (default: 0),
  
  // Leaderboard
  rank: Number,
  points: Number (default: 0),
  
  // Status
  isActive: Boolean (default: true),
  joinedAt: Date (auto),
  
  // Performance Metrics
  accuracy: Number (percentage),
  reviewsThisMonth: Number,
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## ReviewerRequest Model

```javascript
{
  _id: ObjectId,
  
  // Applicant
  userId: ObjectId (ref: User, required),
  email: String,
  fullName: String,
  
  // Request Details
  status: String enum: ['pending', 'approved', 'rejected'] (default: 'pending'),
  appliedAt: Date (auto),
  
  // Admin Response
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  rejectionReason: String,
  rejectedAt: Date,
  
  // Additional Info
  motivation: String,
  experience: String,
  expertise: [String]
}
```

---

## Product Model

```javascript
{
  _id: ObjectId,
  
  // Business/Seller
  businessId: ObjectId (ref: Business),
  sellerName: String,
  sellerEmail: String,
  
  // Product Info
  name: String (required),
  description: String,
  price: Number (required),
  category: String (required),
  tags: [String],
  
  // Media
  images: [{
    url: String,
    uploadedAt: Date,
    order: Number
  }],
  videos: [{
    url: String,
    thumbnail: String
  }],
  
  // Inventory
  stock: Number (default: 0),
  sku: String (unique),
  
  // Engagement
  inquiries: [{
    userId: ObjectId (ref: User),
    user: {
      fullName: String,
      email: String,
      avatar: String
    },
    message: String,
    createdAt: Date,
    status: String enum: ['pending', 'answered', 'closed']
  }],
  
  // Stats
  views: Number (default: 0),
  likesCount: Number (default: 0),
  inquiriesCount: Number (default: 0),
  
  // Verification
  isVerified: Boolean (default: false),
  verifiedAt: Date,
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Order Model

```javascript
{
  _id: ObjectId,
  
  // Buyer & Seller
  buyerId: ObjectId (ref: User, required),
  buyerEmail: String,
  sellerId: ObjectId (ref: Business),
  
  // Items
  items: [{
    productId: ObjectId (ref: Product),
    productName: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  
  // Pricing
  subtotal: Number,
  shippingCost: Number (default: 0),
  tax: Number (default: 0),
  totalAmount: Number,
  
  // Delivery
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    country: String,
    postalCode: String
  },
  
  // Payment
  paymentMethod: String enum: [
    'easypaisa',
    'jazzcash',
    'bankTransfer',
    'creditCard',
    'cashOnDelivery'
  ],
  paymentStatus: String enum: [
    'pending',
    'completed',
    'failed',
    'refunded'
  ],
  
  // Order Status
  status: String enum: [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned'
  ],
  
  // Tracking
  trackingNumber: String,
  estimatedDelivery: Date,
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto),
  deliveredAt: Date
}
```

---

## Cart Model

```javascript
{
  _id: ObjectId,
  
  // User
  userId: ObjectId (ref: User, required, unique),
  
  // Items
  items: [{
    productId: ObjectId (ref: Product, required),
    quantity: Number (required, min: 1),
    addedAt: Date,
    price: Number
  }],
  
  // Summary
  itemCount: Number,
  totalPrice: Number,
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto),
  expiresAt: Date (60 days from creation)
}
```

---

## Story Model

```javascript
{
  _id: ObjectId,
  
  // Author
  userId: ObjectId (ref: User, required),
  userName: String,
  userAvatar: String,
  
  // Content
  media: {
    type: String enum: ['image', 'video'],
    url: String (required),
    thumbnail: String (for videos)
  },
  
  // Story Info
  caption: String,
  storyType: String enum: ['text', 'photo', 'video'],
  
  // Engagement
  views: [{
    userId: ObjectId (ref: User),
    viewedAt: Date
  }],
  viewCount: Number (default: 0),
  
  // Duration
  createdAt: Date (auto, required),
  expiresAt: Date (24 hours from creation),
  
  // Status
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false)
}
```

---

## Message Model

```javascript
{
  _id: ObjectId,
  
  // Participants
  senderId: ObjectId (ref: User, required),
  senderName: String,
  senderRole: String,
  
  recipientId: ObjectId (ref: User, required),
  recipientName: String,
  recipientRole: String,
  
  // Message Content
  content: String (required),
  messageType: String enum: ['text', 'image', 'file'] (default: 'text'),
  attachmentUrl: String,
  
  // Status
  isRead: Boolean (default: false),
  readAt: Date,
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Connection Model

```javascript
{
  _id: ObjectId,
  
  // Users
  userId: ObjectId (ref: User, required),
  connectedUserId: ObjectId (ref: User, required),
  
  // Relationship
  status: String enum: [
    'requested',
    'connected',
    'blocked',
    'rejected'
  ] (default: 'requested'),
  
  // Timestamps
  requestedAt: Date (auto),
  connectedAt: Date,
  rejectedAt: Date,
  blockedAt: Date,
  
  // Metadata
  index: { userId: 1, connectedUserId: 1 } (unique)
}
```

---

## Notification Model

```javascript
{
  _id: ObjectId,
  
  // Recipient
  userId: ObjectId (ref: User, required),
  
  // Notification Details
  type: String enum: [
    'post_comment',
    'post_like',
    'post_share',
    'new_follower',
    'message',
    'post_reviewed',
    'reviewer_approved',
    'order_status',
    'product_inquiry'
  ],
  
  // Content
  title: String,
  message: String,
  relatedId: ObjectId (post, review, order, etc.),
  relatedModel: String,
  
  // Status
  isRead: Boolean (default: false),
  readAt: Date,
  
  // Timestamps
  createdAt: Date (auto),
  expiresAt: Date (30 days from creation)
}
```

---

## Business Model

```javascript
{
  _id: ObjectId,
  
  // Link to User
  userId: ObjectId (ref: User, required, unique),
  email: String,
  businessName: String,
  ownerName: String,
  
  // Business Info
  description: String,
  logo: String (file path),
  bannerImage: String,
  category: String,
  website: String,
  
  // Contact
  phoneNumber: String,
  address: {
    street: String,
    city: String,
    country: String,
    postalCode: String
  },
  
  // Verification
  registrationNumber: String,
  taxId: String,
  isVerified: Boolean (default: false),
  verifiedAt: Date,
  
  // Stats
  totalProducts: Number (default: 0),
  totalOrders: Number (default: 0),
  totalRevenue: Number (default: 0),
  averageRating: Number (default: 0),
  
  // Reputation
  totalReviews: Number (default: 0),
  positiveReviews: Number (default: 0),
  trustScore: Number (default: 0),
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto),
  suspendedAt: Date
}
```

---

## Database Relationships (ERD)

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                    │
└─────────────────────────────────────────────────────────────┘

USER (1) ─────── (M) POST
  ├─ User creates multiple posts
  └─ Each post belongs to one user

USER (1) ─────── (M) COMMENT (in Post)
  └─ User comments on posts

USER (1) ─────── (M) MESSAGE
  ├─ User sends messages
  └─ User receives messages

USER (1) ─────── (M) NOTIFICATION
  └─ User receives notifications

USER (1) ─────── (M) CONNECTION
  └─ User connects with other users

USER (1) ─────── (1) REVIEWER
  └─ Some users are reviewers

USER (1) ─────── (M) REVIEWER_REQUEST
  └─ User applies to become reviewer

USER (1) ─────── (1) BUSINESS
  └─ Some users are business owners

BUSINESS (1) ─────── (M) PRODUCT
  └─ Business lists multiple products

PRODUCT (1) ─────── (M) ORDER
  └─ Product can be ordered multiple times

PRODUCT (1) ─────── (M) INQUIRY (in Product.inquiries)
  └─ Product receives inquiries

USER (1) ─────── (M) ORDER
  └─ User places multiple orders

POST (1) ─────── (M) REVIEW
  └─ Post receives multiple reviews

REVIEWER (1) ─────── (M) REVIEW
  └─ Reviewer submits multiple reviews

POST (1) ─────── (M) COMMENT
  ├─ Post has multiple comments
  └─ Comments have likes/reactions

USER (1) ─────── (M) STORY
  └─ User posts multiple stories

USER (1) ─────── (M) LIKE (in Post)
  └─ User likes multiple posts

USER (1) ─────── (M) SHARE (in Post)
  └─ User shares multiple posts
```

---

## Database Indexing Strategy

```
USER Indexes:
├─ email (unique)
├─ role (for querying by role)
├─ isBlocked (for login checks)
└─ createdAt (for sorting)

POST Indexes:
├─ userId (for user's posts)
├─ verificationStatus (for filtering)
├─ createdAt (for feed sorting)
├─ viewCount (for popular posts)
└─ compound: (userId, createdAt)

REVIEWER Indexes:
├─ userId (unique)
├─ trustScore (for leaderboard)
├─ rank (for ranking)
└─ totalReviews (for sorting)

PRODUCT Indexes:
├─ businessId (for seller's products)
├─ category (for filtering)
├─ price (for range queries)
├─ views (for popular products)
└─ createdAt (for sorting)

ORDER Indexes:
├─ buyerId (for user's orders)
├─ sellerId (for seller's sales)
├─ status (for filtering)
├─ createdAt (for sorting)
└─ compound: (buyerId, createdAt)

CONNECTION Indexes:
├─ userId (for user's connections)
├─ connectedUserId (for reverse lookup)
├─ status (for filtering)
└─ compound: (userId, connectedUserId, status) unique

MESSAGE Indexes:
├─ senderId (for sent messages)
├─ recipientId (for received messages)
├─ isRead (for unread counts)
└─ compound: (senderId, recipientId, createdAt)

NOTIFICATION Indexes:
├─ userId (for user's notifications)
├─ isRead (for unread count)
├─ createdAt (for sorting)
└─ expiresAt (for TTL expiration)
```

---

## Data Volume Estimates

```
Assuming 100,000 users after 1 year:

USER               ~100,000 documents    ~5-10 MB
POST               ~500,000 documents    ~50-100 MB
COMMENT (in Post)  ~2,000,000 sub-docs   ~200 MB
REVIEW             ~200,000 documents    ~20-30 MB
REVIEWER           ~10,000 documents     ~1-2 MB
PRODUCT            ~50,000 documents     ~10-15 MB
ORDER              ~100,000 documents    ~30-50 MB
CART               ~10,000 documents     ~2-3 MB
STORY              ~500,000 documents    ~30-50 MB
MESSAGE            ~1,000,000 documents  ~50-80 MB
CONNECTION         ~500,000 documents    ~5-10 MB
NOTIFICATION       ~2,000,000 documents  ~80-100 MB

TOTAL ESTIMATED: ~300-500 MB
```

---

## MongoDB Best Practices Used

```
✅ Document-oriented structure (flexible schema)
✅ Subdocuments for related data (comments, inquiries, reviews)
✅ Array fields for collections (likes, shares, views)
✅ ObjectId references for relationships
✅ Denormalization for frequently accessed data
✅ TTL indexes for auto-expiring documents (stories, notifications)
✅ Compound indexes for common query patterns
✅ Unique constraints on email and credentials
✅ Auto-generated timestamps (createdAt, updatedAt)
✅ Lean queries for read-only operations
✅ Population for related document joins
✅ Aggregation pipeline for complex queries
```

---

## MongoDB Connection Details

```
MongoDB Atlas
├─ Cluster: Cluster0
├─ Provider: AWS
├─ Region: us-east-1
├─ Connection: mongodb+srv://username:password@cluster0.cdtghag.mongodb.net/
├─ Database: Verity (implicit in collections)
├─ Auth: SCRAM-SHA-1
└─ Network Access: Whitelist IP ranges

Collections:
├─ users
├─ posts
├─ reviews
├─ reviewers
├─ reviewerrequests
├─ products
├─ orders
├─ carts
├─ stories
├─ messages
├─ connections
├─ notifications
└─ businesses
```

---

## Query Examples

```javascript
// Get user's feed (posts by followed users)
db.posts.find({
  userId: { $in: followedUserIds },
  verificationStatus: 'approved',
  createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})
.sort({ createdAt: -1 })
.limit(20)

// Get pending reviews for a reviewer
db.posts.find({
  verificationStatus: 'awaiting-review',
  'reviews.reviewerId': { $ne: reviewerId }
})
.limit(10)

// Get top products by views
db.products.find()
.sort({ views: -1 })
.limit(20)

// Get user's unread messages count
db.messages.countDocuments({
  recipientId: userId,
  isRead: false
})

// Get reviewer's monthly stats
db.reviews.aggregate([
  { $match: { reviewerId: reviewerId, submittedAt: { $gte: monthStart } } },
  { $group: { _id: '$vote', count: { $sum: 1 } } }
])

// Get active stories (last 24 hours)
db.stories.find({
  isActive: true,
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
})
```

---

Created: July 28, 2026
Last Updated: July 28, 2026
