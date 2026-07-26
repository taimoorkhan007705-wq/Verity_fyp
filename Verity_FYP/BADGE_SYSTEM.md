# Badge Counter System

Instagram/Facebook-style notification badges implemented across the Verity application.

## Overview

Red circular badges appear in the top-right corner of navigation icons to indicate:
- **Messages**: Unread message count (shows "9+" when > 9)
- **Rejected Posts**: Unread rejection count (shows "9+" when > 9)  
- **Feed**: New posts from followed users (shows "3" or "3+" only when ≥ 3)

## Components

### NotificationBadge Component
**Location**: `src/components/Badge/NotificationBadge.jsx`

Small red circular badge with:
- Position: top-right (-6px offset)
- Size: 18px height, min-width 18px
- Color: #ef4444 (red)
- Font: 10px, bold, white text
- Border: 2px solid surface color
- Animation: Subtle pulse effect
- Z-index: 1 (appears above icon)

### BadgeContext
**Location**: `src/contexts/BadgeContext.jsx`

Centralized badge state management:
```javascript
const { badges, markFeedVisited, markRejectionsVisited, refreshBadges } = useBadges()

// badges object:
{
  unreadMessages: 0,      // Count of unread messages
  unreadRejections: 0,    // Count of unread rejected posts
  newFeedAuthors: 0,      // Count of followed users with new posts
}
```

**Features**:
- Auto-polls backend every 30 seconds
- Shows toast notifications for new messages/rejections
- Tracks feed visits via localStorage (`feedLastVisitedAt`)
- Tracks seen notifications via localStorage (`seenNotificationIds`)

## Badge Behavior

### 1. Messages Badge
**Location**: Messages icon in Sidebar

**Shows**: 
- "1", "2", ... "9" for counts 1-9
- "9+" for counts > 9

**Clears**:
- Automatically when user views messages
- Backend marks messages as `isRead: true` when conversation is opened
- Badge refreshes when returning to message list

**Implementation**:
```jsx
<NotificationBadge count={badges.unreadMessages}>
  <MessageCircle />
</NotificationBadge>
```

### 2. Rejected Posts Badge
**Location**: Rejected Posts icon in Sidebar

**Shows**:
- "1", "2", ... "9" for counts 1-9
- "9+" for counts > 9

**Clears**:
- When user visits `/rejected-posts` page
- Calls `markRejectionsVisited()` on component mount
- Backend marks notifications as `isRead: true`

**Implementation**:
```jsx
<NotificationBadge count={badges.unreadRejections}>
  <XCircle />
</NotificationBadge>
```

### 3. Feed Badge
**Location**: Feed/Home icon in Sidebar

**Shows**:
- Nothing if < 3 new authors
- "3" if exactly 3 new authors
- "3+" if > 3 new authors

**Clears**:
- When user visits `/feed` page
- Calls `markFeedVisited()` on component mount
- Updates localStorage `feedLastVisitedAt` timestamp

**Implementation**:
```jsx
<NotificationBadge count={badges.newFeedAuthors} feedMode>
  <Home />
</NotificationBadge>
```

## Backend API

### Badge Counts Endpoint
**GET** `/api/users/badges?feedSince={timestamp}`

Returns:
```json
{
  "success": true,
  "badges": {
    "unreadMessages": 2,
    "unreadRejections": 1,
    "newFeedAuthors": 5
  }
}
```

**Logic**:
- `unreadMessages`: Counts `Message` documents where `receiver: userId` and `isRead: false`
- `unreadRejections`: Counts `Notification` documents where `user: userId`, `type: 'post_rejected'`, and `isRead: false`
- `newFeedAuthors`: Counts distinct authors in followed connections with posts created after `feedSince`

### Mark Rejections Read
**POST** `/api/users/badges/rejections/read`

Marks all rejection notifications as read for the current user.

### Mark Messages Read
Messages are automatically marked read when fetched via:
**GET** `/api/users/messages/:otherId`

Backend updates all messages in conversation where `receiver: userId` to `isRead: true`.

## User Roles

All badge types are visible to:
- ✅ Regular users (Consumer)
- ✅ Reviewers
- ✅ Admin
- ✅ Business users

## Visual Specifications

### Badge Circle
```css
position: absolute;
top: -6px;
right: -6px;
min-width: 18px;
height: 18px;
border-radius: 9px;
background: #ef4444;
color: white;
font-size: 10px;
font-weight: 700;
padding: 0 4px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
border: 2px solid [surface-color];
z-index: 1;
```

### Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

## Testing

To test badges:

1. **Messages Badge**:
   - Login as User A
   - Send message to User B
   - Login as User B → should see badge on Messages icon
   - Open messages → badge clears

2. **Rejected Posts Badge**:
   - Create a post with AI-generated content
   - Wait for reviewer to reject it
   - Badge appears on Rejected Posts icon
   - Click Rejected Posts → badge clears

3. **Feed Badge**:
   - Follow 3+ users
   - Have them create new posts
   - Visit any page except feed → badge shows "3" or "3+"
   - Visit feed → badge clears
   - Create more followed posts → badge doesn't show until reaching 3 again

## Future Enhancements

Potential improvements:
- [ ] Add sound notification option
- [ ] Badge color customization per role
- [ ] Desktop notifications integration
- [ ] Badge count sync across multiple tabs
- [ ] Configurable feed badge threshold (currently hardcoded at 3)
- [ ] Separate badge for direct mentions vs general feed activity
