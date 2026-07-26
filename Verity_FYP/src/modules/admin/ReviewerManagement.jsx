import { useState, useEffect } from 'react'
import { Award, RefreshCw, Trash2 } from 'lucide-react'
import { getReviewerLeaderboard } from '../../services/api'

function ReviewerManagement() {
  const [reviewers, setReviewers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAllReviewers()
  }, [])

  const loadAllReviewers = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching reviewers...')
      const response = await getReviewerLeaderboard()
      console.log('Response:', response)
      
      setReviewers(response.leaderboard || [])
    } catch (err) {
      console.error('Error loading reviewers:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Award size={32} color="#14b8a6" />
            <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>All Reviewers</h1>
          </div>
          <button 
            onClick={loadAllReviewers}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#14b8a6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1
            }}
          >
            <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#14b8a6' }}>
            {reviewers.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
            Total Reviewers
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            fontWeight: '500'
          }}>
            ❌ Error: {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            color: '#64748b',
            fontWeight: '600'
          }}>
            Loading reviewers...
          </div>
        )}

        {/* Table */}
        {!loading && reviewers.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            color: '#94a3b8',
            fontWeight: '600'
          }}>
            No reviewers found
          </div>
        )}

        {!loading && reviewers.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f0fdfa', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#1f2937' }}>Rank</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#1f2937' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#1f2937' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1f2937' }}>Trust Score</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1f2937' }}>Reviews</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1f2937' }}>Accuracy</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1f2937' }}>Approved</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1f2937' }}>Rejected</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1f2937' }}>Expertise</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1f2937' }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {reviewers.map((reviewer, idx) => (
                  <tr 
                    key={reviewer.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdfa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc'}
                  >
                    <td style={{ padding: '1rem', fontWeight: '900', color: '#14b8a6' }}>#{reviewer.rank}</td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937' }}>{reviewer.fullName}</td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>{reviewer.email}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#14b8a6' }}>{reviewer.trustScore}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#1f2937' }}>{reviewer.reviewsCompleted}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#10b981' }}>{reviewer.accuracy.toFixed(1)}%</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#059669' }}>{reviewer.approvedCount}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#dc2626' }}>{reviewer.rejectedCount}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                      <span style={{
                        backgroundColor: reviewer.expertise === 'Expert' ? '#d1fae5' : reviewer.expertise === 'Senior' ? '#dbeafe' : '#fef3c7',
                        color: reviewer.expertise === 'Expert' ? '#059669' : reviewer.expertise === 'Senior' ? '#0284c7' : '#b45309',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontWeight: '700'
                      }}>
                        {reviewer.expertise}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: reviewer.isActive ? '#d1fae5' : '#fee2e2',
                        color: reviewer.isActive ? '#059669' : '#dc2626',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontWeight: '700',
                        fontSize: '0.875rem'
                      }}>
                        {reviewer.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Debug Info */}
        <div style={{
          marginTop: '2rem',
          backgroundColor: '#f0f9ff',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #0284c7',
          fontSize: '0.875rem',
          color: '#0c4a6e',
          fontFamily: 'monospace'
        }}>
          <strong>Debug Info:</strong>
          <pre style={{ margin: '0.5rem 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{JSON.stringify({
  totalReviewers: reviewers.length,
  endpoint: '/api/admin/reviewers/leaderboard',
  timestamp: new Date().toLocaleString(),
  reviewerIds: reviewers.map(r => ({ name: r.fullName, id: r.id.toString() }))
}, null, 2)}
          </pre>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default ReviewerManagement
