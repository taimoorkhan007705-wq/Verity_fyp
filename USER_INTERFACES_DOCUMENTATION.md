# Section 5.4: User Interfaces

## Overview
Verity provides intuitive user interfaces for three types of users: Regular Users, Reviewers, and Business accounts. Each interface is designed with a clean, modern aesthetic using a teal (#14b8a6) color scheme.

---

## 5.4.1 Login Screen

**Purpose:** Authenticate users and route them to appropriate dashboards based on their role.

**Features:**
- Email and password input fields
- Role selection dropdown (User, Reviewer, Business)
- Password visibility toggle
- "Remember me" checkbox
- Link to signup page
- Verity branding with checkmark logo

**User Flow:**
1. User enters email and password
2. Selects their role from dropdown
3. Clicks "Sign In" button
4. System validates credentials
5. Redirects to appropriate dashboard:
   - User → Feed
   - Reviewer → Review Center
   - Business → Business Dashboard

**Validation:**
- Email format validation
- Minimum 6 characters for password
- Role must match account type in database

---

## 5.4.2 Signup Screen

**Purpose:** Allow new users to create accounts.

**Features:**
- Full name input
- Email input
- Password input with confirmation
- Role selection (User, Reviewer, Business)
- Password strength indicator
- Link to login page

**User Flow:**
1. User enters full name, email, password
2. Confirms password
3. Selects desired role
4. Clicks "Create Account"
5. System creates account with nested data structure
6. Redirects to appropriate dashboard

---

## 5.4.3 Feed Screen (User/Reviewer)

**Purpose:** Display approved posts from all users.

**Features:**
- Stories carousel at top
- Post cards with:
  - Author avatar and name
  - Verified badge for reviewers
  - Post content with hashtags
  - Images/videos
  - Like, comment, share buttons
  - Timestamp
- Infinite scroll pagination
- Real-time updates

**Layout:**
- Left sidebar: Navigation menu
- Center: Feed content
- Right sidebar: Suggestions, trending

---

## 5.4.4 Shopping Screen

**Purpose:** Browse and purchase products from businesses.

**Features:**
- Search bar for product search
- Category filter tabs (Electronics, Food, Clothing, etc.)
- Product grid with cards showing:
  - Product image
  - Product name and price
  - Business owner info
  - View/like/inquiry counts
  - Like, Buy, Message buttons
- Responsive grid layout (auto-fill)

**User Interactions:**
- Click product → View details
- Click "Like" → Add to favorites
- Click "Buy" → Purchase flow (coming soon)
- Click "Message" → Send inquiry to seller

---

## 5.4.5 Review Center (Reviewer Only)

**Purpose:** Allow reviewers to verify pending posts.

**Features:**
- Reviewer stats dashboard:
  - Pending reviews count
  - Approved today
  - Rejected today
  - Verity Score (accuracy percentage)
- Posts grouped by author
- Each post shows:
  - Author information
  - Post content and media
  - Trust score
  - Approve/Reject buttons
- Rejection modal with reason selection
- Anti-cheating: Cannot review own posts

**Review Workflow:**
1. Reviewer sees pending posts
2. Reviews content for authenticity
3. Clicks "Approve" or "Reject"
4. If rejecting, selects reason
5. Post status updates immediately
6. Stats update in real-time

---

## 5.4.6 Profile Screen

**Purpose:** Display user profile information.

**Features:**
- Profile avatar (circular)
- Edit profile button
- User statistics:
  - Posts count
  - Followers count
  - Following count
- Bio and website
- Verified badge for reviewers
- Posts grid (Instagram-style)
- Saved posts tab

**Edit Profile:**
- Upload profile picture
- Edit first/last name
- Edit bio (150 char limit)
- Edit website URL
- Character counter for bio

---

## 5.4.7 Create Post Screen

**Purpose:** Allow users to create new posts.

**Features:**
- Text input for content (500 char limit)
- Media upload (images/videos)
- Multiple file support
- Hashtag support
- Visibility settings (public/private)
- Preview before posting
- Profile completion check

**Validation:**
- User must have fullName and avatar
- Content required
- Max 500 characters
- Max 50MB per file

---

## 5.4.8 Stories Feature

**Purpose:** Share temporary 24-hour content.

**Features:**
- Story circles at top of feed
- User's own circle with plus icon
- View others' stories by clicking
- Story viewer with:
  - Full-screen media
  - Progress bar
  - Author info
  - View count
  - Delete option (own stories)
- Auto-advance to next story
- Swipe navigation

**Story Creation:**
1. Click plus icon on own circle
2. Select image/video
3. Add optional caption
4. Share story
5. Expires after 24 hours

---

## 5.4.9 Business Dashboard

**Purpose:** Manage products and view customer inquiries.

**Features:**
- Sidebar navigation:
  - Dashboard overview
  - My Products (inventory)
  - Messages (customer inquiries)
- Create product modal:
  - Product title, price, description
  - Category selection (19 categories)
  - Stock quantity
  - Image upload (up to 5 images)
  - External link (optional)
- Product inventory grid
- Customer inquiries list with:
  - Customer name, email, avatar
  - Message content
  - Product name
  - Timestamp

---

## 5.4.10 Business Messages Screen

**Purpose:** View and manage customer product inquiries.

**Features:**
- List of all inquiries
- Each inquiry shows:
  - Customer avatar and name
  - Customer email
  - Message content (highlighted box)
  - Product name with icon
  - Time ago
- Empty state when no messages
- Auto-refresh on new inquiries
- Sorted by most recent first

---

## Design Principles

### Color Scheme
- **Primary:** #14b8a6 (Teal) - Buttons, links, accents
- **Success:** #10b981 (Green) - Approve, success messages
- **Danger:** #ef4444 (Red) - Reject, delete actions
- **Dark:** #1f2937 - Text, headers
- **Light:** #f8fafc - Backgrounds
- **Border:** #e5e7eb - Dividers, borders

### Typography
- **Font Family:** System fonts (sans-serif)
- **Headings:** 700-900 weight
- **Body:** 400-600 weight
- **Small Text:** 0.75rem - 0.875rem
- **Regular:** 0.95rem - 1rem
- **Large:** 1.25rem - 2rem

### Spacing
- **Small:** 0.5rem - 0.75rem
- **Medium:** 1rem - 1.5rem
- **Large:** 2rem - 3rem

### Components
- **Border Radius:** 8px - 16px (rounded corners)
- **Shadows:** Subtle (0 2px 8px rgba(0,0,0,0.08))
- **Transitions:** 0.2s - 0.3s (smooth animations)
- **Icons:** Lucide React (consistent style)

### Responsive Design
- **Mobile:** < 768px (single column)
- **Tablet:** 768px - 1024px (2 columns)
- **Desktop:** > 1024px (3+ columns)
- **Grid:** Auto-fill with minmax for flexibility

---

## Accessibility Features
- Semantic HTML elements
- Alt text for images
- Keyboard navigation support
- Focus indicators
- Color contrast ratios (WCAG AA)
- Error messages with clear instructions
- Loading states for async operations

---

## User Experience Enhancements
1. **Instant Feedback:** Loading spinners, success/error messages
2. **Optimistic Updates:** UI updates before server confirmation
3. **Empty States:** Helpful messages when no content
4. **Placeholders:** UI Avatars for missing profile pictures
5. **Tooltips:** Hover hints for icons
6. **Confirmation Dialogs:** Prevent accidental actions
7. **Auto-save:** Draft posts saved locally
8. **Infinite Scroll:** Seamless content loading

