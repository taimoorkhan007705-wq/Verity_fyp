# Rejected Posts Feature Implementation

## Overview
Users can now view all their rejected posts in one dedicated section, with complete information about why each post was rejected and when it was rejected. This includes both AI-rejected posts and reviewer-rejected posts.

## What's New

### 1. **Backend Endpoint** (`/api/posts/my/rejected`)
- **Location**: `backend/modules/post/post.controller.js`
- **Method**: GET
- **Authentication**: Required (Bearer token)
- **Response**:
  ```json
  {
    "success": true,
    "posts": [
      {
        "_id": "post_id",
        "content": "post content",
        "media": [...],
        "category": "News",
        "verificationStatus": "ai_rejected",
        "aiRejectionReason": "Post contains AI-generated content",
        "reviewNotes": "Rejected by reviewer - [reason if applicable]",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```

**Features**:
- ✅ Fetches posts with `verificationStatus`: `'ai_rejected'` or `'rejected'`
- ✅ Retrieves AI rejection reasons from `aiRejectionReason` field
- ✅ Fetches reviewer rejection notes from `reviewNotes` field
- ✅ Includes media, content, category, and timestamps
- ✅ Returns only current user's posts
- ✅ Sorted by most recent first

### 2. **Frontend Component** (`RejectedPosts.jsx`)
- **Location**: `Verity_FYP/src/modules/feed/RejectedPosts.jsx`
- **Route**: `/rejected-posts`
- **Accessibility**: All user roles except Admin

**Features**:
- ✅ Back button to return to previous page
- ✅ Empty state when no rejected posts
- ✅ Displays each rejected post with:
  - Post creation date and time (formatted: `Jan 15, 2024 10:30 AM`)
  - Post category (if applicable)
  - Rejection status badge (AI Rejected / Rejected)
  - Full post content (text with line breaks preserved)
  - Media (images/videos in grid layout)
  - Rejection reason in highlighted red alert box
- ✅ Responsive design:
  - Desktop: Multi-column grid for media
  - Mobile: Single column layout
  - Proper padding and spacing
- ✅ Loading state while fetching posts
- ✅ Styled alert box with rejection reason and "Why was this rejected?" title

### 3. **Frontend Navigation**
- **Location**: `Verity_FYP/src/modules/feed/Feed.jsx`
- **Placement**: Top of feed, before "Create Post" section
- **Visibility**: Shows only for non-admin users
- **Button Style**:
  - Red/pink background (`#fef2f2` with darker hover state `#fee2e2`)
  - Red border (`#fecaca`)
  - AlertCircle icon with "View Rejected Posts" text
  - Arrow indicator (`→`)
  - Clickable with hover effects

### 4. **Routes Added**
- **Admin Route**: `GET /admin` → `<RejectedPosts />`
- **User Route**: `GET /rejected-posts` → `<RejectedPosts />`
- **Reviewer Route**: Not included (reviewers see rejections for their reviews, not their posts)

## Database Schema Used

### Post Model Fields (Already Existing)
```javascript
{
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'ai_rejected', 'awaiting_review'],
    default: 'pending'
  },
  aiRejectionReason: {
    type: String,
    default: ''
  },
  reviewNotes: String,
  createdAt: Date
}
```

## How Rejection Reasons are Set

### 1. **AI Rejection** (Automatic)
When AI detection flags content as fake or offensive:
```javascript
post.verificationStatus = 'ai_rejected'
post.aiRejectionReason = fakeDetectionResult.reason
// Examples:
// - "Post contains AI-generated content"
// - "Post contains explicit or offensive content"
// - "Post appears to contain misleading information"
```

### 2. **Reviewer Rejection** (Manual)
When reviewers vote to reject:
```javascript
post.verificationStatus = 'rejected'
post.reviewNotes = "Post does not meet community guidelines"
```

## User Flow

1. User posts content with media
2. If content is flagged as fake/suspicious:
   - AI automatically rejects (immediate notification)
   - `aiRejectionReason` is set with specific reason
   - User receives notification: "❌ Post Rejected by AI"
3. User clicks "View Rejected Posts" button on feed
4. User sees full list of rejected posts with:
   - Why it was rejected
   - When it was rejected
   - Full post content and media for context
5. User can review and modify content to resubmit

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/posts/my/rejected` | ✅ Required | Get user's rejected posts |
| GET | `/api/posts/my/pending` | ✅ Required | Get user's pending posts (existing) |
| GET | `/api/posts/feed` | ❌ Optional | Get approved public feed (existing) |

## Testing

### Test Case 1: View Empty Rejected Posts
1. Login as new user with no rejected posts
2. Navigate to `/rejected-posts`
3. Should see empty state message

### Test Case 2: View Rejected Posts with Reasons
1. Admin posts AI-generated image
2. System rejects with "AI-generated content detected"
3. User navigates to `/rejected-posts`
4. Should see post with rejection reason highlighted

### Test Case 3: Navigation
1. User on feed page
2. Click "View Rejected Posts" button
3. Should navigate to `/rejected-posts`
4. Click back button
5. Should return to feed

## Files Modified

- ✅ `backend/modules/post/post.controller.js` - Updated `getMyRejectedPosts()` to include AI rejection reasons
- ✅ `Verity_FYP/src/modules/feed/RejectedPosts.jsx` - NEW: Complete component with styling
- ✅ `Verity_FYP/src/modules/feed/Feed.jsx` - Added "View Rejected Posts" button and import
- ✅ `Verity_FYP/src/App.jsx` - Added route for `/rejected-posts`

## Next Steps / Future Enhancements

1. **Appeal System**: Allow users to appeal rejections
2. **Batch Resubmit**: Users can modify and resubmit multiple posts at once
3. **Rejection Statistics**: Show trends in rejection reasons
4. **AI Explanation**: Provide more detailed AI reasoning for rejections
5. **Guide/Help**: Link to community guidelines when posts are rejected

## Deployment Notes

- ✅ Backend endpoint uses existing `Post.js` schema
- ✅ Frontend component uses existing API configuration
- ✅ No database migrations needed
- ✅ No new environment variables needed
- ✅ Build size: 902.70 kB JS, 229.86 kB gzipped
- ✅ Compatible with all user roles (except Admin doesn't create user posts)
