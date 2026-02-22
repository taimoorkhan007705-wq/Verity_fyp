import { useState, useEffect } from 'react'
import { Award, ChevronDown, ChevronUp } from 'lucide-react'
import { getCurrentUser, getReviewerStats } from '../../services/api'
import {
  RightSidebarContainer,
  RightSidebarTitle,
  RightSidebarContent,
} from './RightSidebar.styled'
function RightSidebar() {
  const user = getCurrentUser()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [stats, setStats] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    pendingReviews: 0,
    accuracy: 0
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (user?.role === 'Reviewer') {
      loadStats()
    } else {
      setLoading(false)
    }
  }, [user])
  const loadStats = async () => {
    try {
      const response = await getReviewerStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }
  const getTrustScoreColor = (score) => {
    if (score >= 90) return '#10b981'
    if (score >= 80) return '#14b8a6'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }
  return (
    <RightSidebarContainer>
      {}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#14b8a6',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0d9488'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#14b8a6'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 184, 166, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} />
            Reviewer Leaderboard
          </div>
          {showLeaderboard ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {}
        {showLeaderboard && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            border: '2px solid #14b8a6',
            padding: '1.5rem'
          }}>
            {}
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#64748b',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Top Reviewers
            </div>
            {}
            {user?.role === 'Reviewer' && !loading && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.25rem',
                backgroundColor: '#f0fdfa',
                borderRadius: '0.75rem',
                border: '2px solid #14b8a6'
              }}>
                {}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  {}
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}>
                    1st
                  </div>
                  {}
                  <img 
                    src={
                      user?.avatar?.startsWith('http') 
                        ? user.avatar 
                        : user?.avatar?.startsWith('/uploads')
                        ? `http://localhost:5000${user.avatar}`
                        : 'https://via.placeholder.com/50'
                    }
                    alt={user?.fullName}
                    style={{
                      width: '55px',
                      height: '55px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #14b8a6',
                      flexShrink: 0
                    }}
                  />
                  {}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user?.fullName}
                    </div>
                  </div>
                </div>
                {}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #99f6e4'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: getTrustScoreColor(stats.accuracy),
                    lineHeight: 1
                  }}>
                    {stats.accuracy}%
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Trust Score
                  </div>
                </div>
              </div>
            )}
            {}
            <div style={{
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.875rem',
              marginTop: '1rem',
              padding: '0.5rem'
            }}>
              More reviewers coming soon
            </div>
          </div>
        )}
      </div>
    </RightSidebarContainer>
  )
}
export default RightSidebar
