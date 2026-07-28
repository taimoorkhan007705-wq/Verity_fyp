# Trust Score System Fix - Documentation

## Problem Fixed

**Issue**: All reviewers were showing 50% trust score in the leaderboard.

**Root Cause**: 
- Trust score was hardcoded to default value of 50 in Reviewer model
- Trust score was not being calculated based on authentic data (posts approved that were actually posted to feed)
- No endpoint to view leaderboard with real trust scores

---

## Solution Implemented

### 1. **Changed Default Trust Score** ✅
**File**: `backend/models/Reviewer.js`

- Changed default trust score from `50` to `0`
- Added `trustScoreCalculatedAt` timestamp to track when score was last updated

```javascript
trustScore: {
  type: Number,
  default: 0,  // Changed from 50
  min: 0,
  max: 100
},
trustScoreCalculatedAt: {
  type: Date,
  default: Date.now
}
```

### 2. **Created Authentic Trust Score Calculation** ✅
**File**: `backend/services/reviewerAssignment.js`

Added three new functions:

#### **a) `calculateReviewerTrustScore(reviewerId)`**
Calculates trust score based on approved posts on feed:

```
Trust Score Formula: (ApprovedPostsOnFeed / TotalReviewsCompleted) * 100
```

- Finds all posts approved by the reviewer
- Counts only posts that are on the feed (verificationStatus='approved' && !isDeleted)
- Divides by total reviews completed
- Returns percentage (0-100)

Example:
- Reviewer completed 10 reviews
- 8 of their approved posts made it to the feed
- Trust Score = (8/10) * 100 = **80%**

#### **b) `updateReviewerTrustScore(reviewerId)`**
Updates the reviewer's database record with calculated trust score:
- Calls `calculateReviewerTrustScore()`
- Saves score to database
- Updates `trustScoreCalculatedAt` timestamp

#### **c) `recalculateAllReviewerTrustScores()`**
Admin function to recalculate all reviewers' trust scores:
- Runs through all active reviewers
- Recalculates each one's score
- Updates those with changed scores
- Returns summary of updates

### 3. **Updated Review Processing** ✅
**File**: `backend/services/reviewerAssignment.js`

Modified `processReviewerVote()` to call trust score update:

```javascript
// After a post is approved or rejected
for (const voteEntry of post.reviewerVotes) {
  // Update reviewer stats
  await Reviewer.findByIdAndUpdate(voteEntry.reviewer, {
    $inc: { 'reviewer_stats.reviewsCompleted': 1 }
  })
  
  // RECALCULATE AUTHENTIC TRUST SCORE
  await updateReviewerTrustScore(voteEntry.reviewer)
}
```

### 4. **Added Leaderboard Endpoint** ✅
**File**: `backend/modules/reviewer/reviewer.controller.js`

New function: `getReviewerLeaderboard()`

- Public endpoint (no auth required)
- Returns all active reviewers sorted by trust score (descending)
- Includes rank, name, avatar, trust score, and review count
- Limited to top 100 reviewers

```
GET /api/reviewer/leaderboard

Response:
{
  success: true,
  leaderboard: [
    {
      rank: 1,
      name: "John Reviewer",
      avatar: "...",
      trustScore: 95,
      reviewsCompleted: 20,
      approvedCount: 19
    },
    ...
  ]
}
```

### 5. **Added Admin Recalculation Endpoint** ✅
**File**: `backend/modules/reviewer/reviewer.controller.js`

New function: `recalculateTrustScores()`

- Admin-only endpoint
- Recalculates all reviewers' trust scores
- Useful for fixing corrupted data

```
POST /api/reviewer/admin/recalculate-trust-scores

Response:
{
  success: true,
  totalReviewers: 15,
  updated: 8,
  message: "Trust scores recalculated for 8 reviewers"
}
```

### 6. **Updated Routes** ✅
**File**: `backend/modules/reviewer/reviewer.routes.js`

Added:
- `GET /reviewer/leaderboard` - Public leaderboard
- `POST /reviewer/admin/recalculate-trust-scores` - Admin recalculation

---

## How Trust Score Now Works

### **Real-Time Updates**:
1. Reviewer votes on a post
2. Votes reach 2 (majority)
3. Post is approved/rejected
4. `updateReviewerTrustScore()` is called
5. Trust score is recalculated based on ACTUAL posts on feed
6. Score is saved to database

### **Trust Score Calculation Example**:

**Scenario**: 3 reviewers approve a post

Post goes live → Feed shows the post

**Each reviewer's trust score recalculates**:
- Reviewer A: 5 reviews completed, 4 posts on feed → 80% trust
- Reviewer B: 10 reviews completed, 7 posts on feed → 70% trust  
- Reviewer C: 20 reviews completed, 18 posts on feed → 90% trust

**Leaderboard would show** (sorted by trust score):
1. Reviewer C: 90% (20 reviews)
2. Reviewer A: 80% (5 reviews)
3. Reviewer B: 70% (10 reviews)

---

## API Endpoints

### Get Leaderboard (Public)
```bash
GET /api/reviewer/leaderboard
```

### Recalculate All Scores (Admin Only)
```bash
POST /api/reviewer/admin/recalculate-trust-scores
Authorization: Bearer <admin_token>
```

---

## Testing the Fix

### 1. **Check Leaderboard**:
```bash
curl http://localhost:5000/api/reviewer/leaderboard
```

Should see reviewers with authentic trust scores (not all 50%)

### 2. **Trigger Recalculation** (Admin):
```bash
curl -X POST http://localhost:5000/api/reviewer/admin/recalculate-trust-scores \
  -H "Authorization: Bearer <admin_token>"
```

Should see how many reviewers were updated

### 3. **In Frontend Leaderboard**:
- Reviewers now ranked by REAL trust scores
- Based on posts they approved that are on the feed
- Higher trust = more accurate reviewer

---

## Key Improvements

✅ **Authentic Calculation**: Based on real posts on feed, not hardcoded values
✅ **Real-Time Updates**: Trust scores update after each vote
✅ **Transparent Metric**: Clear formula: Approved Posts / Total Reviews
✅ **Fair Ranking**: Rewards accurate reviews that post to feed
✅ **Admin Control**: Can recalculate if data gets corrupted
✅ **No More 50%**: Trust scores start at 0 and earn based on performance

---

## Files Modified

1. `backend/models/Reviewer.js` - Changed default trust score to 0
2. `backend/services/reviewerAssignment.js` - Added trust score functions
3. `backend/modules/reviewer/reviewer.controller.js` - Added leaderboard endpoints
4. `backend/modules/reviewer/reviewer.routes.js` - Added new routes

---

## Database Impact

- No migration needed
- Existing reviewers will have trust score recalculated on next review
- Or use admin endpoint to recalculate all at once

---

Created: July 28, 2026
