# Table 5.2: External APIs/SDKs Used in Verity Project

## Third-Party APIs and SDKs

| Name of API | Description of API | Purpose of Usage | Link/Documentation |
|-------------|-------------------|------------------|-------------------|
| **MongoDB Atlas** | Cloud-hosted NoSQL database service | Store user data, posts, reviews, products, stories, and all application data | https://www.mongodb.com/atlas |
| **JWT (jsonwebtoken)** | JSON Web Token library for Node.js | User authentication and authorization, secure API endpoints | https://www.npmjs.com/package/jsonwebtoken |
| **Bcrypt.js** | Password hashing library | Securely hash and verify user passwords before storing in database | https://www.npmjs.com/package/bcryptjs |
| **Multer** | File upload middleware for Node.js | Handle image and video uploads for posts, stories, products, and profile pictures | https://www.npmjs.com/package/multer |
| **Lucide React** | Icon library for React | Provide consistent, modern icons throughout the UI (Heart, Message, Shopping, etc.) | https://lucide.dev |
| **React Router** | Routing library for React | Handle navigation between pages (Feed, Shopping, Profile, Review Center) | https://reactrouter.com |
| **Styled Components** | CSS-in-JS library | Style React components with scoped CSS and dynamic theming | https://styled-components.com |
| **UI Avatars API** | Avatar generation service | Generate placeholder avatars with user initials when no profile picture is uploaded | https://ui-avatars.com/api |
| **Vite** | Frontend build tool | Fast development server and optimized production builds for React app | https://vitejs.dev |
| **Express.js** | Web framework for Node.js | Build RESTful API endpoints for backend server | https://expressjs.com |
| **Mongoose** | MongoDB object modeling for Node.js | Define schemas, models, and interact with MongoDB database | https://mongoosejs.com |
| **CORS** | Cross-Origin Resource Sharing middleware | Enable frontend (port 5173) to communicate with backend (port 5000) | https://www.npmjs.com/package/cors |

## API Integration Details

### 1. MongoDB Atlas
- **Version:** 8.0.0
- **Usage:** Primary database for all collections (Users, Reviewers, Business, Posts, Reviews, Stories, Products)
- **Connection:** Via connection string with authentication
- **Features Used:** 
  - Document storage
  - Indexing for fast queries
  - Aggregation pipelines
  - TTL indexes for story expiration

### 2. JWT Authentication
- **Version:** 9.0.2
- **Usage:** Secure user sessions
- **Implementation:**
  - Token generated on login
  - Stored in localStorage
  - Sent in Authorization header for protected routes
  - 30-day expiration

### 3. Multer File Upload
- **Version:** 1.4.5-lts.1
- **Usage:** Handle multipart/form-data
- **File Types Supported:**
  - Images: JPEG, PNG, GIF, WebP
  - Videos: MP4, MOV, AVI
- **Storage:** User-specific folders (`/uploads/users/{userId}/{type}/`)
- **Size Limits:**
  - Profile images: 5MB
  - Post media: 50MB
  - Product images: 10MB per image (max 5 images)

### 4. UI Avatars API
- **Version:** Public API (no authentication required)
- **Usage:** Generate fallback avatars
- **Parameters:**
  - `name`: User's full name
  - `background`: #14b8a6 (teal theme color)
  - `color`: #fff (white text)
  - `size`: 150px
- **Example:** `https://ui-avatars.com/api/?name=John+Doe&background=14b8a6&color=fff&size=150`

## No External Payment APIs (Yet)
Currently, the "Buy" button shows a "coming soon" message. Future integration options:
- Stripe API for payment processing
- PayPal SDK for alternative payments
- JazzCash/EasyPaisa for local Pakistani payments

## No Social Media APIs
OAuth functionality was removed. Only email/password authentication is used.

## Security Measures
1. **Environment Variables:** Sensitive data (JWT_SECRET, MONGODB_URI) stored in `.env` file
2. **Password Hashing:** Bcrypt with 10 salt rounds
3. **Input Validation:** Mongoose schema validation
4. **File Type Validation:** Multer fileFilter checks MIME types
5. **CORS Configuration:** Restricted to localhost during development

