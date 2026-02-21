# Chapter 5: Implementation

## 5.1 Introduction

This chapter will discuss implementation details of the project. You will not put your source code here, however, are required to write the core modules functionalities in pseudocode form (Following sections are required in this chapter).

Note: You are required to flow proper coding standard to write your source code. For guidelines, General Coding Standards & Guidelines are provided in Appendix D.

---

## 5.2 Algorithm

Mention the algorithm(s) used in your project to get the work done with regards to major modules. Provide a pseudocode explanation regarding the functioning of the core features. Be sure to use the correct syntax and semantics for algorithm representations. Following are few examples of algorithms pseudocodes:

### Table 5.1: Example of Algorithms

#### Algorithm 1: Content Verification Workflow
**Input:** User post submission (content, media, hashtags)  
**Output:** Post verification status (pending/approved/rejected)

```
1.  BEGIN
2.    IF user is authenticated THEN
3.      CREATE post with status = "pending"
4.      SAVE post to database
5.      ASSIGN post to reviewer queue
6.      
7.      WAIT for reviewer action
8.      
9.      IF reviewer verdict = "verified" THEN
10.       SET post.verificationStatus = "approved"
11.       SET post.isVerified = true
12.       ADD post to public feed
13.     ELSE IF reviewer verdict = "false" OR "misleading" THEN
14.       SET post.verificationStatus = "rejected"
15.       SEND notification to author
16.     END IF
17.     
18.     UPDATE post in database
19.   ELSE
20.     RETURN "Authentication required"
21.   END IF
22. END
```

---

#### Algorithm 2: Anti-Cheating Check (Prevent Self-Review)
**Input:** Reviewer ID (reviewerId), Post ID (postId)  
**Output:** Boolean value (canReview)

```
1.  BEGIN
2.    FETCH post from database WHERE post._id = postId
3.    
4.    IF post.author = reviewerId THEN
5.      RETURN false  // Reviewer cannot review own post
6.    ELSE
7.      RETURN true   // Reviewer can review this post
8.    END IF
9.  END
```

---

#### Algorithm 3: Trust Score Calculation
**Input:** User activity data (postsCount, reviewsCompleted, accuracy, reportsReceived)  
**Output:** Trust score value (0-100)

```
1.  BEGIN
2.    baseScore ← 50  // Starting score
3.    
4.    // Positive factors
5.    IF user.role = "Reviewer" THEN
6.      accuracyBonus ← user.accuracy × 0.3
7.      reviewBonus ← MIN(user.reviewsCompleted × 0.5, 20)
8.      baseScore ← baseScore + accuracyBonus + reviewBonus
9.    END IF
10.   
11.   IF user.postsCount > 0 THEN
12.     postBonus ← MIN(user.postsCount × 0.2, 10)
13.     baseScore ← baseScore + postBonus
14.   END IF
15.   
16.   // Negative factors
17.   IF user.reportsReceived > 0 THEN
18.     reportPenalty ← user.reportsReceived × 5
19.     baseScore ← baseScore - reportPenalty
20.   END IF
21.   
22.   // Ensure score is within bounds
23.   trustScore ← MAX(0, MIN(baseScore, 100))
24.   
25.   RETURN trustScore
26. END
```

---

#### Algorithm 4: Story Expiration Management (24-Hour Auto-Delete)
**Input:** Story creation timestamp (createdAt, expiresAt)  
**Output:** Boolean value (isExpired)

```
1.  BEGIN
2.    currentTime ← getCurrentTimestamp()
3.    
4.    IF currentTime > story.expiresAt THEN
5.      RETURN true  // Story has expired
6.    ELSE
7.      RETURN false // Story is still active
8.    END IF
9.  END

Algorithm 4.1: Auto-Delete Expired Stories
Input: None
Output: Number of deleted stories

1.  BEGIN
2.    currentTime ← getCurrentTimestamp()
3.    deletedCount ← 0
4.    
5.    FETCH allStories WHERE expiresAt < currentTime
6.    
7.    FOR EACH story IN allStories DO
8.      DELETE story from database
9.      DELETE story.mediaFile from storage
10.     deletedCount ← deletedCount + 1
11.   END FOR
12.   
13.   RETURN deletedCount
14. END
```

---

#### Algorithm 5: Product Search and Filter
**Input:** Search query string, category filter, page number, limit  
**Output:** Filtered product list, total count

```
1.  BEGIN
2.    query ← {}
3.    query.isActive ← true  // Only show active products
4.    
5.    // Apply category filter
6.    IF categoryFilter ≠ "All" THEN
7.      query.category ← categoryFilter
8.    END IF
9.    
10.   // Apply search query
11.   IF searchQuery is not empty THEN
12.     query.$or ← [
13.       {name: REGEX(searchQuery, case-insensitive)},
14.       {description: REGEX(searchQuery, case-insensitive)},
15.       {tags: CONTAINS(searchQuery)}
16.     ]
17.   END IF
18.   
19.   // Pagination
20.   skip ← (page - 1) × limit
21.   
22.   // Execute query
23.   products ← DATABASE.find(query)
24.                       .sort({createdAt: -1})
25.                       .skip(skip)
26.                       .limit(limit)
27.   
28.   totalCount ← DATABASE.count(query)
29.   
30.   RETURN products, totalCount
31. END
```

---

#### Algorithm 6: Profile Completion Check
**Input:** User object (fullName, avatar)  
**Output:** Boolean value (isComplete)

```
1.  BEGIN
2.    requiredFields ← ["fullName", "avatar"]
3.    
4.    FOR EACH field IN requiredFields DO
5.      IF user[field] is null OR user[field] is empty THEN
6.        RETURN false  // Profile incomplete
7.      END IF
8.    END FOR
9.    
10.   RETURN true  // Profile complete
11. END
```

---

#### Algorithm 7: Grouped Review System (Group Posts by Author)
**Input:** Reviewer ID  
**Output:** Grouped posts by author

```
1.  BEGIN
2.    // Fetch pending posts excluding reviewer's own posts
3.    posts ← DATABASE.find({
4.      verificationStatus: "pending",
5.      author: NOT_EQUAL(reviewerId)
6.    })
7.    
8.    groupedPosts ← {}
9.    
10.   FOR EACH post IN posts DO
11.     authorId ← post.author._id
12.     
13.     IF groupedPosts[authorId] does not exist THEN
14.       groupedPosts[authorId] ← {
15.         author: post.author,
16.         posts: [],
17.         totalPosts: 0
18.       }
19.     END IF
20.     
21.     ADD post to groupedPosts[authorId].posts
22.     INCREMENT groupedPosts[authorId].totalPosts
23.   END FOR
24.   
25.   // Convert to array and sort by total posts
26.   result ← CONVERT groupedPosts to array
27.   SORT result BY totalPosts DESCENDING
28.   
29.   RETURN result
30. END
```

---

### Algorithm Complexity Summary

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Content Verification Workflow | O(1) | O(1) |
| Anti-Cheating Check | O(1) | O(1) |
| Trust Score Calculation | O(1) | O(1) |
| Story Expiration Management | O(n) | O(1) |
| Product Search and Filter | O(log n) | O(n) |
| Profile Completion Check | O(1) | O(1) |
| Grouped Review System | O(n log n) | O(n) |

---

## 5.3 EXTERNAL APIs/SDKs

Describe the third-party APIs/SDKs used in the project implementation in the following table. Few examples of APIs are given below.

### Table 5.2: Details of APIs used in the project

| Name of API and version | Description of API | Purpose of usage | List/show the API endpoint/function/class in which it is used |
|------------------------|-------------------|------------------|--------------------------------------------------------------|
| **MongoDB Atlas**<br>v8.0.0 | Cloud-hosted NoSQL database service | Store all application data including users, posts, reviews, products, stories, and business information | Database connection in `backend/server.js`<br>Models: `User.js`, `Post.js`, `Product.js`, `Story.js`, `Review.js` |
| **JWT (jsonwebtoken)**<br>v9.0.2 | JSON Web Token library for Node.js | User authentication and authorization, secure API endpoints with token-based authentication | `backend/middleware/auth.js` (protect middleware)<br>`backend/modules/auth/auth.controller.js` (login, signup) |
| **Bcrypt.js**<br>v2.4.3 | Password hashing library | Securely hash and verify user passwords before storing in database | `backend/models/User.js` (pre-save hook)<br>`backend/modules/auth/auth.controller.js` (password comparison) |
| **Multer**<br>v1.4.5-lts.1 | File upload middleware for Node.js | Handle image and video uploads for posts, stories, products, and profile pictures | `backend/middleware/upload.js` (uploadPost, uploadStory, uploadProduct, uploadAvatar)<br>Used in all routes requiring file uploads |
| **Lucide React**<br>v0.263.1 | Modern icon library for React | Provide consistent, scalable icons throughout the UI (Heart, Message, Shopping, Eye, etc.) | All frontend components:<br>`Feed.jsx`, `Shopping.jsx`, `Profile.jsx`, `ReviewCenter.jsx`, `Sidebar.jsx` |
| **React Router**<br>v6.14.2 | Routing library for React applications | Handle client-side navigation between pages (Feed, Shopping, Profile, Review Center, Business Dashboard) | `Verity_FYP/src/App.jsx` (BrowserRouter, Routes, Route)<br>All navigation components |
| **Styled Components**<br>v6.0.7 | CSS-in-JS library for React | Style React components with scoped CSS, dynamic theming, and responsive design | All `.styled.js` files:<br>`Feed.styled.js`, `Shopping.styled.js`, `Profile.styled.js`, `Layout.styled.js` |
| **UI Avatars API**<br>Public API | Avatar generation service | Generate placeholder avatars with user initials when no profile picture is uploaded | `Sidebar.jsx`, `Shopping.jsx`, `BusinessMessages.jsx`<br>Format: `https://ui-avatars.com/api/?name={name}&background=14b8a6` |
| **Vite**<br>v4.4.5 | Next-generation frontend build tool | Fast development server with Hot Module Replacement (HMR) and optimized production builds | `Verity_FYP/vite.config.js`<br>`Verity_FYP/package.json` (dev script) |
| **Express.js**<br>v4.18.2 | Web application framework for Node.js | Build RESTful API endpoints for backend server with middleware support | `backend/server.js` (main server)<br>All route files: `auth.routes.js`, `post.routes.js`, `product.routes.js` |
| **Mongoose**<br>v7.4.3 | MongoDB object modeling for Node.js | Define schemas, models, and interact with MongoDB database using ODM pattern | All model files in `backend/models/`<br>`User.js`, `Post.js`, `Product.js`, `Story.js`, `Review.js` |
| **CORS**<br>v2.8.5 | Cross-Origin Resource Sharing middleware | Enable frontend (port 5173) to communicate with backend (port 5000) across different origins | `backend/server.js` (CORS configuration)<br>Allows requests from `http://localhost:5173` |

---

## 5.4 USER INTERFACES

Details about user interfaces with descriptions. Provide the User Interface for each sub-system (such as Mobile App, Web App, Client App, Admin App). Provide description of each User Interface explaining the details.

When inserting User Interfaces, use appropriate size of the image, for example, for mobile app, 2-4 screens can be placed on a single page.

Following are few examples of user interfaces:

### 5.4.1 Login Screen

**Description:**  
The login screen is the entry point for all users (Regular Users, Reviewers, and Business accounts). It features a clean, modern design with the Verity branding and checkmark logo.

**Key Features:**
- Email and password input fields with validation
- Role selection dropdown (User, Reviewer, Business)
- Password visibility toggle for user convenience
- "Remember me" checkbox for persistent sessions
- Link to signup page for new users
- Responsive design that works on all devices

**User Flow:**
1. User enters their registered email address
2. User enters their password (with option to show/hide)
3. User selects their account role from dropdown
4. System validates credentials against database
5. Upon successful authentication, user is redirected to appropriate dashboard based on role

**Validation Rules:**
- Email must be in valid format (contains @ and domain)
- Password must be at least 6 characters
- Role must match the account type stored in database
- Error messages displayed for invalid credentials

---

### 5.4.2 Signup Screen

**Description:**  
The signup screen allows new users to create accounts on the Verity platform. It collects essential information and creates user profiles with nested data structure.

**Key Features:**
- Full name input field (required)
- Email input with format validation
- Password input with confirmation field
- Password strength indicator
- Role selection (User, Reviewer, Business)
- Link to login page for existing users
- Terms and conditions acceptance

**User Flow:**
1. User enters full name
2. User provides email address
3. User creates password and confirms it
4. User selects desired role
5. System creates account with nested structure (user_info, profile_info, social_stats, trust_security)
6. User is redirected to appropriate dashboard

**Validation Rules:**
- Full name is required (minimum 2 characters)
- Email must be unique and valid format
- Password must match confirmation
- Password must be at least 6 characters
- Role selection is mandatory

---

### 5.4.3 Feed Screen (User/Reviewer)

**Description:**  
The main feed displays approved posts from all users in a social media style layout. It includes stories at the top and an infinite scroll of posts.

**Key Features:**
- Stories carousel at the top showing 24-hour temporary content
- Post cards displaying:
  - Author avatar and name with verified badge for reviewers
  - Post content with clickable hashtags
  - Images/videos with full-screen view option
  - Like, comment, and share buttons
  - Timestamp showing when post was created
- Infinite scroll pagination for seamless browsing
- Real-time updates when new posts are approved
- Left sidebar for navigation
- Right sidebar for suggestions and trending topics

**Layout:**
- Left Sidebar: Navigation menu (Feed, Shopping, Profile, Review Center)
- Center: Main feed content with posts
- Right Sidebar: Suggested users, trending hashtags, footer links

---

### 5.4.4 Shopping Screen

**Description:**  
The shopping module allows users to browse and purchase products from business accounts. It features a grid layout with search and filter capabilities.

**Key Features:**
- Search bar for product name/description search
- Category filter tabs (19 categories including Electronics, Fashion, Food, etc.)
- Product grid with responsive auto-fill layout
- Each product card shows:
  - Product image (first image from gallery)
  - Product name and price
  - Business owner avatar and name
  - View count, like count, inquiry count
  - Like, Buy, and Message action buttons
- Empty state when no products match filters
- Loading state while fetching products

**User Interactions:**
- Click product card → View detailed product page
- Click "Like" button → Add to favorites (toggle)
- Click "Buy" button → Purchase flow (coming soon alert)
- Click "Message" button → Send inquiry to seller via prompt dialog

**Technical Implementation:**
- Real-time search with debouncing
- Category filtering without page reload
- Pagination support for large product catalogs
- Responsive grid (220px minimum column width)

---

### 5.4.5 Review Center (Reviewer Only)

**Description:**  
The Review Center is an exclusive interface for reviewers to verify pending posts. It includes analytics dashboard and grouped post display.

**Key Features:**
- Reviewer statistics dashboard showing:
  - Pending reviews count
  - Approved today count
  - Rejected today count
  - Verity Score (accuracy percentage)
- Posts grouped by author for efficient review
- Each post displays:
  - Author information (name, avatar, trust score)
  - Post content and media
  - Approve and Reject action buttons
- Rejection modal with reason selection:
  - False Information
  - Misleading Content
  - Spam
  - Inappropriate Content
- Anti-cheating system prevents reviewing own posts
- Real-time stats update after each review

**Review Workflow:**
1. Reviewer sees pending posts grouped by author
2. Reviewer examines content for authenticity
3. Reviewer clicks "Approve" or "Reject"
4. If rejecting, reviewer selects reason from modal
5. Post status updates immediately in database
6. Author receives notification of decision
7. Approved posts appear in public feed
8. Reviewer stats update automatically

---

### 5.4.6 Profile Screen

**Description:**  
The profile screen displays user information, statistics, and posts in an Instagram-style layout.

**Key Features:**
- Circular profile avatar with fallback to UI Avatars
- Edit profile button (own profile only)
- User statistics:
  - Posts count
  - Followers count
  - Following count
- Bio text (150 character limit)
- Website URL (clickable link)
- Verified badge for reviewers
- Posts grid displaying user's approved posts
- Saved posts tab for bookmarked content
- Follow/Unfollow button (other users' profiles)

**Edit Profile Modal:**
- Upload profile picture (5MB limit)
- Edit first name and last name
- Edit bio with character counter
- Edit website URL
- Save changes button
- Cancel button to discard changes

---

### 5.4.7 Create Post Screen

**Description:**  
The create post interface allows users to share content that will go through the review process before appearing in the feed.

**Key Features:**
- Text input area for post content (500 character limit)
- Character counter showing remaining characters
- Media upload section:
  - Support for multiple images
  - Support for videos
  - Preview thumbnails
  - Remove media option
- Hashtag support (automatically detected with # symbol)
- Visibility settings (public/private)
- Preview before posting
- Profile completion check before allowing post creation

**Validation:**
- User must have fullName and avatar (profile completion check)
- Content is required (cannot post empty)
- Maximum 500 characters for text
- Maximum 50MB per media file
- Supported formats: JPEG, PNG, GIF, WebP for images; MP4, MOV, AVI for videos

**User Flow:**
1. User clicks "Create Post" button
2. System checks profile completion
3. User enters post content
4. User optionally uploads media
5. User adds hashtags
6. User clicks "Post" button
7. Post is created with "pending" status
8. Post enters reviewer queue
9. User receives notification when reviewed

---

### 5.4.8 Stories Feature

**Description:**  
Stories allow users to share temporary 24-hour content that automatically expires. Displayed as circles at the top of the feed.

**Key Features:**
- Story circles at top of feed showing:
  - User's own circle with plus icon for creating
  - Friends' stories with colored ring indicating unviewed
  - Grayscale ring for viewed stories
- Story viewer with:
  - Full-screen media display
  - Progress bar showing time remaining
  - Author avatar and name
  - View count
  - Delete option (own stories only)
  - Auto-advance to next story
  - Swipe left/right navigation
  - Tap left/right for previous/next
- Story creation modal:
  - Image/video upload
  - Optional caption
  - Share button
- Automatic expiration after 24 hours
- Background deletion of expired stories

**Story Creation Flow:**
1. User clicks plus icon on own story circle
2. User selects image or video from device
3. User optionally adds caption
4. User clicks "Share Story"
5. Story is uploaded to server
6. Story appears in friends' feeds
7. Story automatically expires after 24 hours

---

### 5.4.9 Business Dashboard

**Description:**  
The Business Dashboard is an exclusive interface for business accounts to manage products and view customer interactions.

**Key Features:**
- Sidebar navigation with tabs:
  - Dashboard overview (analytics)
  - My Products (inventory management)
  - Messages (customer inquiries)
- Create product modal with fields:
  - Product title
  - Price (in PKR)
  - Description (1000 character limit)
  - Category selection (19 categories)
  - Stock quantity
  - Image upload (up to 5 images)
  - Video upload (optional)
  - External link (optional)
- Product inventory grid showing:
  - Product thumbnail
  - Product name and price
  - Stock status
  - Edit and delete options
- Analytics dashboard showing:
  - Total products
  - Total views
  - Total inquiries
  - Total likes
  - Active products count
- Logout button

**Product Creation Flow:**
1. Business user clicks "Create Business Listing"
2. Modal opens with product form
3. User fills in all required fields
4. User uploads product images
5. User clicks "Confirm & Publish"
6. Product is saved to database
7. Product appears in Shopping module
8. Product appears in inventory grid

---

### 5.4.10 Business Messages Screen

**Description:**  
The Business Messages screen displays all customer inquiries about products in a clean, organized list format.

**Key Features:**
- Header showing total inquiry count
- List of all inquiries with:
  - Customer avatar (circular)
  - Customer name and email
  - Message content in highlighted box
  - Product name with icon
  - Timestamp (relative time: "2h ago", "1d ago")
- Empty state when no messages:
  - Icon illustration
  - "No Messages Yet" heading
  - Helpful description text
- Auto-refresh when new inquiries arrive
- Sorted by most recent first
- Hover effect on inquiry cards
- Scrollable list for many inquiries

**Message Display:**
- Customer information prominently displayed
- Message content in teal-highlighted box with left border
- Product name clearly indicated
- Time displayed in relative format for better UX

**Empty State:**
- Friendly message explaining feature
- Icon to make it visually appealing
- Encourages users to wait for customer inquiries

---

## Design System

### Color Scheme
- **Primary:** #14b8a6 (Teal) - Buttons, links, accents, brand color
- **Success:** #10b981 (Green) - Approve actions, success messages
- **Danger:** #ef4444 (Red) - Reject, delete actions, error messages
- **Dark:** #1f2937 - Text, headers, important content
- **Light:** #f8fafc - Backgrounds, cards
- **Border:** #e5e7eb - Dividers, borders, separators

### Typography
- **Font Family:** System fonts (sans-serif) for optimal performance
- **Headings:** 700-900 weight (bold to black)
- **Body Text:** 400-600 weight (regular to semi-bold)
- **Small Text:** 0.75rem - 0.875rem (12px - 14px)
- **Regular Text:** 0.95rem - 1rem (15px - 16px)
- **Large Text:** 1.25rem - 2rem (20px - 32px)

### Spacing
- **Small:** 0.5rem - 0.75rem (8px - 12px)
- **Medium:** 1rem - 1.5rem (16px - 24px)
- **Large:** 2rem - 3rem (32px - 48px)

### Component Styling
- **Border Radius:** 8px - 16px for rounded corners
- **Shadows:** Subtle shadows (0 2px 8px rgba(0,0,0,0.08))
- **Transitions:** 0.2s - 0.3s for smooth animations
- **Icons:** Lucide React icons (consistent style, 16px - 24px)

### Responsive Breakpoints
- **Mobile:** < 768px (single column layout)
- **Tablet:** 768px - 1024px (2 column layout)
- **Desktop:** > 1024px (3+ column layout)
- **Grid:** Auto-fill with minmax for flexibility

### Accessibility Features
- Semantic HTML elements (header, nav, main, section)
- Alt text for all images
- Keyboard navigation support
- Focus indicators on interactive elements
- Color contrast ratios meeting WCAG AA standards
- Error messages with clear instructions
- Loading states for async operations
- Screen reader friendly labels

### User Experience Enhancements
1. **Instant Feedback:** Loading spinners, success/error toast messages
2. **Optimistic Updates:** UI updates before server confirmation
3. **Empty States:** Helpful messages when no content available
4. **Placeholders:** UI Avatars for missing profile pictures
5. **Tooltips:** Hover hints for icon buttons
6. **Confirmation Dialogs:** Prevent accidental destructive actions
7. **Auto-save:** Draft posts saved to localStorage
8. **Infinite Scroll:** Seamless content loading without pagination buttons
