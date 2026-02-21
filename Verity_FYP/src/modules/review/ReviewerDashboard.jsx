import { useState, useEffect } from 'react'
import { Award, TrendingUp, ArrowLeft, CheckCircle, XCircle, Clock, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getReviewerStats } from '../../services/api'

function ReviewerDashboard() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    pendingReviews: 0,
    accuracy: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading stats...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/review-center')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontWeight: '600',
          color: '#64748b'
        }}
      >
        <ArrowLeft size={20} /> Back to Review Center
      </button>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '900', 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Award size={32} color="#14b8a6" />
          My Reviewer Dashboard
        </h1>
        <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
          Your performance and statistics as a content reviewer
        </p>
      </div>

      {/* Reviewer Profile Card */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '1rem', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <img 
            src={user?.avatar || 'https://i.pravatar.cc/150?img=1'} 
            alt={user?.fullName}
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%',
              border: '4px solid #14b8a6',
              objectFit: 'cover'
            }}
          />
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '900', 
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              {user?.fullName}
            </h2>
            <div style={{ 
              display: 'inline-block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#14b8a6',
              backgroundColor: '#d1fae5',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.5rem'
            }}>
              Content Reviewer
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Total Reviews */}
          <div style={{ 
            padding: '1.5rem',
            backgroundColor: '#f0fdfa',
            borderRadius: '0.75rem',
            border: '2px solid #14b8a6'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <Target size={20} color="#14b8a6" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                Total Reviews
              </span>
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900',
              color: '#14b8a6'
            }}>
              {stats.totalReviews}
            </div>
          </div>

          {/* Approved */}
          <div style={{ 
            padding: '1.5rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.75rem',
            border: '2px solid #10b981'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                Approved
              </span>
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900',
              color: '#10b981'
            }}>
              {stats.approvedReviews}
            </div>
          </div>

          {/* Rejected */}
          <div style={{ 
            padding: '1.5rem',
            backgroundColor: '#fef2f2',
            borderRadius: '0.75rem',
            border: '2px solid #ef4444'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <XCircle size={20} color="#ef4444" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                Rejected
              </span>
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900',
              color: '#ef4444'
            }}>
              {stats.rejectedReviews}
            </div>
          </div>

          {/* Pending */}
          <div style={{ 
            padding: '1.5rem',
            backgroundColor: '#fffbeb',
            borderRadius: '0.75rem',
            border: '2px solid #f59e0b'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <Clock size={20} color="#f59e0b" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                Pending
              </span>
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900',
              color: '#f59e0b'
            }}>
              {stats.pendingReviews}
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Card */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '1rem', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '900', 
          color: '#1f2937',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={24} color="#14b8a6" />
          Accuracy Score
        </h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: '900',
            color: getTrustScoreColor(stats.accuracy)
          }}>
            {stats.accuracy}%
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              width: '100%',
              height: '24px',
              backgroundColor: '#e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '0.75rem'
            }}>
              <div style={{ 
                width: `${stats.accuracy}%`,
                height: '100%',
                backgroundColor: getTrustScoreColor(stats.accuracy),
                transition: 'width 0.5s',
                borderRadius: '12px'
              }} />
            </div>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              margin: 0
            }}>
              Your approval rate based on {stats.totalReviews} total reviews
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        display: 'flex',
        gap: '2rem',
        justifyContent: 'center',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }} />
          90%+ Excellent
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#14b8a6', borderRadius: '2px' }} />
          80-89% Good
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '2px' }} />
          70-79% Fair
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
          Below 70% Needs Improvement
        </div>
      </div>
    </div>
  )
}

export default ReviewerDashboard
