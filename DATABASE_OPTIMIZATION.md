# Database Optimization - Performance Fix

## Root Cause of Slow Performance

**Server Response Time (TTFB) was 12+ seconds** because:
1. ❌ No database indexes on frequently queried fields
2. ❌ Inefficient queries fetching all fields
3. ❌ N+1 query problem (fetching comments one by one)
4. ❌ No query hints or lean() optimization

---

## Solutions Applied

### 1. **Added Database Indexes**

#### Post Model Indexes
```javascript
postSchema.index({ verificationStatus: 1, createdAt: -1 })
postSchema.index({ author: 1, verificationStatus: 1 })
postSchema.index({ isDeleted: 1, verificationStatus: 1 })
postSchema.index({ visibility: 1, verificationStatus: 1 })
postSchema.index({ category: 1, createdAt: -1 })
postSchema.index({ createdAt: -1 })
```

**Why**: Posts are queried by:
- Verification status (approved, rejected, etc.)
- Author ID
- Visibility (public posts)
- Category filters
- Creation date (for sorting)

#### Reviewer Model Indexes
```javascript
reviewerSchema.index({ email: 1 })
reviewerSchema.index({ 'trust_security.trustScore': -1, 'reviewer_stats.reviewsCompleted': -1 })
reviewerSchema.index({ 'trust_security.isActive': 1 })
reviewerSchema.index({ createdAt: -1 })
```

#### User Model Indexes
```javascript
userSchema.index({ email: 1 })
userSchema.index({ isBlocked: 1 })
userSchema.index({ createdAt: -1 })
```

### 2. **Optimized Feed Endpoint**

**Before**:
```javascript
const posts = await Post.find(query)
  .populate('author', '...')
// Fetches ALL fields, then populates comments one-by-one
```

**After**:
```javascript
const posts = await Post.find(query)
  .select('author authorModel content media category likesCount...')
  .populate('author', '...')
  .lean() // Use lean() - returns plain JS objects, not Mongoose docs
  .hint({ verificationStatus: 1, createdAt: -1 }) // Force index usage
```

**Improvements**:
- ✅ `.select()` - Only fetch needed fields, reduces payload
- ✅ `.lean()` - Returns plain objects (3-5x faster than Mongoose docs)
- ✅ `.hint()` - Forces MongoDB to use specific index
- ✅ Removed N+1 comment population (not needed for feed)

### 3. **Index Strategy**

**Compound indexes** (best for common queries):
- `{ verificationStatus: 1, createdAt: -1 }` - For feed queries
- `{ trustScore: -1, reviewsCompleted: -1 }` - For leaderboard

**Single field indexes**:
- `email` - For login/lookups
- `isBlocked` - For user filtering
- `isActive` - For active reviewer filtering

---

## Expected Performance Improvements

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| TTFB | 12+ s | 2-3 s | < 600ms |
| LCP | 38.4 s | 8-10 s | < 2.5s |
| FCP | 12.0 s | 3-4 s | < 1.8s |
| Query Time | 10+ s | 100-200 ms | < 100ms |
| Performance Score | 5 | 15-20 | 50+ |

---

## How Indexes Work

```
Without Index:
Query → Scan ALL 1000s of posts → Filter by status → Sort → Return

With Index:
Query → Direct lookup using index → Return sorted results instantly
```

**Example**: Finding 10 approved posts
- Without index: 5000+ ms (scan all posts)
- With index: 50-100 ms (direct index lookup)

---

## What MongoDB Does Automatically

✅ Indexes are created on first connection  
✅ MongoDB maintains indexes as data changes  
✅ Queries use indexes automatically when beneficial  
✅ No additional code needed after schema definition

---

## Files Modified

- `backend/models/Post.js` - Added 6 indexes
- `backend/models/Reviewer.js` - Added 4 indexes
- `backend/models/User.js` - Added 3 indexes
- `backend/modules/post/post.controller.js` - Optimized getFeed query

---

## Testing Performance

After restart, run Lighthouse again:
```bash
lighthouse http://localhost:5173 --view
```

**Expected improvement**: 5 → 20-30+

---

## Why Still Below 50?

Remaining factors outside database control:
1. **Network latency** - ngrok has some overhead
2. **React bundle size** - 411 KB still large
3. **Initial render** - React needs time to hydrate DOM
4. **Image rendering** - Images still need to load/render

These would require:
- Moving to production CDN
- Further code splitting
- Service Worker caching
- Image optimization (WebP, blur-up)

---

**Status**: ✅ Deployed  
**Date**: July 28, 2026
