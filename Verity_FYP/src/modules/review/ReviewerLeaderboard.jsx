import { useState, useEffect } from 'react'
import { Award, Medal, TrendingUp, Target, CheckCircle, XCircle } from 'lucide-react'
import { getReviewerLeaderboard } from '../../services/api'
import { mediaUrl } from '../../config.js'
import Avatar from '../../components/Avatar/Avatar'
import {
  LeaderboardContainer,
  HeaderSection,
  HeaderTitle,
  HeaderIcon,
  FilterBar,
  FilterButton,
  LeaderboardGrid,
  LeaderboardCard,
  RankBadge,
  ReviewerHeader,
  ReviewerInfo,
  ReviewerDetails,
  ReviewerName,
  ReviewerRole,
  ScoreSection,
  ScoreBadge,
  ScoreValue,
  ScoreLabel,
  StatsGrid,
  StatItem,
  StatIcon,
  StatValue,
  StatLabel,
  SpecializationTag,
  EmptyState,
  LoadingState,
} from './ReviewerLeaderboard.styled'

function ReviewerLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('trust') // trust, reviews, accuracy
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    console.log('[ReviewerLeaderboard] ===== COMPONENT MOUNTED =====')
    loadLeaderboard()
    return () => {
      console.log('[ReviewerLeaderboard] ===== COMPONENT UNMOUNTED =====')
    }
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      console.log('[ReviewerLeaderboard] Loading leaderboard...')
      const response = await getReviewerLeaderboard()
      
      const debugData = {
        responseReceived: true,
        responseType: typeof response,
        isArray: Array.isArray(response),
        hasLeaderboard: !!response?.leaderboard,
        leaderboardType: typeof response?.leaderboard,
        leaderboardIsArray: Array.isArray(response?.leaderboard),
        leaderboardLength: response?.leaderboard?.length || 0,
        total: response?.total,
        keys: Object.keys(response || {}),
        timestamp: new Date().toISOString()
      }
      
      setDebugInfo(debugData)
      console.log('[ReviewerLeaderboard] === DEBUG DATA ===')
      console.log(debugData)
      console.log('[ReviewerLeaderboard] === FULL RESPONSE ===')
      console.log(JSON.stringify(response, null, 2))
      
      if (response && response.leaderboard && Array.isArray(response.leaderboard) && response.leaderboard.length > 0) {
        console.log('[ReviewerLeaderboard] ✅ SUCCESS: Found', response.leaderboard.length, 'reviewers')
        setLeaderboard(response.leaderboard)
      } else {
        console.warn('[ReviewerLeaderboard] ⚠️ WARNING: No leaderboard data found')
        console.warn('[ReviewerLeaderboard] Response structure:', { 
          hasLeaderboard: !!response?.leaderboard,
          isArray: Array.isArray(response?.leaderboard),
          length: response?.leaderboard?.length
        })
        setLeaderboard([])
      }
    } catch (error) {
      console.error('[ReviewerLeaderboard] ❌ ERROR: Failed to load:', error.message)
      setDebugInfo(prev => ({
        ...prev,
        error: error.message,
        errorType: error.constructor.name
      }))
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  const getSortedLeaderboard = () => {
    const sorted = [...leaderboard]
    
    switch (sortBy) {
      case 'reviews':
        return sorted.sort((a, b) => b.reviewsCompleted - a.reviewsCompleted)
      case 'accuracy':
        return sorted.sort((a, b) => b.accuracy - a.accuracy)
      case 'trust':
      default:
        return sorted.sort((a, b) => b.trustScore - a.trustScore)
    }
  }

  const getTrustScoreColor = (score) => {
    if (score >= 90) return '#10b981' // Green
    if (score >= 75) return '#14b8a6' // Teal
    if (score >= 60) return '#f59e0b' // Amber
    return '#ef4444' // Red
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal size={24} color="#fbbf24" />
    if (rank === 2) return <Medal size={24} color="#d1d5db" />
    if (rank === 3) return <Medal size={24} color="#f97316" />
    return <Award size={24} color="#64748b" />
  }

  const sortedLeaderboard = getSortedLeaderboard()

  if (loading) {
    return (
      <LoadingState>
        <p>Loading reviewer leaderboard...</p>
        <small style={{ marginTop: '1rem', fontSize: '0.8rem' }}>Check console (F12) for logs</small>
      </LoadingState>
    )
  }

  return (
    <LeaderboardContainer>
      {/* Header */}
      <HeaderSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <HeaderIcon>
            <Award size={32} color="#14b8a6" />
          </HeaderIcon>
          <div>
            <HeaderTitle>Reviewer Leaderboard</HeaderTitle>
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
              Top performing content reviewers on the platform
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#14b8a6' }}>
            {leaderboard.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
            Active Reviewers
          </div>
        </div>
      </HeaderSection>

      {/* Sort Buttons */}
      <FilterBar>
        <FilterButton 
          $isActive={sortBy === 'trust'}
          onClick={() => setSortBy('trust')}
        >
          <TrendingUp size={18} /> Trust Score
        </FilterButton>
        <FilterButton 
          $isActive={sortBy === 'reviews'}
          onClick={() => setSortBy('reviews')}
        >
          <Target size={18} /> Reviews Completed
        </FilterButton>
        <FilterButton 
          $isActive={sortBy === 'accuracy'}
          onClick={() => setSortBy('accuracy')}
        >
          <CheckCircle size={18} /> Accuracy
        </FilterButton>
        <button
          onClick={loadLeaderboard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '2px solid #14b8a6',
            backgroundColor: 'white',
            color: '#14b8a6',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginLeft: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#14b8a6'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.color = '#14b8a6'
          }}
        >
          🔄 Refresh
        </button>
      </FilterBar>

      {/* Leaderboard */}
      {sortedLeaderboard.length === 0 ? (
        <EmptyState>
          <Award size={48} color="#cbd5e1" />
          <p>No reviewers yet</p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Reviewers will appear here once they are added to the system.
            <br/>
            <br/>
            📊 API Endpoint: GET /api/admin/reviewers/leaderboard
            <br/>
            Total reviewers in state: {leaderboard.length}
            <br/>
            Loading state: {loading}
            <br/>
            <button 
              onClick={loadLeaderboard}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#14b8a6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🔄 Retry Loading
            </button>
            <br/>
            <small style={{ marginTop: '0.5rem', display: 'block', color: '#64748b' }}>
              Check browser console (F12) for API call logs
            </small>
            <hr style={{ margin: '1rem 0', borderColor: '#cbd5e1' }} />
            <details style={{ textAlign: 'left', fontSize: '0.7rem', color: '#475569', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '0.25rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>Debug Info</summary>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </details>
          </p>
        </EmptyState>
      ) : (
        <LeaderboardGrid>
          {sortedLeaderboard.map((reviewer, index) => (
            <LeaderboardCard key={reviewer.id}>
              {/* Rank Badge */}
              <RankBadge $rank={reviewer.rank}>
                {getRankIcon(reviewer.rank)}
                <span style={{ marginLeft: '0.5rem', fontWeight: '900', fontSize: '1.25rem' }}>
                  #{reviewer.rank}
                </span>
              </RankBadge>

              {/* Reviewer Header */}
              <ReviewerHeader>
                <Avatar
                  src={reviewer.avatar ? mediaUrl(reviewer.avatar) : undefined}
                  name={reviewer.fullName}
                  alt={reviewer.fullName}
                  size={56}
                />
                <ReviewerDetails>
                  <ReviewerName>{reviewer.fullName}</ReviewerName>
                  <ReviewerRole>
                    {reviewer.expertise} Reviewer
                    {reviewer.isVerified && ' ✓'}
                  </ReviewerRole>
                </ReviewerDetails>
              </ReviewerHeader>

              {/* Trust Score Section */}
              <ScoreSection>
                <ScoreBadge $color={getTrustScoreColor(reviewer.trustScore)}>
                  <ScoreValue>{reviewer.trustScore}</ScoreValue>
                  <ScoreLabel>Trust Score</ScoreLabel>
                </ScoreBadge>
              </ScoreSection>

              {/* Stats Grid */}
              <StatsGrid>
                {/* Reviews Completed */}
                <StatItem>
                  <StatIcon>
                    <CheckCircle size={20} color="#14b8a6" />
                  </StatIcon>
                  <StatValue>{reviewer.reviewsCompleted}</StatValue>
                  <StatLabel>Reviews</StatLabel>
                </StatItem>

                {/* Accuracy */}
                <StatItem>
                  <StatIcon>
                    <TrendingUp size={20} color="#10b981" />
                  </StatIcon>
                  <StatValue>{reviewer.accuracy.toFixed(0)}%</StatValue>
                  <StatLabel>Accuracy</StatLabel>
                </StatItem>

                {/* Approved */}
                <StatItem>
                  <StatIcon>
                    <CheckCircle size={20} color="#059669" />
                  </StatIcon>
                  <StatValue>{reviewer.approvedCount}</StatValue>
                  <StatLabel>Approved</StatLabel>
                </StatItem>

                {/* Rejected */}
                <StatItem>
                  <StatIcon>
                    <XCircle size={20} color="#dc2626" />
                  </StatIcon>
                  <StatValue>{reviewer.rejectedCount}</StatValue>
                  <StatLabel>Rejected</StatLabel>
                </StatItem>
              </StatsGrid>

              {/* Specialization */}
              {reviewer.specialization && reviewer.specialization.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>
                    SPECIALIZATION
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {reviewer.specialization.map((spec, idx) => (
                      <SpecializationTag key={idx}>{spec}</SpecializationTag>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Review */}
              {reviewer.lastReviewAt && (
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Last review: {new Date(reviewer.lastReviewAt).toLocaleDateString()}
                </div>
              )}
            </LeaderboardCard>
          ))}
        </LeaderboardGrid>
      )}
    </LeaderboardContainer>
  )
}

export default ReviewerLeaderboard
