import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './modules/auth/Login'
import Signup from './modules/auth/Signup'
import Feed from './modules/feed/Feed'
import CreatePost from './modules/post/CreatePost'
import ReviewCenter from './modules/review/ReviewCenter'
import BusinessDashboard from './modules/business/BusinessDashboard'
import Profile from './modules/profile/Profile'
import EditProfile from './modules/profile/EditProfile'
import Shopping from './modules/shopping/Shopping'
import Layout from './modules/shared/Layout'
import { isAuthenticated, getCurrentUser, logout } from './services/api'
import Discover from './modules/discover/Discover'
import Connections from './modules/connections/Connections'
import Messages from './modules/messages/Messages'
import AdminDashboard from './modules/admin/AdminDashboard'
import RejectedPosts from './modules/post/RejectedPosts'
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const APP_VERSION = '1.2.0'
    const storedVersion = localStorage.getItem('appVersion')
    if (storedVersion !== APP_VERSION) {
      console.log('Clearing cache due to version update...')
      localStorage.clear()
      sessionStorage.clear()
      localStorage.setItem('appVersion', APP_VERSION)
      window.location.reload(true)
      return
    }
    const fetchUserData = async () => {
      if (isAuthenticated()) {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:5000/api/users/profiles', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (response.ok) {
            const data = await response.json()
            console.log('App.jsx - Fresh user data from backend:', data.user)
            localStorage.setItem('user', JSON.stringify(data.user))
            setUser(data.user)
          } else {
            setUser(getCurrentUser())
          }
        } catch (error) {
          console.error('Failed to fetch fresh user data:', error)
          setUser(getCurrentUser())
        }
      }
      setLoading(false)
    }
    fetchUserData()
  }, [])
  const handleLogout = () => {
    logout()
    setUser(null)
  }
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#14b8a6' }}>Loading...</div>
  }
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }
  if (user.role === 'Admin') {
    return (
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="shopping" element={<Shopping />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Messages />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="rejected-posts" element={<RejectedPosts />} />
        </Route>
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    )
  }

  if (user.role === 'Business') {
    return (
      <Routes>
        <Route path="/dashboard" element={<BusinessDashboard onLogout={handleLogout} />} />
        <Route path="/review-center" element={<ReviewCenter />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    )
  }
  if (user.role === 'Reviewer') {
    return (
      <Routes>
        <Route path="/review-center" element={<ReviewCenter />} />
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Navigate to="/review-center" replace />} />
          <Route path="feed" element={<Feed />} />
          <Route path="shopping" element={<Shopping />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Messages />} />
          <Route path="rejected-posts" element={<RejectedPosts />} />
        </Route>
        <Route path="*" element={<Navigate to="/review-center" replace />} />
      </Routes>
    )
  }
  return (
    <Routes>
      <Route path="/" element={<Layout onLogout={handleLogout} />}>
        <Route index element={<Feed />} />
        <Route path="feed" element={<Feed />} />
        <Route path="shopping" element={<Shopping />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="connections" element={<Connections />} />
        <Route path="discover" element={<Discover />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<Messages />} />
        <Route path="rejected-posts" element={<RejectedPosts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default App
