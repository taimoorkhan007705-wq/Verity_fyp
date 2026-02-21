# Verity Project - Algorithms Documentation

## Algorithm 1: Content Verification Workflow

**Purpose:** Ensure all posts go through review before appearing in feed

**Input:** User post submission (content, media, hashtags)

**Output:** Post status (pending/approved/rejected)

**Pseudocode:**
```
Algorithm: ContentVerificationWorkflow
Input: post (content, media, author, hashtags)
Output: verificationStatus

1. BEGIN
2.   IF user is authenticated THEN
3.     CREATE post with status = "pending"
4.     SAVE post to database
5.     ASSIGN post to reviewer queue
6.     
7.     WAIT for reviewer action
8.     
9.     IF reviewer verdict = "verified" THEN
10.      SET post.verificationStatus = "approved"
11.      SET post.isVerified = true
12.      ADD post to public feed
13.    ELSE IF reviewer verdict = "false" OR "misleading" THEN
14.      SET post.verificationStatus = "rejected"
15.      SEND notification to author
16.    END IF
17.    
18.    UPDATE post in database
19.  ELSE
20.    RETURN "Authentication required"
21.  END IF
22. END
```

**Time Complexity:** O(1) for post creation, O(n) for reviewer queue processing

---

## Algorithm 2: Anti-Cheating in Review System

**Purpose:** Prevent reviewers from reviewing their own posts

**Input:** Reviewer ID, Post ID

**Output:** Boolean (canReview)

**Pseudocode:**
```
Algorithm: AntiCheatingCheck
Input: reviewerId, postId
Output: Boolean canReview

1. BEGIN
2.   FETCH post from database WHERE post._id = postId
3.   
4.   IF post.author = reviewerId THEN
5.     RETURN false  // Reviewer cannot review own post
6.   ELSE
7.     RETURN true   // Reviewer can review this post
8.   END IF
9. END
```

**Time Complexity:** O(1) - Single database lookup

---

## Algorithm 3: Trust Score Calculation

**Purpose:** Calculate user trust score based on activity

**Input:** User activity data (posts, reviews, reports)

**Output:** Trust score (0-100)

**Pseudocode:**
```
Algorithm: CalculateTrustScore
Input: user (postsCount, reviewsCompleted, accuracy, reportsReceived)
Output: trustScore (0-100)

1. BEGIN
2.   baseScore = 50  // Starting score
3.   
4.   // Positive factors
5.   IF user.role = "Reviewer" THEN
6.     accuracyBonus = user.accuracy * 0.3
7.     reviewBonus = MIN(user.reviewsCompleted * 0.5, 20)
8.     baseScore = baseScore + accuracyBonus + reviewBonus
9.   END IF
10.  
11.  IF user.postsCount > 0 THEN
12.    postBonus = MIN(user.postsCount * 0.2, 10)
13.    baseScore = baseScore + postBonus
14.  END IF
15.  
16.  // Negative factors
17.  IF user.reportsReceived > 0 THEN
18.    reportPenalty = user.reportsReceived * 5
19.    baseScore = baseScore - reportPenalty
20.  END IF
21.  
22.  // Ensure score is within bounds
23.  trustScore = MAX(0, MIN(baseScore, 100))
24.  
25.  RETURN trustScore
26. END
```

**Time Complexity:** O(1) - Simple arithmetic operations

---

## Algorithm 4: Story Expiration Management

**Purpose:** Automatically expire stories after 24 hours

**Input:** Story creation timestamp

**Output:** Boolean (isExpired)

**Pseudocode:**
```
Algorithm: StoryExpirationCheck
Input: story (createdAt, expiresAt)
Output: Boolean isExpired

1. BEGIN
2.   currentTime = getCurrentTimestamp()
3.   
4.   IF currentTime > story.expiresAt THEN
5.     RETURN true  // Story has expired
6.   ELSE
7.     RETURN false // Story is still active
8.   END IF
9. END

Algorithm: AutoDeleteExpiredStories
Input: None
Output: Number of deleted stories

1. BEGIN
2.   currentTime = getCurrentTimestamp()
3.   deletedCount = 0
4.   
5.   FETCH allStories WHERE expiresAt < currentTime
6.   
7.   FOR EACH story IN allStories DO
8.     DELETE story from database
9.     DELETE story.mediaFile from storage
10.    deletedCount = deletedCount + 1
11.  END FOR
12.  
13.  RETURN deletedCount
14. END
```

**Time Complexity:** O(n) where n = number of expired stories

---

## Algorithm 5: Product Search and Filter

**Purpose:** Search and filter products by category and keywords

**Input:** Search query, category filter

**Output:** Filtered product list

**Pseudocode:**
```
Algorithm: ProductSearchAndFilter
Input: searchQuery, categoryFilter, page, limit
Output: products[], totalCount

1. BEGIN
2.   query = {}
3.   query.isActive = true  // Only show active products
4.   
5.   // Apply category filter
6.   IF categoryFilter ≠ "All" THEN
7.     query.category = categoryFilter
8.   END IF
9.   
10.  // Apply search query
11.  IF searchQuery is not empty THEN
12.    query.$or = [
13.      {name: REGEX(searchQuery, case-insensitive)},
14.      {description: REGEX(searchQuery, case-insensitive)},
15.      {tags: CONTAINS(searchQuery)}
16.    ]
17.  END IF
18.  
19.  // Pagination
20.  skip = (page - 1) * limit
21.  
22.  // Execute query
23.  products = DATABASE.find(query)
24.                      .sort({createdAt: -1})
25.                      .skip(skip)
26.                      .limit(limit)
27.  
28.  totalCount = DATABASE.count(query)
29.  
30.  RETURN products, totalCount
31. END
```

**Time Complexity:** O(log n) with database indexing

---

## Algorithm 6: Profile Completion Check

**Purpose:** Ensure users complete profile before accessing features

**Input:** User object

**Output:** Boolean (isComplete)

**Pseudocode:**
```
Algorithm: ProfileCompletionCheck
Input: user (fullName, avatar)
Output: Boolean isComplete

1. BEGIN
2.   requiredFields = ["fullName", "avatar"]
3.   
4.   FOR EACH field IN requiredFields DO
5.     IF user[field] is null OR user[field] is empty THEN
6.       RETURN false  // Profile incomplete
7.     END IF
8.   END FOR
9.   
10.  RETURN true  // Profile complete
11. END
```

**Time Complexity:** O(1) - Fixed number of fields to check

---

## Algorithm 7: Grouped Review System

**Purpose:** Group pending posts by author for efficient review

**Input:** Reviewer ID

**Output:** Grouped posts by author

**Pseudocode:**
```
Algorithm: GroupPostsByAuthor
Input: reviewerId
Output: groupedPosts[]

1. BEGIN
2.   // Fetch pending posts excluding reviewer's own posts
3.   posts = DATABASE.find({
4.     verificationStatus: "pending",
5.     author: NOT_EQUAL(reviewerId)
6.   })
7.   
8.   groupedPosts = {}
9.   
10.  FOR EACH post IN posts DO
11.    authorId = post.author._id
12.    
13.    IF groupedPosts[authorId] does not exist THEN
14.      groupedPosts[authorId] = {
15.        author: post.author,
16.        posts: [],
17.        totalPosts: 0
18.      }
19.    END IF
20.    
21.    ADD post to groupedPosts[authorId].posts
22.    INCREMENT groupedPosts[authorId].totalPosts
23.  END FOR
24.  
25.  // Convert to array and sort by total posts
26.  result = CONVERT groupedPosts to array
27.  SORT result BY totalPosts DESCENDING
28.  
29.  RETURN result
30. END
```

**Time Complexity:** O(n log n) where n = number of posts

---

## Summary Table

| Algorithm | Purpose | Time Complexity | Space Complexity |
|-----------|---------|----------------|------------------|
| Content Verification | Post review workflow | O(1) | O(1) |
| Anti-Cheating Check | Prevent self-review | O(1) | O(1) |
| Trust Score Calculation | User reputation | O(1) | O(1) |
| Story Expiration | Auto-delete old stories | O(n) | O(1) |
| Product Search | Filter products | O(log n) | O(n) |
| Profile Completion | Validate user data | O(1) | O(1) |
| Grouped Review | Organize pending posts | O(n log n) | O(n) |

