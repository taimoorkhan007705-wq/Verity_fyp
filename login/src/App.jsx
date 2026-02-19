import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from "./components/pages/login"
import Feed from "./components/pages/Feed"
import Messages from "./components/pages/Messages"
import Connections from "./components/pages/Connections"
import ChatBox from "./components/pages/ChatBox"
import Discover from "./components/pages/Discover"
import CreatePost from "./components/pages/CreatePost"
import Profile from "./components/pages/Profile"
import ReviewCenter from "./components/pages/ReviewCenter"
import Layout from "./components/pages/layout"  
import BusinessDashboard from "./components/pages/BusinessDashboard"

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userRole: null
  });

  const handleLogin = (role) => {
    setAuth({
      isAuthenticated: true,
      userRole: role
    });
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, userRole: null });
  };

  // 1. If NOT authenticated, ONLY the Login route exists.
  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {/* If user tries to go anywhere else, force them to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. If BUSINESS: Provide exclusive routes.
  if (auth.userRole === "Business") {
    return (
      <Routes>
        <Route path="/dashboard" element={<BusinessDashboard onLogout={handleLogout} />} />
        <Route path="/review-center" element={<ReviewCenter />} />
        {/* Redirect any other path to /dashboard for business */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  // 3. If USER/Other: Provide standard Layout routes.
  return (
    <Routes>
      <Route path="/review-center" element={<ReviewCenter />} />
      
      {/* WRAPPER ROUTE: All children here are relative to "/" */}
      <Route path="/" element={<Layout onLogout={handleLogout} />}>
        {/* This matches exactly "localhost:3000/" */}
        <Route index element={<Feed />} /> 
        
        {/* These match "localhost:3000/feed", etc. */}
        <Route path="feed" element={<Feed />} />
        <Route path="connections" element={<Connections />} />
        <Route path="discover" element={<Discover />} />
        <Route path="create-post" element={<CreatePost />} />
        
        {/* Profile Routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:profileId" element={<Profile />} />

        {/* Nested Messages Routes */}
        <Route path="messages" element={<Messages />}>
          <Route path=":userId" element={<ChatBox />} />
        </Route>

        {/* If they are a User but try to hit /dashboard, send them home */}
        <Route path="dashboard" element={<Navigate to="/" replace />} />
      </Route>

      {/* CATCH-ALL for logged-in users */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;