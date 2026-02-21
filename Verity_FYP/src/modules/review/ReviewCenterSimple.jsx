import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, Award, TrendingUp, LayoutDashboard, FileCheck, History, LogOut } from 'lucide-react'
import { getCurrentUser, getPendingReviews, submitReview, logout } from '../../services/api'

function ReviewCenterSimple() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [rejectionNotes, setRejectionNotes] = useState('')
  const [activeTab, setActiveTab] = useState('pending')
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    accuracy: 95
  })

  useEffect(() => {
    loadPendingReviews()
  }, [])

  const loadPendingReviews = async () => {
    try {
      const response = await getPendingReviews()
      setPosts(response.posts)
      setStats(prev => ({ ...prev, pending: response.posts.length }))
    } catch (error) {
      console.error('Failed to load pending reviews:', error)
      alert('Failed to load pending reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    window.location.reload()
  }

  const handleApprove = async (post) => {
    try {
      await submitReview({
        postId: post._id,
        verdict: 'verified',
        notes: 'Post approved after manual review',
        confidence: 90,
        sources: [],
        tags: ['approved']
      })
      
      setPosts(prev => prev.filter(p => p._id !== post._id))
      setStats(prev => ({ ...prev, pending: prev.pending - 1, reviewed: prev.reviewed + 1 }))
      alert('Post approved! It will now appear in the feed.')
    } catch (error) {
      alert(`Failed to approve post: ${error.message}`)
    }
  }

  const handleReject = (post) => {
    setSelectedPost(post)
    setShowRejectModal(true)
  }

  const submitRejection = async () => {
    if (!rejectionNotes.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      await submitReview({
        postId: selectedPost._id,
        verdict: 'false',
        notes: rejectionNotes,
        confidence: 85,
        sources: [],
        tags: ['rejected']
      })

      setPosts(prev => prev.filter(p => p._id !== selectedPost._id))
      setStats(prev => ({ ...prev, pending: prev.pending - 1, reviewed: prev.reviewed + 1 }))
      setShowRejectModal(false)
      setRejectionNotes('')
      setSelectedPost(null)
      
      alert('Post rejected successfully!')
    } catch (error) {
      alert(`Failed to reject post: ${error.message}`)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading pending reviews...</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        minWidth: '280px',
        backgroundColor: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
            <div style={{ backgroundColor: '#14b8a6', padding: '8px', borderRadius: '10px' }}>
              <FileCheck size={24} color="white" />
            </div>
            <span style={{ fontWeight: '900', fontSize: '20px' }}>VERITY REVIEW</span>
          </div>

          {/* Stats Cards */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>PENDING REVIEWS</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#14b8a6' }}>{stats.pending}</div>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>REVIEWED TODAY</div>
              <div style={{ fontSize: '28px', fontWeight: '900' }}>{stats.reviewed}</div>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>ACCURACY</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981' }}>{stats.accuracy}%</div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1 }}>
            <div 
              onClick={() => setActiveTab('pending')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '5px',
                backgroundColor: activeTab === 'pending' ? '#14b8a6' : 'transparent',
                color: activeTab === 'pending' ? 'white' : '#94a3b8',
                fontWeight: '700'
              }}
            >
              <Clock size={20} /> Pending Reviews
            </div>
            <div 
              onClick={() => navigate('/reviewer-leaderboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '5px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                fontWeight: '700'
              }}
            >
              <Award size={20} /> Leaderboard
            </div>
            <div 
              onClick={() => navigate('/feed')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '5px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                fontWeight: '700'
              }}
            >
              <LayoutDashboard size={20} /> Feed
            </div>
          </nav>
        </div>

        {/* Logout Button */}
        <div 
          onClick={handleLogout}
          style={{
            background: '#f87171',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 20px',
            borderRadius: '10px',
            transition: 'all 0.2s',
            marginTop: '20px'
          }}
        >
          <LogOut size={20} /> Log Out
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>Pending Reviews</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>
              Review posts submitted by users to maintain content quality
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <div style={{ maxWidth: '1200px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.2rem', color: '#64748b' }}>No pending posts to review</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {posts.map((post) => (
              <div key={post._id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img 
                    src={post.author?.avatar || 'https://via.placeholder.com/50'} 
                    alt={post.author?.fullName}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{post.author?.fullName}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      @{post.author?.email?.split('@')[0]} • {formatTime(post.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: 0, lineHeight: '1.6' }}>{post.content}</p>
                </div>

                {/* Post Media */}
                {post.media && post.media.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    {post.media.map((item, idx) => (
                      item.type === 'image' ? (
                        <img 
                          key={idx}
                          src={`http://localhost:5000${item.url}`} 
                          alt="Post media"
                          style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }}
                        />
                      ) : (
                        <video key={idx} controls style={{ width: '100%', borderRadius: '8px' }}>
                          <source src={`http://localhost:5000${item.url}`} type="video/mp4" />
                        </video>
                      )
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => handleApprove(post)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <CheckCircle size={20} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(post)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <XCircle size={20} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '900' }}>Reject Post</h2>
            <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>
              Please provide a reason for rejecting this post:
            </p>
            <textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Enter rejection reason..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionNotes('')
                  setSelectedPost(null)
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#e2e8f0',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewCenterSimple
