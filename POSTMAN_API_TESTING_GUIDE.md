# Postman API Testing Guide - Verity Project

## Setup Instructions

### 1. Install Postman
Download from: https://www.postman.com/downloads/

### 2. Base URL Configuration
Create an environment variable in Postman:
- Variable Name: `base_url`
- Value: `http://localhost:5000/api`

### 3. Authentication Token Setup
After login, save the token as an environment variable:
- Variable Name: `auth_token`
- Value: (copy from login response)

---

## API Endpoints Testing Guide

### 📁 COLLECTION 1: Authentication APIs

#### 1.1 User Signup (POST)
**Endpoint:** `{{base_url}}/auth/signup`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "User"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6996e768a1296fc08ee8d827",
    "email": "john@example.com",
    "role": "User",
    "fullName": "John Doe"
  }
}
```

**Test Cases:**
- ✅ Valid user signup
- ✅ Reviewer signup (change role to "Reviewer")
- ✅ Business signup (change role to "Business")
- ❌ Duplicate email (should fail)
- ❌ Missing required fields (should fail)

---

#### 1.2 User Login (POST)
**Endpoint:** `{{base_url}}/auth/login`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "User"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6996e768a1296fc08ee8d827",
    "email": "john@example.com",
    "role": "User",
    "fullName": "John Doe",
    "avatar": null,
    "trustScore": 50
  }
}
```

**After Success:**
1. Copy the `token` value
2. Save it as `auth_token` environment variable
3. Use this token for all protected routes

**Test Cases:**
- ✅ Valid login
- ❌ Wrong password
- ❌ Wrong email
- ❌ Wrong role


---

### 📁 COLLECTION 2: User Profile APIs

#### 2.1 Get User Profile (GET)
**Endpoint:** `{{base_url}}/users/profile`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "6996e768a1296fc08ee8d827",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "website": "",
    "avatar": null,
    "role": "User",
    "trustScore": 50,
    "followers": 0,
    "following": 0,
    "postsCount": 0
  }
}
```

**Test Cases:**
- ✅ Get profile with valid token
- ❌ Get profile without token (should fail with 401)
- ❌ Get profile with invalid token (should fail with 401)

---

#### 2.2 Update User Profile (PUT)
**Endpoint:** `{{base_url}}/users/profile`

**Method:** PUT

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body (form-data):**
```
firstName: John
lastName: Smith
bio: Software Developer | Tech Enthusiast
website: https://johnsmith.com
avatar: [Select File - image file]
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "6996e768a1296fc08ee8d827",
    "fullName": "John Smith",
    "bio": "Software Developer | Tech Enthusiast",
    "website": "https://johnsmith.com",
    "avatar": "/uploads/users/6996e768a1296fc08ee8d827/profile/avatar-1771665051378.jpg"
  }
}
```

**Test Cases:**
- ✅ Update profile with all fields
- ✅ Update profile with only text fields (no image)
- ✅ Update profile with only image
- ❌ Update without authentication

---

### 📁 COLLECTION 3: Post APIs

#### 3.1 Create Post (POST)
**Endpoint:** `{{base_url}}/posts`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body (form-data):**
```
content: This is my first post! #verity #socialmedia
hashtags: verity,socialmedia,test
visibility: public
media: [Select File - image or video]
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Post created successfully and sent for review",
  "post": {
    "_id": "699abc123def456",
    "content": "This is my first post! #verity #socialmedia",
    "author": "6996e768a1296fc08ee8d827",
    "verificationStatus": "pending",
    "isVerified": false,
    "media": [
      {
        "type": "image",
        "url": "/uploads/users/6996e768a1296fc08ee8d827/posts/media-1771659650065.png"
      }
    ],
    "hashtags": ["verity", "socialmedia", "test"],
    "createdAt": "2025-02-21T10:30:00.000Z"
  }
}
```

**Test Cases:**
- ✅ Create post with text only
- ✅ Create post with text and image
- ✅ Create post with text and video
- ✅ Create post with multiple images
- ❌ Create post without authentication
- ❌ Create post without content (should fail)

---

#### 3.2 Get Feed (GET)
**Endpoint:** `{{base_url}}/posts/feed?page=1&limit=10`

**Method:** GET

**Headers:** None required (public endpoint)

**Query Parameters:**
```
page: 1
limit: 10
```

**Expected Response (200):**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "699abc123def456",
      "content": "This is my first post!",
      "author": {
        "_id": "6996e768a1296fc08ee8d827",
        "user_info": {
          "fullName": "John Doe"
        },
        "profile_info": {
          "avatar": "/uploads/users/.../avatar.jpg"
        }
      },
      "verificationStatus": "approved",
      "isVerified": true,
      "likes": 5,
      "comments": 2,
      "createdAt": "2025-02-21T10:30:00.000Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1
}
```

**Test Cases:**
- ✅ Get feed with default pagination
- ✅ Get feed with custom page and limit
- ✅ Get feed when no posts exist

---

#### 3.3 Get Post by ID (GET)
**Endpoint:** `{{base_url}}/posts/699abc123def456`

**Method:** GET

**Headers:** None required

**Expected Response (200):**
```json
{
  "success": true,
  "post": {
    "_id": "699abc123def456",
    "content": "This is my first post!",
    "author": {
      "fullName": "John Doe",
      "avatar": "/uploads/users/.../avatar.jpg"
    },
    "media": [],
    "likes": 5,
    "comments": [],
    "verificationStatus": "approved"
  }
}
```

**Test Cases:**
- ✅ Get existing post
- ❌ Get non-existent post (should return 404)

---

#### 3.4 Like Post (POST)
**Endpoint:** `{{base_url}}/posts/699abc123def456/like`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post liked",
  "likes": 6
}
```

**Test Cases:**
- ✅ Like a post (first time)
- ✅ Unlike a post (toggle)
- ❌ Like without authentication

---

#### 3.5 Comment on Post (POST)
**Endpoint:** `{{base_url}}/posts/699abc123def456/comment`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "text": "Great post! Very informative."
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Comment added",
  "comment": {
    "user": "6996e768a1296fc08ee8d827",
    "text": "Great post! Very informative.",
    "createdAt": "2025-02-21T11:00:00.000Z"
  }
}
```

**Test Cases:**
- ✅ Add comment with valid text
- ❌ Add empty comment
- ❌ Comment without authentication

---

#### 3.6 Delete Post (DELETE)
**Endpoint:** `{{base_url}}/posts/699abc123def456`

**Method:** DELETE

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Test Cases:**
- ✅ Delete own post
- ❌ Delete another user's post (should fail with 403)
- ❌ Delete without authentication


---

### 📁 COLLECTION 4: Product APIs (Shopping)

#### 4.1 Create Product (POST) - Business Only
**Endpoint:** `{{base_url}}/products`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body (form-data):**
```
name: iPhone 15 Pro Max
description: Brand new iPhone 15 Pro Max, 256GB, Blue Titanium
price: 1299
category: Electronics
stock: 10
tags: ["iphone", "apple", "smartphone"]
images: [Select File - product image 1]
images: [Select File - product image 2]
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "699714ecd970e2ce95fbce11",
    "name": "iPhone 15 Pro Max",
    "description": "Brand new iPhone 15 Pro Max, 256GB, Blue Titanium",
    "price": 1299,
    "category": "Electronics",
    "stock": 10,
    "images": [
      {
        "url": "/uploads/users/.../products/product-1771674611638.jpg"
      }
    ],
    "business": "699714ecd970e2ce95fbce11",
    "views": 0,
    "likesCount": 0,
    "inquiriesCount": 0
  }
}
```

**Test Cases:**
- ✅ Create product as Business user
- ✅ Create product with multiple images
- ❌ Create product as regular User (should fail with 403)
- ❌ Create product without authentication
- ❌ Create product with invalid category

---

#### 4.2 Get All Products (GET)
**Endpoint:** `{{base_url}}/products?page=1&limit=12&category=Electronics&search=iphone`

**Method:** GET

**Headers:** None required (public endpoint)

**Query Parameters:**
```
page: 1 (optional)
limit: 12 (optional)
category: Electronics (optional)
search: iphone (optional)
```

**Expected Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "699714ecd970e2ce95fbce11",
      "name": "iPhone 15 Pro Max",
      "price": 1299,
      "category": "Electronics",
      "images": [
        {
          "url": "/uploads/users/.../products/product-1771674611638.jpg"
        }
      ],
      "business": {
        "user_info": {
          "fullName": "Ali's Store"
        },
        "profile_info": {
          "avatar": "/uploads/users/.../avatar.jpg"
        }
      },
      "views": 25,
      "likesCount": 5,
      "inquiriesCount": 3
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "totalProducts": 1
}
```

**Test Cases:**
- ✅ Get all products (no filters)
- ✅ Get products by category
- ✅ Search products by name
- ✅ Combine category and search filters
- ✅ Test pagination

---

#### 4.3 Get Product by ID (GET)
**Endpoint:** `{{base_url}}/products/699714ecd970e2ce95fbce11`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "699714ecd970e2ce95fbce11",
    "name": "iPhone 15 Pro Max",
    "description": "Brand new iPhone 15 Pro Max, 256GB, Blue Titanium",
    "price": 1299,
    "category": "Electronics",
    "stock": 10,
    "images": [],
    "business": {
      "user_info": {
        "fullName": "Ali's Store"
      },
      "contact_info": {
        "email": "ali@example.com"
      }
    },
    "views": 26,
    "likesCount": 5
  }
}
```

**Note:** Views count increases automatically when viewing

**Test Cases:**
- ✅ Get product details
- ✅ Verify view count increases
- ❌ Get non-existent product (404)

---

#### 4.4 Get Business Products (GET) - Business Only
**Endpoint:** `{{base_url}}/products/business/my-products`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "699714ecd970e2ce95fbce11",
      "name": "iPhone 15 Pro Max",
      "price": 1299,
      "stock": 10,
      "views": 26,
      "likesCount": 5,
      "inquiriesCount": 3,
      "inquiries": [
        {
          "user": {
            "user_info": {
              "fullName": "John Doe"
            },
            "email": "john@example.com"
          },
          "message": "Is this still available?",
          "createdAt": "2025-02-21T12:00:00.000Z"
        }
      ]
    }
  ],
  "analytics": {
    "totalProducts": 5,
    "totalViews": 150,
    "totalInquiries": 12,
    "totalLikes": 25,
    "activeProducts": 5
  }
}
```

**Test Cases:**
- ✅ Get products as Business owner
- ❌ Get products as regular User (should fail)

---

#### 4.5 Like Product (POST)
**Endpoint:** `{{base_url}}/products/699714ecd970e2ce95fbce11/like`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "likes": 6
}
```

**Test Cases:**
- ✅ Like product (first time)
- ✅ Unlike product (toggle)
- ❌ Like without authentication

---

#### 4.6 Send Product Inquiry (POST)
**Endpoint:** `{{base_url}}/products/699714ecd970e2ce95fbce11/inquiry`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "message": "Is this product still available? Can you ship to Karachi?"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Inquiry sent successfully"
}
```

**Test Cases:**
- ✅ Send inquiry with valid message
- ❌ Send empty inquiry
- ❌ Send inquiry without authentication

---

#### 4.7 Update Product (PUT) - Business Only
**Endpoint:** `{{base_url}}/products/699714ecd970e2ce95fbce11`

**Method:** PUT

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body (form-data):**
```
name: iPhone 15 Pro Max - Updated
price: 1199
stock: 8
isActive: true
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "699714ecd970e2ce95fbce11",
    "name": "iPhone 15 Pro Max - Updated",
    "price": 1199,
    "stock": 8
  }
}
```

**Test Cases:**
- ✅ Update own product
- ❌ Update another business's product (403)
- ❌ Update without authentication

---

#### 4.8 Delete Product (DELETE) - Business Only
**Endpoint:** `{{base_url}}/products/699714ecd970e2ce95fbce11`

**Method:** DELETE

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Test Cases:**
- ✅ Delete own product
- ❌ Delete another business's product (403)
- ❌ Delete without authentication


---

### 📁 COLLECTION 5: Story APIs

#### 5.1 Create Story (POST)
**Endpoint:** `{{base_url}}/stories`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body (form-data):**
```
caption: Beautiful sunset today! 🌅
media: [Select File - image or video]
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Story created successfully",
  "story": {
    "_id": "699story123abc",
    "user": "6996e768a1296fc08ee8d827",
    "mediaUrl": "/uploads/users/.../stories/story-1771670287329.jpg",
    "mediaType": "image",
    "caption": "Beautiful sunset today! 🌅",
    "expiresAt": "2025-02-22T10:30:00.000Z",
    "views": 0,
    "createdAt": "2025-02-21T10:30:00.000Z"
  }
}
```

**Test Cases:**
- ✅ Create story with image
- ✅ Create story with video
- ✅ Create story with caption
- ✅ Create story without caption
- ❌ Create story without media (should fail)
- ❌ Create story without authentication

---

#### 5.2 Get All Stories (GET)
**Endpoint:** `{{base_url}}/stories`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "stories": [
    {
      "_id": "699story123abc",
      "user": {
        "_id": "6996e768a1296fc08ee8d827",
        "user_info": {
          "fullName": "John Doe"
        },
        "profile_info": {
          "avatar": "/uploads/users/.../avatar.jpg"
        }
      },
      "mediaUrl": "/uploads/users/.../stories/story-1771670287329.jpg",
      "mediaType": "image",
      "caption": "Beautiful sunset today!",
      "views": 15,
      "viewedByMe": false,
      "expiresAt": "2025-02-22T10:30:00.000Z",
      "createdAt": "2025-02-21T10:30:00.000Z"
    }
  ]
}
```

**Test Cases:**
- ✅ Get all active stories
- ✅ Verify expired stories are not returned
- ❌ Get stories without authentication

---

#### 5.3 Get User Stories (GET)
**Endpoint:** `{{base_url}}/stories/user/6996e768a1296fc08ee8d827`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "stories": [
    {
      "_id": "699story123abc",
      "mediaUrl": "/uploads/users/.../stories/story-1771670287329.jpg",
      "mediaType": "image",
      "caption": "Beautiful sunset today!",
      "views": 15,
      "createdAt": "2025-02-21T10:30:00.000Z"
    }
  ]
}
```

**Test Cases:**
- ✅ Get stories of specific user
- ✅ Get own stories
- ❌ Get stories of non-existent user

---

#### 5.4 View Story (POST)
**Endpoint:** `{{base_url}}/stories/699story123abc/view`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Story view recorded",
  "views": 16
}
```

**Test Cases:**
- ✅ View story (first time)
- ✅ View story again (should not duplicate)
- ❌ View without authentication

---

#### 5.5 Delete Story (DELETE)
**Endpoint:** `{{base_url}}/stories/699story123abc`

**Method:** DELETE

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Story deleted successfully"
}
```

**Test Cases:**
- ✅ Delete own story
- ❌ Delete another user's story (403)
- ❌ Delete without authentication

---

### 📁 COLLECTION 6: Review APIs (Reviewer Only)

#### 6.1 Get Pending Reviews (GET)
**Endpoint:** `{{base_url}}/reviews/pending`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "groupedPosts": [
    {
      "author": {
        "_id": "6996e768a1296fc08ee8d827",
        "user_info": {
          "fullName": "John Doe"
        },
        "profile_info": {
          "avatar": "/uploads/users/.../avatar.jpg"
        },
        "trust_security": {
          "trustScore": 50
        }
      },
      "posts": [
        {
          "_id": "699abc123def456",
          "content": "This is my first post!",
          "media": [],
          "verificationStatus": "pending",
          "createdAt": "2025-02-21T10:30:00.000Z"
        }
      ],
      "totalPosts": 1
    }
  ]
}
```

**Test Cases:**
- ✅ Get pending posts as Reviewer
- ✅ Verify own posts are excluded (anti-cheating)
- ❌ Get pending posts as regular User (403)
- ❌ Get pending posts without authentication

---

#### 6.2 Submit Review (POST)
**Endpoint:** `{{base_url}}/reviews/submit`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON) - Approve:**
```json
{
  "postId": "699abc123def456",
  "verdict": "verified",
  "reason": ""
}
```

**Body (raw JSON) - Reject:**
```json
{
  "postId": "699abc123def456",
  "verdict": "false",
  "reason": "Contains misleading information"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "post": {
    "_id": "699abc123def456",
    "verificationStatus": "approved",
    "isVerified": true,
    "reviewedBy": "699reviewer123",
    "reviewedAt": "2025-02-21T11:00:00.000Z"
  }
}
```

**Test Cases:**
- ✅ Approve post with "verified" verdict
- ✅ Reject post with "false" verdict
- ✅ Reject post with "misleading" verdict
- ❌ Review own post (should fail - anti-cheating)
- ❌ Submit review as regular User (403)
- ❌ Submit review without authentication

---

#### 6.3 Get Reviewer Stats (GET)
**Endpoint:** `{{base_url}}/reviews/stats`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalReviews": 50,
    "approvedToday": 5,
    "rejectedToday": 2,
    "pendingCount": 15,
    "accuracy": 92.5,
    "verityScore": 93
  }
}
```

**Test Cases:**
- ✅ Get stats as Reviewer
- ❌ Get stats as regular User (403)

---

#### 6.4 Get Review History (GET)
**Endpoint:** `{{base_url}}/reviews/history?page=1&limit=20`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Query Parameters:**
```
page: 1 (optional)
limit: 20 (optional)
```

**Expected Response (200):**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "699review123",
      "post": {
        "_id": "699abc123def456",
        "content": "This is my first post!",
        "author": {
          "fullName": "John Doe"
        }
      },
      "verdict": "verified",
      "reason": "",
      "reviewedAt": "2025-02-21T11:00:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

**Test Cases:**
- ✅ Get review history as Reviewer
- ✅ Test pagination
- ❌ Get history as regular User (403)


---

## 🔧 Advanced Testing Scenarios

### Scenario 1: Complete User Journey
1. **Signup** as User → Save token
2. **Login** → Verify token works
3. **Get Profile** → Check default values
4. **Update Profile** → Upload avatar, add bio
5. **Create Post** → Post goes to pending
6. **Get Feed** → Post not visible yet (pending)
7. **Logout** → Clear token

### Scenario 2: Reviewer Workflow
1. **Signup** as Reviewer → Save token
2. **Get Pending Reviews** → See posts to review
3. **Submit Review** (Approve) → Post becomes visible
4. **Get Reviewer Stats** → Check accuracy score
5. **Get Review History** → See past reviews

### Scenario 3: Business Product Flow
1. **Signup** as Business → Save token
2. **Create Product** → Upload product with images
3. **Get All Products** → Verify product appears
4. **Get Business Products** → See own products
5. **View Product Inquiries** → Check customer messages
6. **Update Product** → Change price/stock
7. **Delete Product** → Remove product

### Scenario 4: Shopping Experience
1. **Login** as User
2. **Get All Products** → Browse products
3. **Get Product by ID** → View details (views++)
4. **Like Product** → Add to favorites
5. **Send Inquiry** → Message seller
6. **Unlike Product** → Remove from favorites

### Scenario 5: Stories Feature
1. **Login** as User
2. **Create Story** → Upload image/video
3. **Get All Stories** → See all active stories
4. **View Story** → Increment view count
5. **Get User Stories** → See specific user's stories
6. **Delete Story** → Remove own story

---

## 📊 Testing Checklist

### Authentication Tests
- [ ] Signup with User role
- [ ] Signup with Reviewer role
- [ ] Signup with Business role
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Login with wrong email
- [ ] Login with wrong role
- [ ] Access protected route without token
- [ ] Access protected route with invalid token

### User Profile Tests
- [ ] Get own profile
- [ ] Update profile with text only
- [ ] Update profile with image
- [ ] Update profile with all fields
- [ ] Get profile without authentication

### Post Tests
- [ ] Create post with text only
- [ ] Create post with image
- [ ] Create post with video
- [ ] Create post with multiple images
- [ ] Get feed (public)
- [ ] Get specific post
- [ ] Like post
- [ ] Unlike post
- [ ] Comment on post
- [ ] Delete own post
- [ ] Try to delete another user's post

### Product Tests
- [ ] Create product as Business
- [ ] Try to create product as User (should fail)
- [ ] Get all products (public)
- [ ] Filter products by category
- [ ] Search products by name
- [ ] Get product details
- [ ] Like product
- [ ] Send inquiry
- [ ] Get business products
- [ ] Update own product
- [ ] Delete own product

### Story Tests
- [ ] Create story with image
- [ ] Create story with video
- [ ] Get all active stories
- [ ] Get user stories
- [ ] View story
- [ ] Delete own story
- [ ] Try to delete another user's story

### Review Tests (Reviewer Only)
- [ ] Get pending reviews
- [ ] Approve post
- [ ] Reject post with reason
- [ ] Try to review own post (should fail)
- [ ] Get reviewer stats
- [ ] Get review history
- [ ] Try to review as regular User (should fail)

---

## 🎯 Quick Test Commands (cURL)

### 1. Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "test123",
    "role": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "role": "User"
  }'
```

### 3. Get Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get All Products
```bash
curl -X GET "http://localhost:5000/api/products?category=Electronics&search=iphone"
```

### 5. Get Feed
```bash
curl -X GET "http://localhost:5000/api/posts/feed?page=1&limit=10"
```

---

## 📸 Screenshots for FYP Report

Take screenshots of these Postman tests:

1. **Authentication Collection**
   - Signup request and response
   - Login request and response (showing token)

2. **User Profile Collection**
   - Get profile response
   - Update profile with form-data

3. **Post Collection**
   - Create post with media upload
   - Get feed response showing posts
   - Like post response

4. **Product Collection**
   - Create product with images
   - Get all products with filters
   - Send inquiry response

5. **Story Collection**
   - Create story with media
   - Get stories response

6. **Review Collection**
   - Get pending reviews (grouped by author)
   - Submit review response
   - Reviewer stats response

---

## 🚨 Common Errors and Solutions

### Error 1: 401 Unauthorized
**Cause:** Missing or invalid token
**Solution:** 
- Ensure you're logged in
- Copy token from login response
- Add to Authorization header: `Bearer YOUR_TOKEN`

### Error 2: 403 Forbidden
**Cause:** Insufficient permissions (wrong role)
**Solution:**
- Check if endpoint requires specific role
- Login with correct role (User/Reviewer/Business)

### Error 3: 404 Not Found
**Cause:** Invalid endpoint or resource doesn't exist
**Solution:**
- Check endpoint URL spelling
- Verify resource ID exists in database

### Error 4: 500 Internal Server Error
**Cause:** Server-side error
**Solution:**
- Check backend console for error details
- Verify MongoDB connection
- Check if required fields are provided

### Error 5: Multer Error (File Upload)
**Cause:** File upload configuration issue
**Solution:**
- Use form-data (not JSON) for file uploads
- Check field name matches backend expectation
- Verify file size is within limits

---

## 💡 Pro Tips

1. **Save Environment Variables:**
   - Create Postman environment
   - Save `base_url` and `auth_token`
   - Switch between dev/prod easily

2. **Use Collections:**
   - Organize APIs into folders
   - Run entire collection at once
   - Export/import for team sharing

3. **Pre-request Scripts:**
   ```javascript
   // Auto-set timestamp
   pm.environment.set("timestamp", new Date().toISOString());
   ```

4. **Tests Tab:**
   ```javascript
   // Auto-save token after login
   pm.test("Save token", function() {
     var jsonData = pm.response.json();
     pm.environment.set("auth_token", jsonData.token);
   });
   ```

5. **Use Variables:**
   - `{{base_url}}` instead of hardcoded URL
   - `{{auth_token}}` for authentication
   - `{{user_id}}` for dynamic IDs

---

## 📦 Import Ready Postman Collection

Save this as `Verity_API_Collection.json` and import into Postman:

```json
{
  "info": {
    "name": "Verity FYP API Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"User\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/signup",
              "host": ["{{base_url}}"],
              "path": ["auth", "signup"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"User\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## ✅ Final Checklist

Before submitting your FYP:
- [ ] Test all API endpoints in Postman
- [ ] Take screenshots of successful requests
- [ ] Take screenshots of error cases
- [ ] Document all API endpoints in report
- [ ] Include request/response examples
- [ ] Show authentication flow
- [ ] Demonstrate role-based access control
- [ ] Show file upload functionality
- [ ] Include pagination examples
- [ ] Document error handling

---

**Happy Testing! 🚀**
