# Review System - Anti-Cheating & Grouped Posts

## Overview
The review system has been updated to prevent conflicts of interest and organize posts efficiently for reviewers.

---

## Key Features

### 1. **Self-Review Prevention**
Reviewers cannot review their own posts to prevent cheating and maintain integrity.

**How it works:**
- When a reviewer creates a post, it goes to the pending queue
- When that reviewer opens the Review Center, their own posts are automatically excluded
- If a reviewer somehow tries to review their own post, the API returns an error:
  ```
  "You cannot review your own posts. This post will be assigned to another reviewer."
  ```

**Example Scenario:**
```
User: Ishaa (Role: Reviewer)
- Ishaa creates a post → Status: Pending
- Ishaa opens Review Center → Her post is NOT shown
- Another reviewer (e.g., Ali) sees Ishaa's post and can review it
```

---

### 2. **Grouped Posts by Author**
Posts are grouped by author in the backend API for better organization.

**API Response Structure:**
```json
{
  "success": true,
  "groupedPosts": [
    {
      "author": {
        "_id": "6996e768a1296fc08ee8d827",
        "fullName": "Taimoor",
        "email": "taimoor@gmail.com",
        "avatar": "/uploads/users/6996e768a1296fc08ee8d827/profile/avatar-xxx.jpg",
        "role": "User"
      },
      "posts": [
        {
          "_id": "post1_id",
          "content": "First post content",
          "mediaUrls": ["url1"],
          "hashtags": ["#news"],
          "createdAt": "2026-02-21T10:00:00Z",
          "verificationStatus": "pending"
        },
        {
          "_id": "post2_id",
          "content": "Second post content",
          "mediaUrls": ["url2"],
          "hashtags": ["#tech"],
          "createdAt": "2026-02-21T11:00:00Z",
          "verificationStatus": "pending"
        }
      ],
      "totalPosts": 2
    },
    {
      "author": {
        "_id": "another_user_id",
        "fullName": "Ali",
        "email": "ali@gmail.com",
        "avatar": null,
        "role": "User"
      },
      "posts": [
        {
          "_id": "post3_id",
          "content": "Ali's post",
          "mediaUrls": [],
          "hashtags": [],
          "createdAt": "2026-02-21T12:00:00Z",
          "verificationStatus": "pending"
        }
      ],
      "totalPosts": 1
    }
  ],
  "totalAuthors": 2,
  "totalPosts": 3
}
```

**Benefits:**
- Reviewers can see all posts from one author at once
- Easier to identify patterns or spam from specific users
- Authors with more pending posts are prioritized (sorted by totalPosts)
- Better context for reviewing related content

---

### 3. **Priority Sorting**
Authors are sorted by the number of pending posts (descending).

**Logic:**
```javascript
// Authors with more pending posts appear first
groupedArray.sort((a, b) => b.totalPosts - a.totalPosts)
```

**Example:**
```
1. Taimoor - 5 pending posts (shown first)
2. Ali - 3 pending posts
3. Sara - 1 pending post (shown last)
```

---

## API Endpoints

### GET `/api/reviews/pending`
**Description:** Get all pending posts grouped by author (excludes reviewer's own posts)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "groupedPosts": [...],
  "totalAuthors": 5,
  "totalPosts": 12
}
```

**Query Logic:**
```javascript
Post.find({ 
  verificationStatus: 'pending',
  author: { $ne: reviewerId } // Exclude reviewer's posts
})
```

---

### POST `/api/reviews/submit`
**Description:** Submit a review for a post

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "postId": "post_id_here",
  "verdict": "verified",
  "notes": "Fact-checked and verified",
  "confidence": 95,
  "sources": ["https://source1.com", "https://source2.com"],
  "tags": ["politics", "verified"]
}
```

**Anti-Cheating Check:**
```javascript
// Check if reviewer is trying to review their own post
if (post.author._id.toString() === reviewerId) {
  return res.status(403).json({ 
    success: false, 
    message: 'You cannot review your own posts.' 
  })
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Post approved successfully",
  "review": {...}
}
```

**Response (Self-Review Attempt):**
```json
{
  "success": false,
  "message": "You cannot review your own posts. This post will be assigned to another reviewer."
}
```

---

### GET `/api/reviews/stats`
**Description:** Get reviewer statistics

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalReviews": 45,
    "approvedReviews": 38,
    "rejectedReviews": 7,
    "pendingReviews": 12,
    "accuracy": 84
  }
}
```

**Note:** `pendingReviews` excludes the reviewer's own posts.

---

## Database Schema Updates

### Post Model
```javascript
{
  author: ObjectId, // Reference to User/Reviewer/Business
  content: String,
  mediaUrls: [String],
  verificationStatus: 'pending' | 'approved' | 'rejected',
  isVerified: Boolean,
  reviewedBy: ObjectId, // Reference to Reviewer
  reviewedAt: Date, // NEW: Timestamp when reviewed
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Integration

### Review Center Component
The frontend should display grouped posts:

```jsx
{groupedPosts.map((group) => (
  <AuthorGroup key={group.author._id}>
    <AuthorHeader>
      <Avatar src={group.author.avatar} />
      <AuthorName>{group.author.fullName}</AuthorName>
      <PostCount>{group.totalPosts} pending posts</PostCount>
    </AuthorHeader>
    
    {group.posts.map((post) => (
      <PostCard key={post._id}>
        <PostContent>{post.content}</PostContent>
        <ReviewButton onClick={() => reviewPost(post._id)}>
          Review
        </ReviewButton>
      </PostCard>
    ))}
  </AuthorGroup>
))}
```

---

## Security & Integrity

### Conflict of Interest Prevention
✅ Reviewers cannot see their own posts in the review queue
✅ API blocks self-review attempts with 403 error
✅ Posts are automatically assigned to other reviewers

### Fair Distribution
✅ All reviewers see the same pending posts (except their own)
✅ No reviewer gets preferential treatment
✅ Posts are distributed based on availability, not assignment

### Audit Trail
✅ `reviewedBy` field tracks which reviewer approved/rejected
✅ `reviewedAt` timestamp records when the review happened
✅ Review history is maintained in the Review collection

---

## Example Workflow

### Scenario: Ishaa (Reviewer) creates a post

1. **Post Creation:**
   ```
   POST /api/posts
   Author: Ishaa (Reviewer)
   Status: pending
   ```

2. **Ishaa Opens Review Center:**
   ```
   GET /api/reviews/pending
   Response: All pending posts EXCEPT Ishaa's post
   ```

3. **Ali (Another Reviewer) Opens Review Center:**
   ```
   GET /api/reviews/pending
   Response: All pending posts INCLUDING Ishaa's post
   ```

4. **Ali Reviews Ishaa's Post:**
   ```
   POST /api/reviews/submit
   {
     "postId": "ishaa_post_id",
     "verdict": "verified"
   }
   Response: Success ✅
   ```

5. **Ishaa Tries to Review Her Own Post (Hypothetically):**
   ```
   POST /api/reviews/submit
   {
     "postId": "ishaa_post_id",
     "verdict": "verified"
   }
   Response: 403 Error ❌
   "You cannot review your own posts."
   ```

---

## Benefits

1. **Integrity:** No self-reviewing = No cheating
2. **Organization:** Grouped posts = Better context
3. **Efficiency:** Priority sorting = Important posts first
4. **Transparency:** Audit trail = Accountability
5. **Fairness:** Equal distribution = No bias

---

## Testing Checklist

- [ ] Create post as Reviewer → Post goes to pending
- [ ] Open Review Center as same Reviewer → Own post not shown
- [ ] Open Review Center as different Reviewer → Post is shown
- [ ] Try to review own post via API → 403 error
- [ ] Review another user's post → Success
- [ ] Check grouped posts → Posts grouped by author
- [ ] Check priority sorting → Authors with more posts first
- [ ] Check stats → Pending count excludes own posts

---

## Future Enhancements

1. **Load Balancing:** Assign posts to reviewers with fewer pending reviews
2. **Specialization:** Match posts to reviewers based on expertise
3. **Quality Score:** Track reviewer accuracy and prioritize high-quality reviewers
4. **Appeal System:** Allow users to appeal rejected posts
5. **Multi-Reviewer:** Require 2+ reviewers for controversial posts
