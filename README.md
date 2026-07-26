# Verity - AI-Powered Content Verification Platform

A comprehensive full-stack application for crowdsourced content verification using AI detection and community review systems. Users can post content, reviewers verify authenticity, and a leaderboard tracks reviewer performance.

## 🎯 Features

### User Features
- ✅ User authentication (signup/login/password reset)
- ✅ Create posts with image/video uploads
- ✅ Image cropping with zoom and rotate controls
- ✅ View feed with real-time updates
- ✅ View reviewer leaderboard with trust scores
- ✅ Story sharing (Snapchat-style)
- ✅ Messaging system
- ✅ User connections/followers
- ✅ Shopping marketplace

### Reviewer Features
- ✅ Review queue - posts awaiting verification
- ✅ Vote on posts (approve/reject with reasoning)
- ✅ Track personal stats and accuracy
- ✅ Reviewer leaderboard with rankings
- ✅ Real-time trust score updates
- ✅ Review history

### Admin Features
- ✅ User management (ban/unban/verify)
- ✅ Promote users to reviewers
- ✅ Dashboard with platform statistics
- ✅ Post moderation

### AI & Detection
- ✅ Fake content detection (Sightengine API)
- ✅ Category classification
- ✅ Automatic reviewer assignment
- ✅ Post verification workflow

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Styled Components
- **Icons**: Lucide React
- **State**: React Hooks + Context API
- **HTTP**: Fetch API
- **Image Processing**: Custom image cropper with zoom/rotate

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Email**: Ethereal (testing) / SMTP (production)
- **OCR**: Tesseract.js
- **AI Detection**: Sightengine API + Local AI fallback

### DevOps
- **Tunneling**: ngrok (for remote access)
- **Package Manager**: npm
- **Development**: Hot reload (Vite + Nodemon)

## 📋 Project Structure

```
Verity/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── modules/          # API route modules
│   ├── services/         # Business logic
│   ├── middleware/       # Auth, upload
│   ├── uploads/          # User uploads
│   └── server.js         # Express app
│
├── Verity_FYP/          # Frontend React app
│   ├── src/
│   │   ├── modules/      # Feature modules (auth, feed, review, etc.)
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API client
│   │   ├── contexts/     # Context providers
│   │   └── utils/        # Utilities
│   └── vite.config.js    # Vite configuration
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- npm or yarn
- Git
- ngrok (for remote access - optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Verity.git
cd Verity
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and API keys
```

3. **Frontend Setup**
```bash
cd Verity_FYP
npm install
cp .env.example .env
# Edit .env with your API URLs
```

### Environment Variables

**Backend** (`backend/.env`):
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/verity
PORT=5001
JWT_SECRET=your-secret-key
SIGHTENGINE_USER_ID=your-user-id
SIGHTENGINE_API_KEY=your-api-key
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

**Frontend** (`Verity_FYP/.env`):
```
VITE_API_URL=/api
VITE_API_BASE=http://localhost:5173

# For remote access (ngrok):
VITE_API_URL=https://your-ngrok-url.ngrok-free.dev/api
VITE_API_BASE=https://your-ngrok-url.ngrok-free.dev
```

### Running the Project

**Terminal 1 - Frontend:**
```bash
cd Verity_FYP
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
PORT=5001 npm run dev
# Runs on http://localhost:5001
```

**Terminal 3 - ngrok (optional for remote access):**
```bash
ngrok http 5001
# Creates tunnel to backend
```

## 📊 Voting & Trust Score System

### How Voting Works
1. User posts content → Post assigned to 3 reviewers
2. Reviewer votes (approve/reject) → Vote counted
3. Second reviewer votes → Decision made (if 2+ same votes)
4. Trust scores updated based on accuracy

### Trust Score Calculation
- **Correct Vote**: +5 trust points
- **Incorrect Vote**: -2 trust points
- **Initial Score**: 50
- **Range**: 0-100

### Vote Scenarios
```
Post has 2+ APPROVE votes → Post goes LIVE
├─ Reviewers who voted approve: +5 trust
└─ Reviewers who voted reject: -2 trust

Post has 2+ REJECT votes → Post is REJECTED
├─ Reviewers who voted reject: +5 trust
└─ Reviewers who voted approve: -2 trust
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset

### Posts
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post details

### Reviewer
- `GET /api/reviewer/queue` - Get review queue
- `POST /api/reviewer/posts/:id/vote` - Submit vote
- `GET /api/reviewer/stats` - Get reviewer stats

### Admin
- `GET /api/admin/reviewers/leaderboard` - Get reviewer rankings
- `GET /api/admin/stats` - Get platform statistics

## 🎓 User Roles

### Regular User
- Post content
- View feed
- View leaderboard
- Send messages
- Follow/connect with others

### Reviewer
- All user features +
- Vote on posts in review queue
- Track personal accuracy
- View trust score in leaderboard
- Review history

### Admin
- All features +
- Manage users (ban/unban)
- Promote users to reviewers
- Verify user accounts
- View platform statistics

## 📱 Responsive Design
- Desktop: Full feature experience
- Tablet: Optimized layout
- Mobile: Touch-friendly interface with bottom navigation

## 🔒 Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting on auth routes
- NoSQL injection prevention with mongo-sanitize
- Helmet.js for security headers

## 📈 Performance Optimizations
- Image compression and cropping before upload
- Vite for fast frontend bundling
- MongoDB indexing on frequently queried fields
- Lazy loading of components
- Efficient API call caching

## 🧪 Testing
```bash
# Frontend
cd Verity_FYP
npm run test

# Backend
cd backend
npm run test
```

## 📝 Database Schema Highlights

### Users
- Authentication credentials
- Profile information (avatar, bio)
- Social stats (followers, posts)
- Trust and security settings

### Posts
- Content and media
- Author reference
- Reviewer assignments
- Voting data
- Verification status

### Reviewers
- Extended user profile
- Review statistics (completed, accuracy)
- Trust score
- Expertise levels
- Activity tracking

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see LICENSE file for details.

## 🙋 Support
For issues and questions, please create an issue on GitHub or contact the development team.

## 👥 Authors
- **Taimoor Khan** - Full Stack Developer

## 🎉 Acknowledgments
- Sightengine for AI detection API
- MongoDB for database
- React community for libraries
- All contributors and testers

## 📞 Contact
- Email: taimoorkhan007705@gmail.com
- GitHub: [Your GitHub Profile]

---

**Last Updated**: July 26, 2026
**Version**: 1.2.0
