# Verity - Social Media Platform with Content Verification

A modern social media platform built with React and Node.js that features content verification, product marketplace, and role-based access control.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Content Verification**: Posts reviewed by verified reviewers before going live
- **Product Marketplace**: Business accounts can list and sell products
- **Stories**: 24-hour temporary content sharing
- **Role-Based Access**: Three user types (User, Reviewer, Business)
- **Real-time Messaging**: Product inquiries and customer communication

## Tech Stack

**Frontend:**
- React 18
- Vite
- Styled Components
- React Router
- Lucide Icons

**Backend:**
- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer (File uploads)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account

### Setup

1. Clone the repository
```bash
git clone https://github.com/taimoorkhan007705-wq/Verity_fyp.git
cd Verity_fyp
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../Verity_FYP
npm install
```

4. Configure environment variables
Create `.env` file in backend folder:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the backend server
```bash
cd backend
npm start
```

6. Start the frontend development server
```bash
cd Verity_FYP
npm run dev
```

7. Open http://localhost:5173 in your browser

## Project Structure

```
Verity_fyp/
├── backend/              # Node.js backend
│   ├── models/          # MongoDB models
│   ├── modules/         # API controllers & routes
│   ├── middleware/      # Auth & upload middleware
│   └── server.js        # Express server
├── Verity_FYP/          # React frontend
│   └── src/
│       ├── modules/     # Feature components
│       ├── services/    # API services
│       └── App.jsx      # Main app component
└── README.md
```

## User Roles

- **User**: Create posts, shop products, view content
- **Reviewer**: Review and approve/reject posts
- **Business**: Create products, manage inventory, view analytics

## License

MIT License
