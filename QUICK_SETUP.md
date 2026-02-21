# ⚡ Quick Setup (Using Shared Database)

## Prerequisites
- Node.js installed (https://nodejs.org/)
- Git installed

## Setup Steps

### 1. Clone the project
```bash
git clone <repository-url>
cd Verity
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Create `.env` file
Create a file named `.env` in the `backend` folder with this content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net/verity_fyp?retryWrites=true&w=majority
JWT_SECRET=verity_fyp_secret_key_2026_taimoor_khan_project
```

### 4. Start Backend
```bash
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### 5. Frontend Setup (New Terminal)
```bash
cd Verity_FYP
npm install
npm run dev
```

### 6. Open Browser
Go to: `http://localhost:5173`

---

## 🎯 Test Accounts

You can use these existing accounts:

**User Account:**
- Email: taimoor@gmail.com
- Password: (ask team member)

**Reviewer Account:**
- Email: ishaa@gmail.com  
- Password: (ask team member)

Or create your own account!

---

## 📊 View Database (Optional)

### Using MongoDB Compass:
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Open Compass
3. Paste this connection string:
   ```
   mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net/verity_fyp
   ```
4. Click "Connect"
5. You can now view all collections (Users, Posts, Reviews, etc.)

---

## ⚠️ Important Notes

- We're using a **shared database** - be careful with data changes
- Any posts/users you create will be visible to everyone
- Don't delete existing data without asking
- For testing, create your own test accounts

---

## 🆘 Issues?

**Backend won't start?**
- Make sure you copied the `.env` file correctly
- Check if port 5000 is available
- Run `npm install` again

**Frontend won't start?**
- Make sure backend is running first
- Run `npm install` again in Verity_FYP folder

**Can't connect to database?**
- Check your internet connection
- Verify the connection string in `.env` is correct

---

**That's it! You're ready to develop! 🚀**
