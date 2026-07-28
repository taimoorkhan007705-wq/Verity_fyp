import { API_BASE, API_URL } from './config.js'
import { useState, useEffect, lazy, Suspense } from 'react'
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
import Layout from './modules/shared/Layout'
import ReviewerLayout from './modules/shared/ReviewerLayout'
import { logout } from './services/api'
import { getActiveToken } from './services/roleSession'

// Lazy load heavy components - only load when needed
const CreatePost = lazy(() => import('./modules/post/CreatePost'))
const ReviewCenter = lazy(() => import('./modules/review/ReviewCenter'))
const ReviewerLeaderboard = lazy(() => import('./modules/review/ReviewerLeaderboard'))
const ReviewerManagement = lazy(() => import('./modules/admin/ReviewerManagement'))
const BusinessDashboard = lazy(() => import('./modules/business/BusinessDashboard'))
const Profile = lazy(() => import('./modules/profile/Profile'))
const EditProfile = lazy(() => import('./modules/profile/EditProfile'))
const Shopping = lazy(() => import('./modules/shopping/Shopping'))
const Connections = lazy(() => import('./modules/connections/Connections'))
const Messages = lazy(() => import('./modules/messages/Messages'))
const RejectedPosts = lazy(() => import('./modules/feed/RejectedPosts'))
const AdminDashboard = lazy(() => import('./modules/admin/AdminDashboard'))

// Loading spinner component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: '#14b8a6',
    fontSize: '1rem',
    fontWeight: '600'
  }}>
    ⏳ Loading...
  </div>
)

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
            <Route path="shopping" element={<Suspense fallback={<LoadingSpinner />}><Shopping /></Suspense>} />
            <Route path="create-post" element={<Suspense fallback={<LoadingSpinner />}><CreatePost /></Suspense>} />
            <Route path="connections" element={<Suspense fallback={<LoadingSpinner />}><Connections /></Suspense>} />
            <Route path="discover" element={<Suspense fallback={<LoadingSpinner />}><Connections /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
            <Route path="profile/edit" element={<Suspense fallback={<LoadingSpinner />}><EditProfile /></Suspense>} />
            <Route path="messages" element={<Suspense fallback={<LoadingSpinner />}><Messages /></Suspense>} />
            <Route path="messages/:userId" element={<Suspense fallback={<LoadingSpinner />}><Messages /></Suspense>} />
            <Route path="admin" element={<Suspense fallback={<LoadingSpinner />}><AdminDashboard /></Suspense>} />
            <Route path="rejected-posts" element={<Suspense fallback={<LoadingSpinner />}><RejectedPosts /></Suspense>} />
          </Route>
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      ) : user.role === 'Business' ? (
        <Routes>
          <Route path="/dashboard" element={<Suspense fallback={<LoadingSpinner />}><BusinessDashboard onLogout={handleLogout} /></Suspense>} />
          <Route path="/review-center" element={<Suspense fallback={<LoadingSpinner />}><ReviewCenter /></Suspense>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      ) : user.role === 'Reviewer' ? (
        <Routes>
          <Route path="/" element={<ReviewerLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/review-center" replace />} />
            <Route path="review-center" element={<Suspense fallback={<LoadingSpinner />}><ReviewCenter /></Suspense>} />
            <Route path="leaderboard" element={<Suspense fallback={<LoadingSpinner />}><ReviewerLeaderboard /></Suspense>} />
            <Route path="all-reviewers" element={<Suspense fallback={<LoadingSpinner />}><ReviewerManagement /></Suspense>} />
            <Route path="feed" element={<Feed />} />
            <Route path="shopping" element={<Suspense fallback={<LoadingSpinner />}><Shopping /></Suspense>} />
            <Route path="create-post" element={<Suspense fallback={<LoadingSpinner />}><CreatePost /></Suspense>} />
            <Route path="connections" element={<Suspense fallback={<LoadingSpinner />}><Connections /></Suspense>} />
            <Route path="discover" element={<Suspense fallback={<LoadingSpinner />}><Connections /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
            <Route path="profile/edit" element={<Suspense fallback={<LoadingSpinner />}><EditProfile /></Suspense>} />
            <Route path="messages" element={<Suspense fallback={<LoadingSpinner />}><Messages /></Suspense>} />
            <Route path="messages/:userId" element={<Suspense fallback={<LoadingSpinner />}><Messages /></Suspense>} />
          </Route>
          <Route path="*" element={<Navigate to="/review-center" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout onLogout={handleLogout} />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="shopping" element={<Suspense fallback={<LoadingSpinner />}><Shopping /></Suspense>} />
            <Route path="create-post" element={<Suspense fallback={<LoadingSpinner />}><CreatePost /></Suspense>} />
            <Route path="connections" element={<Suspense fallback={<LoadingSpinner />}><Connections /></Suspense>} />
            <Route path="discover" element={<Suspense fallback={<LoadingSpinner />}><Connections /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
            <Route path="profile/edit" element={<Suspense fallback={<LoadingSpinner />}><EditProfile /></Suspense>} />
            <Route path="messages" element={<Suspense fallback={<LoadingSpinner />}><Messages /></Suspense>} />
            <Route path="messages/:userId" element={<Suspense fallback={<LoadingSpinner />}><Messages /></Suspense>} />
            <Route path="rejected-posts" element={<Suspense fallback={<LoadingSpinner />}><RejectedPosts /></Suspense>} />
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