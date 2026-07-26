import { API_BASE } from '../../config.js'
import { useState, useEffect } from 'react'
import { Award, ChevronDown, ChevronUp, Medal } from 'lucide-react'
import { getCurrentUser, getReviewerStats, getReviewerLeaderboard } from '../../services/api'
import Avatar from '../../components/Avatar/Avatar'
import { mediaUrl } from '../../config.js'
import {
  RightSidebarContainer,
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
  const [leaderboard, setLeaderboard] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

  useEffect(() => {
    // Load leaderboard for all users (not just reviewers)
    loadLeaderboard()
    
    // Auto-refresh every 30 seconds to show updated trust scores
    const interval = setInterval(() => {
      console.log('[RightSidebar] Auto-refreshing leaderboard...')
      loadLeaderboard()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [user])

  const loadStats = async () => {
    try {
      const response = await getReviewerStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const loadLeaderboard = async () => {
    try {
      console.log('[RightSidebar] Loading leaderboard...')
      const response = await getReviewerLeaderboard()
      console.log('[RightSidebar] Response:', response)
      
      if (response?.leaderboard && Array.isArray(response.leaderboard)) {
        console.log('[RightSidebar] Found', response.leaderboard.length, 'reviewers')
        setLeaderboard(response.leaderboard)
      } else {
        console.warn('[RightSidebar] No leaderboard data found')
        setLeaderboard([])
      }
    } catch (error) {
      console.error('[RightSidebar] Failed to load leaderboard:', error)
      setLeaderboard([])
    } finally {
      setLoadingLeaderboard(false)
    }
  }

  const handleLeaderboardClick = () => {
    // Just toggle - leaderboard is already loaded on mount
    setShowLeaderboard(!showLeaderboard)
  }

  const getTrustScoreColor = (score) => {
    if (score >= 90) return '#10b981'
    if (score >= 80) return '#14b8a6'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <RightSidebarContainer>
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleLeaderboardClick}
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
            boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)',
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
            padding: '1.5rem',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#64748b',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Top Reviewers ({leaderboard.length})
            </div>

            {/* Current User */}
            {user?.role === 'Reviewer' && !loadingStats && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.25rem',
                backgroundColor: '#f0fdfa',
                borderRadius: '0.75rem',
                border: '2px solid #14b8a6',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
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
                    ⭐
                  </div>
                  <img 
                    src={
                      user?.avatar?.startsWith('http') 
                        ? user.avatar 
                        : user?.avatar?.startsWith('/uploads')
                        ? `${API_BASE}${user.avatar}`
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user?.fullName} (You)
                    </div>
                  </div>
                </div>
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

            {/* Leaderboard List */}
            {leaderboard.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leaderboard.slice(0, 5).map((reviewer, idx) => (
                  <div
                    key={reviewer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0fdfa'
                      e.currentTarget.style.borderColor = '#14b8a6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '900',
                      minWidth: '30px'
                    }}>
                      {getRankBadge(reviewer.rank)}
                    </div>
                    <Avatar
                      src={reviewer.avatar ? mediaUrl(reviewer.avatar) : undefined}
                      name={reviewer.fullName}
                      alt={reviewer.fullName}
                      size={32}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {reviewer.fullName}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#64748b'
                      }}>
                        Score: {reviewer.trustScore}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: getTrustScoreColor(reviewer.trustScore),
                      textAlign: 'right'
                    }}>
                      {reviewer.reviewsCompleted} reviews
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.875rem',
                padding: '1rem'
              }}>
                {loadingLeaderboard ? '⏳ Loading reviewers...' : '📊 No reviewers yet'}
              </div>
            )}

            {leaderboard.length > 5 && (
              <div style={{
                textAlign: 'center',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                Showing top 5 of {leaderboard.length} reviewers · <a href="/leaderboard" style={{ color: '#14b8a6', textDecoration: 'none', fontWeight: '600' }}>View all</a>
              </div>
            )}
          </div>
        )}
      </div>
    </RightSidebarContainer>
  )
}
export default RightSidebar
