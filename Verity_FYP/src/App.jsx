import { API_BASE, API_URL } from './config.js'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { ToastProvider, useToast } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { BadgeProvider } from './contexts/BadgeContext'
import Login from './modules/auth/Login'
import Signup from './modules/auth/Signup'
import ForgotPassword from './modules/auth/ForgotPassword'
import ForgotPasswordOTP from './modules/auth/ForgotPasswordOTP'
import ResetPassword from './modules/auth/ResetPassword'
import Feed from './modules/feed/Feed'
import CreatePost from './modules/post/CreatePost'
import ReviewCenter from './modules/review/ReviewCenter'
import ReviewerLeaderboard from './modules/review/ReviewerLeaderboard'
import ReviewerManagement from './modules/admin/ReviewerManagement'
import BusinessDashboard from './modules/business/BusinessDashboard'
import Profile from './modules/profile/Profile'
import EditProfile from './modules/profile/EditProfile'
import Shopping from './modules/shopping/Shopping'
import ProductDetail from './modules/shopping/ProductDetail'
import Cart from './modules/shopping/Cart'
import MyOrders from './modules/shopping/MyOrders'
import Layout from './modules/shared/Layout'
import ReviewerLayout from './modules/shared/ReviewerLayout'
import { logout } from './services/api'
import { getActiveToken } from './services/roleSession'
import Connections from './modules/connections/Connections'
import Messages from './modules/messages/Messages'
import AdminDashboard from './modules/admin/AdminDashboard'
import RejectedPosts from './modules/post/RejectedPosts'

// Wrapper component to use hooks inside the provider
function AppContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const toast = useToast()
  useEffect(() => {
    const APP_VERSION = '1.2.0'
    const storedVersion = localStorage.getItem('appVersion')
    if (storedVersion !== APP_VERSION) {
      console.log('Clearing cache due to version update...')
      const token = localStorage.getItem('token')
      const rememberMe = localStorage.getItem('rememberMe')

      localStorage.clear()
      sessionStorage.clear()

      if (token) localStorage.setItem('token', token)
      if (rememberMe) localStorage.setItem('rememberMe', rememberMe)

      localStorage.setItem('appVersion', APP_VERSION)
      window.location.reload(true)
      return
    }
    
    // Always start with login screen on app startup, but if a token exists,
    // verify the current profile with the backend before trusting localStorage.
    const fetchUserData = async () => {
      const token = getActiveToken()
      const hasToken = !!token
      const rememberMe = localStorage.getItem('rememberMe') === 'true'

      console.log('[App.jsx] Token check:')
      console.log('[App.jsx] - hasToken:', hasToken)
      console.log('[App.jsx] - token:', token ? 'exists (length: ' + token.length + ')' : 'null')
      console.log('[App.jsx] - rememberMe:', rememberMe)
      
      if (hasToken) {
        try {
          console.log('[App.jsx] Fetching user profile with token...')
          const response = await fetch(`${API_URL}/users/profiles`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          console.log('[App.jsx] Profile response status:', response.status)
          if (!response.ok) {
            throw new Error(`Token validation failed with status ${response.status}`)
          }

          const data = await response.json()
          console.log('[App.jsx - Fresh user data from backend:', data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
          setUser(data.user)
          
          // Check for password reset success
          if (searchParams.get('passwordResetSuccess') === 'true') {
            toast.success('Password changed successfully! 🎉', 'Welcome back!')
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname)
          }
          
          setLoading(false)
          return
        } catch (error) {
          console.error('[App.jsx] Failed to fetch fresh user data:', error)
          logout()
          setLoading(false)
          return
        }
      }


      if (rememberMe) {
        logout()
      } else {
        logout()
      }

      setLoading(false)
    }
    fetchUserData()
  }, [searchParams, toast])
  
  const handleLogout = () => {
    logout()
    setUser(null)
  }
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#14b8a6' }}>Loading...</div>
  }
  
  return (
    <>
      {!user ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Login />} />
        </Routes>
      ) : user.role === 'Admin' ? (
        <Routes>
          <Route path="/" element={<Layout onLogout={handleLogout} />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="shopping" element={<Shopping />} />
            <Route path="shopping/:productId" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="connections" element={<Connections />} />
            <Route path="discover" element={<Connections />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<Messages />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="rejected-posts" element={<RejectedPosts />} />
          </Route>
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      ) : user.role === 'Business' ? (
        <Routes>
          <Route path="/dashboard" element={<BusinessDashboard onLogout={handleLogout} />} />
          <Route path="/review-center" element={<ReviewCenter />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>      ) : user.role === 'Reviewer' ? (
        <Routes>
          <Route path="/" element={<ReviewerLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/review-center" replace />} />
            <Route path="review-center" element={<ReviewCenter />} />
            <Route path="leaderboard" element={<ReviewerLeaderboard />} />
            <Route path="all-reviewers" element={<ReviewerManagement />} />
            <Route path="feed" element={<Feed />} />
            <Route path="shopping" element={<Shopping />} />
            <Route path="shopping/:productId" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="connections" element={<Connections />} />
            <Route path="discover" element={<Connections />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<Messages />} />
          </Route>
          <Route path="*" element={<Navigate to="/review-center" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout onLogout={handleLogout} />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="shopping" element={<Shopping />} />
            <Route path="shopping/:productId" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="connections" element={<Connections />} />
            <Route path="discover" element={<Connections />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<Messages />} />
            <Route path="rejected-posts" element={<RejectedPosts />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BadgeProvider>
          <AppContent />
        </BadgeProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App