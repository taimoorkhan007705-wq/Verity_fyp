import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
  const user = true;
  const userRole = "Business"; // Change this to "User" to test the normal feed

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Catch-all for non-logged in users */}
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Review Center - Standalone (no main layout) */}
      <Route path="/review-center" element={<ReviewCenter />} />
      
      {/* Main App Routes with Layout */}
      <Route path="/" element={<Layout />}>
        
        {/* 1. Dynamic Index: Shows Dashboard to Business, Feed to others */}
        <Route 
          index 
          element={userRole === "Business" ? <BusinessDashboard /> : <Feed />} 
        />
        
        {/* 2. Explicit Dashboard Route (Matches the sidebar link) */}
        <Route path="dashboard" element={<BusinessDashboard />} />

        <Route path="feed" element={<Feed />} />
        
        <Route path="messages" element={<Messages />}>
          <Route path=":userId" element={<ChatBox />} />
        </Route>
        
        <Route path="connections" element={<Connections />} />
        <Route path="discover" element={<Discover />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:profileId" element={<Profile />} />
        <Route path="create-post" element={<CreatePost />} />
      </Route>
    </Routes>
  );
}

export default App;