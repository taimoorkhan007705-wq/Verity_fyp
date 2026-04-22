# Verity API Collection for Postman

## Environment Variables
Set these in Postman Environment:
- `base_url` = `http://localhost:5000`
- `token` = (will be set after login/signup)
- `user_id` = (will be set after login/signup)

---

## 1. AUTHENTICATION APIs

### 1.1 Signup
```
POST {{base_url}}/api/auth/signup

Headers:
Content-Type: application/json

Body (JSON):
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Test1234",
  "role": "User"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "avatar": null,
    "trustScore": 50
  }
}
```

### 1.2 Login
```
POST {{base_url}}/api/auth/login

Headers:
Content-Type: application/json

Body (JSON):
{
  "email": "john@example.com",
  "password": "Test1234",
  "role": "User"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "avatar": null,
    "trustScore": 50
  }
}
```

### 1.3 Test Auth (Public)
```
GET {{base_url}}/api/auth/test

Response:
{
  "success": true,
  "message": "Auth API is working!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "user": null
}
```

### 1.4 Test Auth (Protected)
```
GET {{base_url}}/api/auth/test-protected

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "message": "Auth API is working!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "...",
    "role": "User"
  }
}
```

---

## 2. USER PROFILE APIs

### 2.1 Get Own Profile
```
GET {{base_url}}/api/users/profiles

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "website": "",
    "avatar": null,
    "role": "User",
    "trustScore": 50,
    "followersCount": 0,
    "followingCount": 0,
    "postsCount": 0,
    "isVerified": false
  }
}
```

### 2.2 Get User by ID
```
GET {{base_url}}/api/users/profiles/{{user_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "website": "",
    "avatar": null,
    "role": "User",
    "trustScore": 50,
    "followersCount": 0,
    "followingCount": 0,
    "postsCount": 0,
    "isVerified": false
  }
}
```

### 2.3 Update Profile
```
PUT {{base_url}}/api/users/profiles

Headers:
Authorization: Bearer {{token}}
Content-Type: application/json

Body (JSON):
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Software Developer",
  "website": "https://johnsmith.com"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Smith",
    "fullName": "John Smith",
    "email": "john@example.com",
    "bio": "Software Developer",
    "website": "https://johnsmith.com",
    "avatar": null,
    "role": "User",
    "trustScore": 50
  }
}
```

### 2.4 Update Profile with Avatar
```
PUT {{base_url}}/api/users/profiles

Headers:
Authorization: Bearer {{token}}

Body (form-data):
firstName: John
lastName: Smith
bio: Software Developer
avatar: [Select Image File]

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "...",
    "avatar": "/uploads/users/.../profile/avatar-....jpg"
  }
}
```

### 2.5 Delete User Account
```
DELETE {{base_url}}/api/users/profiles/{{user_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "message": "Account deleted successfully",
  "deletedUser": {
    "id": "...",
    "email": "john@example.com",
    "role": "User"
  }
}
```

---

## 3. POST APIs

### 3.1 Create Post (Text Only)
```
POST {{base_url}}/api/posts

Headers:
Authorization: Bearer {{token}}

Body (form-data):
content: This is my first post!
hashtags: test,verity

Response:
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "...",
    "content": "This is my first post!",
    "hashtags": ["test", "verity"],
    "verificationStatus": "pending",
    "author": "..."
  }
}
```

### 3.2 Create Post with Media
```
POST {{base_url}}/api/posts

Headers:
Authorization: Bearer {{token}}

Body (form-data):
content: Check this out!
hashtags: photo,verity
media: [Select Image File]

Response:
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "...",
    "content": "Check this out!",
    "media": [
      {
        "url": "/uploads/users/.../posts/media-....png"
      }
    ],
    "verificationStatus": "pending"
  }
}
```

### 3.3 Get Feed (Approved Posts)
```
GET {{base_url}}/api/posts/feed?page=1&limit=10

Response:
{
  "success": true,
  "posts": [
    {
      "_id": "...",
      "content": "Post content",
      "author": {
        "fullName": "John Doe",
        "avatar": "..."
      },
      "likesCount": 0,
      "commentsCount": 0,
      "verificationStatus": "approved"
    }
  ],
  "totalPages": 1,
  "currentPage": 1
}
```

### 3.4 Get User Posts
```
GET {{base_url}}/api/posts/user/{{user_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "posts": [...]
}
```

### 3.5 Like Post
```
POST {{base_url}}/api/posts/{{post_id}}/like

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "likes": 1
}
```

### 3.6 Delete Post
```
DELETE {{base_url}}/api/posts/{{post_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## 4. REVIEW APIs (Reviewer Only)

### 4.1 Get Pending Reviews
```
GET {{base_url}}/api/reviews/pending

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "groupedPosts": [
    {
      "author": {
        "_id": "...",
        "fullName": "John Doe",
        "email": "john@example.com",
        "avatar": null
      },
      "posts": [
        {
          "_id": "...",
          "content": "Post content",
          "media": [],
          "hashtags": [],
          "verificationStatus": "pending"
        }
      ],
      "totalPosts": 1
    }
  ],
  "totalAuthors": 1,
  "totalPosts": 1
}
```

### 4.2 Submit Review (Approve)
```
POST {{base_url}}/api/reviews/submit

Headers:
Authorization: Bearer {{token}}
Content-Type: application/json

Body (JSON):
{
  "postId": "...",
  "verdict": "verified",
  "notes": "Content looks good",
  "confidence": 95
}

Response:
{
  "success": true,
  "message": "Post approved successfully",
  "review": {
    "_id": "...",
    "verdict": "verified",
    "notes": "Content looks good"
  }
}
```

### 4.3 Submit Review (Reject)
```
POST {{base_url}}/api/reviews/submit

Headers:
Authorization: Bearer {{token}}
Content-Type: application/json

Body (JSON):
{
  "postId": "...",
  "verdict": "false",
  "notes": "Misleading information",
  "confidence": 90
}

Response:
{
  "success": true,
  "message": "Post rejected successfully",
  "review": {
    "_id": "...",
    "verdict": "false"
  }
}
```

### 4.4 Get Reviewer Stats
```
GET {{base_url}}/api/reviews/stats

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "stats": {
    "totalReviews": 10,
    "approvedReviews": 8,
    "rejectedReviews": 2,
    "pendingReviews": 5,
    "accuracy": 80
  }
}
```

---

## 5. PRODUCT APIs (Business)

### 5.1 Create Product
```
POST {{base_url}}/api/products

Headers:
Authorization: Bearer {{token}}

Body (form-data):
name: iPhone 15 Pro
description: Latest iPhone with A17 chip
price: 1299
category: Electronics
stock: 10
tags: ["phone", "apple", "iphone"]
images: [Select Image Files - up to 5]

Response:
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "...",
    "name": "iPhone 15 Pro",
    "price": 1299,
    "category": "Electronics",
    "stock": 10,
    "images": [...]
  }
}
```

### 5.2 Get All Products (Shopping)
```
GET {{base_url}}/api/products?page=1&limit=12&category=Electronics&search=iphone

Response:
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "iPhone 15 Pro",
      "price": 1299,
      "category": "Electronics",
      "images": [...],
      "business": {
        "fullName": "Business Name",
        "avatar": "..."
      },
      "views": 0,
      "likesCount": 0,
      "inquiriesCount": 0
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "totalProducts": 1
}
```

### 5.3 Get Product by ID
```
GET {{base_url}}/api/products/{{product_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with A17 chip",
    "price": 1299,
    "category": "Electronics",
    "stock": 10,
    "images": [...],
    "business": {...},
    "views": 1,
    "likesCount": 0
  }
}
```

### 5.4 Get Business Products
```
GET {{base_url}}/api/products/business/my-products

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "products": [...],
  "analytics": {
    "totalProducts": 5,
    "totalViews": 100,
    "totalInquiries": 10,
    "totalLikes": 20,
    "activeProducts": 5
  }
}
```

### 5.5 Update Product
```
PUT {{base_url}}/api/products/{{product_id}}

Headers:
Authorization: Bearer {{token}}
Content-Type: application/json

Body (JSON):
{
  "name": "iPhone 15 Pro Max",
  "price": 1399,
  "stock": 15
}

Response:
{
  "success": true,
  "message": "Product updated successfully",
  "product": {...}
}
```

### 5.6 Delete Product
```
DELETE {{base_url}}/api/products/{{product_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 5.7 Like Product
```
POST {{base_url}}/api/products/{{product_id}}/like

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "likes": 1
}
```

### 5.8 Send Product Inquiry
```
POST {{base_url}}/api/products/{{product_id}}/inquiry

Headers:
Authorization: Bearer {{token}}
Content-Type: application/json

Body (JSON):
{
  "message": "Is this product still available?"
}

Response:
{
  "success": true,
  "message": "Inquiry sent successfully"
}
```

---

## 6. STORY APIs

### 6.1 Create Story
```
POST {{base_url}}/api/stories

Headers:
Authorization: Bearer {{token}}

Body (form-data):
media: [Select Image/Video File]

Response:
{
  "success": true,
  "message": "Story created successfully",
  "story": {
    "_id": "...",
    "author": "...",
    "media": {
      "url": "/uploads/users/.../stories/story-....jpg"
    },
    "expiresAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### 6.2 Get All Stories
```
GET {{base_url}}/api/stories

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "stories": [
    {
      "_id": "...",
      "author": {
        "fullName": "John Doe",
        "avatar": "..."
      },
      "media": {
        "url": "..."
      },
      "views": 0,
      "expiresAt": "..."
    }
  ]
}
```

### 6.3 Get User Stories
```
GET {{base_url}}/api/stories/user/{{user_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "stories": [...]
}
```

### 6.4 View Story
```
POST {{base_url}}/api/stories/{{story_id}}/view

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "views": 1
}
```

### 6.5 Delete Story
```
DELETE {{base_url}}/api/stories/{{story_id}}

Headers:
Authorization: Bearer {{token}}

Response:
{
  "success": true,
  "message": "Story deleted successfully"
}
```

---

## Testing Workflow

### Step 1: Create Accounts
1. Signup as User
2. Signup as Reviewer
3. Signup as Business

### Step 2: Test User Flow
1. Login as User
2. Update Profile
3. Create Post
4. View Feed (should be empty - post is pending)

### Step 3: Test Reviewer Flow
1. Login as Reviewer
2. Get Pending Reviews
3. Approve/Reject Posts
4. Check Reviewer Stats

### Step 4: Test Business Flow
1. Login as Business
2. Create Products
3. View Business Products
4. Check Analytics

### Step 5: Test Shopping Flow
1. Login as User
2. Get All Products
3. Like Product
4. Send Inquiry

### Step 6: Test Stories
1. Login as User
2. Create Story
3. Get All Stories
4. View Story
5. Delete Story

---

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only businesses can create products"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error message",
  "error": "Detailed error"
}
```

---

## Notes

1. Always set the `token` in environment variables after login/signup
2. Replace `{{product_id}}`, `{{post_id}}`, `{{story_id}}`, `{{user_id}}` with actual IDs
3. For file uploads, use `form-data` body type in Postman
4. All protected routes require `Authorization: Bearer {{token}}` header
5. Base URL is `http://localhost:5000` (make sure backend is running)
