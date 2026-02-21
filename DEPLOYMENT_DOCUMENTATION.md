# Chapter 6: Deployment and Installation

## 6.1 Software Deployment

This section specifies the deployment environments used for hosting and live testing of the Verity social media platform.

### 6.1.1 Application Type

**Verity** is a full-stack web application consisting of:
- **Frontend:** Single Page Application (SPA) built with React
- **Backend:** RESTful API server built with Node.js and Express
- **Database:** Cloud-hosted MongoDB database (MongoDB Atlas)
- **Architecture:** Client-Server architecture with three-tier design
  - Presentation Layer (React Frontend)
  - Application Layer (Express Backend)
  - Data Layer (MongoDB Database)

### 6.1.2 Deployment Strategy

**Development Environment:**
- Local development on developer machines
- Frontend runs on `http://localhost:5173` (Vite dev server)
- Backend runs on `http://localhost:5000` (Express server)
- Hot Module Replacement (HMR) for instant updates during development

**Production Deployment Strategy:**
- **Frontend:** Static file hosting (Vercel, Netlify, or GitHub Pages)
- **Backend:** Node.js hosting (Heroku, Railway, Render, or AWS EC2)
- **Database:** MongoDB Atlas (Cloud-hosted, always available)
- **File Storage:** Local file system (uploads folder) or cloud storage (AWS S3, Cloudinary)

**Deployment Type:** Continuous Deployment (CD)
- Code changes pushed to Git repository
- Automatic builds triggered on push
- Automated testing before deployment
- Zero-downtime deployment with rollback capability

### 6.1.3 Appropriate Technologies

#### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library for building user interfaces |
| React Router DOM | 7.13.0 | Client-side routing and navigation |
| Vite | 8.0.0-beta.13 | Build tool and development server |
| Styled Components | 6.3.9 | CSS-in-JS styling solution |
| Lucide React | 0.563.0 | Icon library |
| Framer Motion | 12.34.0 | Animation library |


#### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x or higher | JavaScript runtime environment |
| Express.js | 4.18.2 | Web application framework |
| MongoDB | 8.0.0 | NoSQL database |
| Mongoose | 8.0.0 | MongoDB object modeling |
| JWT | 9.0.2 | Authentication and authorization |
| Bcrypt.js | 2.4.3 | Password hashing |
| Multer | 1.4.5-lts.1 | File upload handling |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Dotenv | 16.3.1 | Environment variable management |

#### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| Nodemon | 3.0.1 | Auto-restart server on changes |
| ESLint | 9.39.1 | Code linting and quality |
| Git | Latest | Version control |
| VS Code | Latest | Code editor (recommended) |

### 6.1.4 Quality Attributes

#### Performance
- **Response Time:** API responses < 200ms for most endpoints
- **Page Load Time:** Initial page load < 2 seconds
- **Image Optimization:** Compressed images, lazy loading
- **Code Splitting:** React lazy loading for route-based splitting
- **Database Indexing:** MongoDB indexes on frequently queried fields

#### Security
- **Authentication:** JWT-based token authentication
- **Password Security:** Bcrypt hashing with 10 salt rounds
- **Input Validation:** Mongoose schema validation
- **File Upload Security:** MIME type validation, file size limits
- **CORS Configuration:** Restricted to allowed origins
- **Environment Variables:** Sensitive data stored in .env files
- **SQL Injection Prevention:** Mongoose ODM prevents injection attacks

#### Scalability
- **Horizontal Scaling:** Stateless backend allows multiple instances
- **Database Scaling:** MongoDB Atlas auto-scaling
- **Load Balancing:** Ready for load balancer integration
- **Caching Strategy:** Browser caching for static assets
- **CDN Ready:** Static files can be served via CDN


#### Reliability
- **Error Handling:** Try-catch blocks in all async operations
- **Database Connection:** Auto-reconnect on connection loss
- **Graceful Shutdown:** Proper cleanup on server shutdown
- **Logging:** Console logging for debugging (production: use Winston/Morgan)
- **Backup Strategy:** MongoDB Atlas automated backups

#### Maintainability
- **Code Organization:** Modular structure with separation of concerns
- **Naming Conventions:** Consistent naming across codebase
- **Documentation:** Inline comments and README files
- **Version Control:** Git with meaningful commit messages
- **Code Reviews:** Pull request workflow recommended

#### Usability
- **Responsive Design:** Works on mobile, tablet, and desktop
- **Intuitive UI:** Clean, modern interface with familiar patterns
- **Loading States:** Visual feedback during async operations
- **Error Messages:** Clear, user-friendly error messages
- **Accessibility:** Semantic HTML, keyboard navigation support

### 6.1.5 Crosscutting Concerns

#### Logging and Monitoring
- **Development:** Console.log for debugging
- **Production:** Implement Winston or Morgan for structured logging
- **Error Tracking:** Sentry or similar service recommended
- **Performance Monitoring:** New Relic or similar APM tool recommended

#### Configuration Management
- **Environment Variables:** .env files for different environments
- **Development Config:** .env (local development)
- **Production Config:** Environment variables on hosting platform
- **Database URLs:** Separate databases for dev/staging/production

#### Exception Handling
- **Frontend:** Error boundaries in React components
- **Backend:** Global error handling middleware
- **Database:** Mongoose error handling
- **File Upload:** Multer error handling for invalid files

#### Authentication and Authorization
- **JWT Tokens:** 30-day expiration
- **Token Storage:** localStorage on client side
- **Protected Routes:** Middleware checks on backend
- **Role-Based Access:** User, Reviewer, Business roles
- **Password Reset:** Email-based reset flow (to be implemented)


#### Data Validation
- **Frontend Validation:** Form validation before submission
- **Backend Validation:** Mongoose schema validation
- **File Validation:** MIME type and size checks
- **Sanitization:** Input sanitization to prevent XSS attacks

---

## 6.2 Installation/Deployment Description

This section provides a comprehensive step-by-step guide for installing and deploying the Verity application.

### 6.2.1 System Requirements

#### Hardware Requirements
- **Processor:** Intel Core i3 or equivalent (minimum), i5 or higher (recommended)
- **RAM:** 4GB (minimum), 8GB or higher (recommended)
- **Storage:** 2GB free disk space for application and dependencies
- **Internet:** Stable internet connection for MongoDB Atlas and package downloads

#### Software Requirements
- **Operating System:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Node.js:** Version 18.x or higher
- **npm:** Version 9.x or higher (comes with Node.js)
- **Git:** Latest version for cloning repository
- **Web Browser:** Chrome, Firefox, Safari, or Edge (latest versions)
- **Code Editor:** VS Code (recommended) or any text editor

### 6.2.2 Pre-Installation Setup

#### Step 1: Install Node.js and npm

**For Windows:**
1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer (.msi file)
4. Follow the installation wizard
5. Check "Automatically install necessary tools" option
6. Click "Install" and wait for completion

**Verification:**
Open Command Prompt or PowerShell and run:
```bash
node --version
npm --version
```
Expected output: Node v18.x.x or higher, npm 9.x.x or higher

**For macOS:**
```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

**For Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```


#### Step 2: Install Git

**For Windows:**
1. Visit https://git-scm.com/download/win
2. Download the installer
3. Run the installer
4. Use default settings (recommended)
5. Complete installation

**For macOS:**
```bash
# Using Homebrew
brew install git

# Verify installation
git --version
```

**For Linux:**
```bash
sudo apt install git

# Verify installation
git --version
```

#### Step 3: Setup MongoDB Atlas Account

1. Visit https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Create account with email or Google/GitHub
4. Create a new cluster (Free tier M0 is sufficient)
5. Choose cloud provider and region (closest to your location)
6. Click "Create Cluster" (takes 3-5 minutes)
7. Create database user:
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"
8. Configure network access:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
9. Get connection string:
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `verity_fyp`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/verity_fyp?retryWrites=true&w=majority
```

### 6.2.3 Installation Steps

#### Step 1: Clone the Repository

Open terminal/command prompt and navigate to desired directory:

```bash
# Navigate to your projects folder
cd Documents

# Clone the repository (replace with your actual repo URL)
git clone https://github.com/yourusername/verity-fyp.git

# Navigate into project directory
cd verity-fyp
```

**Screenshot Note:** Take screenshot of terminal showing successful clone


#### Step 2: Backend Setup

**2.1 Navigate to backend folder:**
```bash
cd backend
```

**2.2 Install backend dependencies:**
```bash
npm install
```

This will install all required packages:
- express (4.18.2)
- mongoose (8.0.0)
- jsonwebtoken (9.0.2)
- bcryptjs (2.4.3)
- multer (1.4.5-lts.1)
- cors (2.8.5)
- dotenv (16.3.1)

**Screenshot Note:** Take screenshot showing npm install progress and completion

**2.3 Create environment file:**

Create a new file named `.env` in the backend folder:

```bash
# For Windows (Command Prompt)
type nul > .env

# For Windows (PowerShell)
New-Item .env

# For macOS/Linux
touch .env
```

**2.4 Configure environment variables:**

Open `.env` file in text editor and add:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/verity_fyp?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

**Important:** Replace the MongoDB URI with your actual connection string from Step 3 of Pre-Installation Setup.

**Screenshot Note:** Take screenshot of .env file (blur sensitive information)

**2.5 Create uploads directory structure:**

```bash
# For Windows
mkdir uploads\users

# For macOS/Linux
mkdir -p uploads/users
```

**2.6 Start the backend server:**

```bash
# Development mode (with auto-restart)
npm run dev

# OR Production mode
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

**Screenshot Note:** Take screenshot of terminal showing successful server start


#### Step 3: Frontend Setup

**3.1 Open a new terminal window** (keep backend running in the first terminal)

**3.2 Navigate to frontend folder:**
```bash
# From project root
cd Verity_FYP
```

**3.3 Install frontend dependencies:**
```bash
npm install
```

This will install all required packages:
- react (19.2.0)
- react-dom (19.2.0)
- react-router-dom (7.13.0)
- styled-components (6.3.9)
- lucide-react (0.563.0)
- framer-motion (12.34.0)
- vite (8.0.0-beta.13)

**Screenshot Note:** Take screenshot showing npm install progress and completion

**3.4 Verify API configuration:**

Open `src/services/api.js` and ensure the base URL is correct:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**3.5 Start the frontend development server:**

```bash
npm run dev
```

**Expected Output:**
```
VITE v8.0.0-beta.13  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Screenshot Note:** Take screenshot of terminal showing Vite server running

**3.6 Open application in browser:**

Open your web browser and navigate to:
```
http://localhost:5173
```

You should see the Verity login page.

**Screenshot Note:** Take screenshot of login page in browser

### 6.2.4 Verification Steps

#### Test 1: Backend API Health Check

Open browser or use Postman to test:
```
http://localhost:5000/api/auth/test
```

Expected response: Server is running or similar message

#### Test 2: Database Connection

Check the backend terminal for:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

#### Test 3: Create Test Account

1. On the login page, click "Sign Up" or "Create Account"
2. Fill in the signup form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: User
3. Click "Create Account"
4. You should be redirected to the Feed page

**Screenshot Note:** Take screenshots of signup process


#### Test 4: Test Core Features

**Create a Post:**
1. Click "Create Post" button
2. Enter some text content
3. Optionally upload an image
4. Click "Post"
5. Post should be created with "pending" status

**Screenshot Note:** Take screenshot of create post modal

**View Shopping:**
1. Click "Shopping" in left sidebar
2. You should see the shopping page (may be empty initially)

**Screenshot Note:** Take screenshot of shopping page

**Test Reviewer Account:**
1. Logout from current account
2. Create new account with role "Reviewer"
3. Login with reviewer account
4. You should see "Review Center" in sidebar
5. Click "Review Center" to see pending posts

**Screenshot Note:** Take screenshot of Review Center

**Test Business Account:**
1. Logout from current account
2. Create new account with role "Business"
3. Login with business account
4. You should see Business Dashboard
5. Try creating a product

**Screenshot Note:** Take screenshot of Business Dashboard

### 6.2.5 Common Installation Issues and Solutions

#### Issue 1: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# For Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# For macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in backend `.env` file:
```env
PORT=5001
```

#### Issue 2: MongoDB Connection Failed

**Error Message:**
```
MongooseServerSelectionError: Could not connect to any servers
```

**Solutions:**
1. Check internet connection
2. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
3. Verify connection string in .env file
4. Check username and password are correct
5. Ensure database user has proper permissions


#### Issue 3: npm install fails

**Error Message:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install` again
4. If still fails, try `npm install --legacy-peer-deps`

#### Issue 4: CORS Error in Browser

**Error Message:**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
Verify CORS configuration in `backend/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### Issue 5: File Upload Not Working

**Error Message:**
```
MulterError: Unexpected field
```

**Solutions:**
1. Check uploads folder exists: `backend/uploads/users/`
2. Verify folder permissions (should be writable)
3. Check file size limits in multer configuration
4. Verify file input name matches multer field name

#### Issue 6: JWT Token Invalid

**Error Message:**
```
JsonWebTokenError: invalid token
```

**Solutions:**
1. Clear browser localStorage
2. Logout and login again
3. Verify JWT_SECRET in .env file
4. Check token expiration (30 days default)

### 6.2.6 Production Deployment

#### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

**Frontend Deployment (Vercel):**

1. Create account on https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Navigate to frontend folder:
   ```bash
   cd Verity_FYP
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Deploy:
   ```bash
   vercel --prod
   ```
6. Follow prompts and note the deployment URL

**Backend Deployment (Render):**

1. Create account on https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: verity-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
5. Add environment variables:
   - PORT: 5000
   - MONGODB_URI: (your MongoDB Atlas connection string)
   - JWT_SECRET: (your secret key)
   - CLIENT_URL: (your Vercel frontend URL)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Note the backend URL


**Update Frontend API URL:**

After backend deployment, update `Verity_FYP/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

Rebuild and redeploy frontend:
```bash
npm run build
vercel --prod
```

#### Option 2: Deploy to Railway (Full Stack)

1. Create account on https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your repository
4. Railway will auto-detect both frontend and backend
5. Configure environment variables for backend
6. Deploy both services
7. Railway provides URLs for both services

#### Option 3: Deploy to Heroku (Backend) + Netlify (Frontend)

**Backend (Heroku):**
1. Create account on https://heroku.com
2. Install Heroku CLI
3. Login: `heroku login`
4. Create app: `heroku create verity-backend`
5. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   ```
6. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

**Frontend (Netlify):**
1. Create account on https://netlify.com
2. Drag and drop the `dist` folder after running `npm run build`
3. Or connect GitHub repository for automatic deployments

### 6.2.7 Post-Deployment Checklist

- [ ] Backend server is running and accessible
- [ ] Frontend is deployed and accessible
- [ ] MongoDB Atlas connection is working
- [ ] Environment variables are set correctly
- [ ] CORS is configured for production URLs
- [ ] File uploads are working
- [ ] Authentication (login/signup) is working
- [ ] All API endpoints are responding
- [ ] Images and media are loading correctly
- [ ] Test all user roles (User, Reviewer, Business)
- [ ] Test core features:
  - [ ] Create post
  - [ ] Review posts (Reviewer)
  - [ ] Create product (Business)
  - [ ] Shopping page
  - [ ] Stories
  - [ ] Profile editing
  - [ ] Messaging

### 6.2.8 Maintenance and Updates

#### Regular Maintenance Tasks

**Weekly:**
- Monitor error logs
- Check database storage usage
- Review user feedback

**Monthly:**
- Update npm packages: `npm update`
- Review and optimize database queries
- Check security vulnerabilities: `npm audit`
- Backup database (MongoDB Atlas auto-backup)

**Quarterly:**
- Update Node.js version if needed
- Review and update dependencies
- Performance optimization
- Security audit


#### Updating the Application

**For Bug Fixes:**
1. Fix the bug in code
2. Test locally
3. Commit changes: `git commit -m "Fix: description"`
4. Push to repository: `git push`
5. Redeploy (automatic if using CI/CD)

**For New Features:**
1. Create feature branch: `git checkout -b feature/new-feature`
2. Develop and test feature
3. Merge to main branch
4. Deploy to production

**Database Migrations:**
1. Create migration script if schema changes
2. Test on development database first
3. Backup production database
4. Run migration on production
5. Verify data integrity

### 6.2.9 Monitoring and Logging

#### Development Monitoring
- Console logs in browser (F12 Developer Tools)
- Backend logs in terminal
- MongoDB Atlas monitoring dashboard

#### Production Monitoring (Recommended)

**Application Monitoring:**
- New Relic APM
- Datadog
- AppDynamics

**Error Tracking:**
- Sentry (https://sentry.io)
- Rollbar
- Bugsnag

**Log Management:**
- Loggly
- Papertrail
- CloudWatch (if using AWS)

**Uptime Monitoring:**
- UptimeRobot (https://uptimerobot.com)
- Pingdom
- StatusCake

### 6.2.10 Backup and Recovery

#### Database Backup
- MongoDB Atlas provides automatic daily backups
- Retention period: 7 days (free tier)
- Manual backup: Export collections via MongoDB Compass

#### Code Backup
- Git repository (GitHub, GitLab, Bitbucket)
- Multiple branches for different environments
- Tag releases: `git tag v1.0.0`

#### File Storage Backup
- Regularly backup uploads folder
- Consider cloud storage (AWS S3, Cloudinary) for production
- Implement automated backup scripts

#### Recovery Procedures

**Database Recovery:**
1. Access MongoDB Atlas dashboard
2. Navigate to "Backup" tab
3. Select restore point
4. Choose restore method (download or restore to cluster)
5. Verify data after restoration

**Application Recovery:**
1. Identify the last working version
2. Checkout that version: `git checkout <commit-hash>`
3. Redeploy application
4. Verify functionality


### 6.2.11 Security Best Practices

#### Development Environment
- Never commit .env files to Git
- Use .gitignore to exclude sensitive files
- Use different credentials for dev and production
- Keep dependencies updated

#### Production Environment
- Use strong JWT secrets (minimum 32 characters)
- Enable HTTPS/SSL certificates
- Implement rate limiting to prevent DDoS
- Use environment variables for all secrets
- Regular security audits: `npm audit`
- Keep Node.js and dependencies updated
- Implement input sanitization
- Use helmet.js for security headers
- Enable MongoDB Atlas IP whitelisting
- Implement proper error handling (don't expose stack traces)

#### User Data Protection
- Hash passwords with bcrypt (never store plain text)
- Implement GDPR compliance if serving EU users
- Provide data export and deletion options
- Secure file uploads (validate file types and sizes)
- Implement CSRF protection for forms

### 6.2.12 Performance Optimization

#### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization (compress before upload)
- Lazy loading for images
- Minimize bundle size
- Use production build: `npm run build`
- Enable gzip compression
- Implement service workers for PWA

#### Backend Optimization
- Database indexing on frequently queried fields
- Implement caching (Redis recommended)
- Use pagination for large datasets
- Optimize database queries
- Implement connection pooling
- Use compression middleware
- Minimize middleware stack

#### Database Optimization
- Create indexes on User._id, Post.author, Product.business
- Use lean() for read-only queries
- Implement aggregation pipelines for complex queries
- Regular database maintenance
- Monitor slow queries

---

## 6.3 Deployment Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Browser   │  │   Mobile   │  │   Tablet   │            │
│  │  (Chrome)  │  │  (Safari)  │  │ (Firefox)  │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                    │
│        └────────────────┴────────────────┘                    │
│                         │                                     │
│                    HTTP/HTTPS                                 │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │
┌─────────────────────────┼─────────────────────────────────────┐
│                         │    PRESENTATION LAYER               │
│                    ┌────▼────┐                                │
│                    │  React  │                                │
│                    │   SPA   │                                │
│                    │ (Vite)  │                                │
│                    └────┬────┘                                │
│                         │                                     │
│                    REST API                                   │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │
┌─────────────────────────┼─────────────────────────────────────┐
│                         │    APPLICATION LAYER                │
│                    ┌────▼────┐                                │
│                    │ Express │                                │
│                    │  Server │                                │
│                    │ Node.js │                                │
│                    └────┬────┘                                │
│                         │                                     │
│         ┌───────────────┼───────────────┐                    │
│         │               │               │                    │
│    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐               │
│    │  Auth   │    │  Posts  │    │Products │               │
│    │ Module  │    │ Module  │    │ Module  │               │
│    └─────────┘    └─────────┘    └─────────┘               │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │
┌─────────────────────────┼─────────────────────────────────────┐
│                         │       DATA LAYER                    │
│                    ┌────▼────┐                                │
│                    │ Mongoose│                                │
│                    │   ODM   │                                │
│                    └────┬────┘                                │
│                         │                                     │
│                    ┌────▼────┐                                │
│                    │ MongoDB │                                │
│                    │  Atlas  │                                │
│                    │  Cloud  │                                │
│                    └─────────┘                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  UI Avatars  │  │   Cloudinary │  │    AWS S3    │        │
│  │     API      │  │   (Future)   │  │   (Future)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

---

## 6.4 Environment Configuration Summary

### Development Environment
| Component | Configuration |
|-----------|--------------|
| Frontend URL | http://localhost:5173 |
| Backend URL | http://localhost:5000 |
| Database | MongoDB Atlas (Cloud) |
| File Storage | Local (backend/uploads) |
| Hot Reload | Enabled (Vite HMR) |
| Debug Mode | Enabled |
| CORS | Localhost only |

### Production Environment
| Component | Configuration |
|-----------|--------------|
| Frontend URL | https://verity-app.vercel.app |
| Backend URL | https://verity-api.onrender.com |
| Database | MongoDB Atlas (Cloud) |
| File Storage | AWS S3 or Cloudinary |
| Hot Reload | Disabled |
| Debug Mode | Disabled |
| CORS | Production domain only |
| SSL/TLS | Enabled (HTTPS) |
| CDN | Enabled for static assets |

---

## 6.5 Conclusion

This deployment documentation provides comprehensive guidance for installing, configuring, and deploying the Verity social media platform. The application is designed with scalability, security, and maintainability in mind, making it suitable for both development and production environments.

Key takeaways:
- Modular architecture allows easy scaling
- Cloud-based database ensures reliability
- Multiple deployment options available
- Security best practices implemented
- Comprehensive error handling and monitoring
- Regular maintenance procedures defined

For additional support or questions, refer to the project README.md or contact the development team.
