import { API_BASE, API_URL, mediaUrl } from '../../config.js'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Check, X, LogOut, RefreshCw } from 'lucide-react'
import { getCurrentUser, getReviewerStats, getReviewerQueue, voteOnPost, logout as apiLogout } from '../../services/api'
import Avatar from '../../components/Avatar/Avatar'
import {
  ReviewCenterContainer,
  TopHeader,
  HeaderLeft,
  HeaderTitle,
  HeaderRight,
  ReviewerInfo,
  ReviewerDetails,
  ReviewerName,
  ReviewerRole,
  ContentWrapper,
  ReviewSidebar,
  SidebarPanel,
  SidebarTitle,
  SidebarMenu,
  SidebarMenuItem,
  MenuBadge,
  MainContent,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  ReviewCardsGrid,
  ReviewCard,
  ReviewCardHeader,
  AuthorInfo,
  AuthorDetails,
  AuthorName,
  AuthorMeta,
  PostContent,
  PostText,
  PostImage,
  PostStatusBox,
  NoImageState,
  ActionButtonsRow,
  ApproveButton,
  RejectButton,
  HeaderButton,
  DangerButton,
  ContentMessage,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ReasonSelect,
  ReasonTextarea,
  ModalButtons,
  ModalCancelButton,
  ModalSubmitButton,
} from './ReviewCenter.styled'

function ReviewCenter() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionNotes, setRejectionNotes] = useState('')
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [votingInProgress, setVotingInProgress] = useState(false)
  const [reviewerStats, setReviewerStats] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    pendingReviews: 0,
    accuracy: 0
  })

  useEffect(() => {
    loadReviewerQueue()
    loadReviewerStats()

    const refreshOnFocus = () => {
      refreshReviewerDashboard()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshReviewerDashboard()
      }
    }

    window.addEventListener('focus', refreshOnFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', refreshOnFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshReviewerDashboard()
    }, 15000)

    return () => clearInterval(intervalId)
  }, [])

  const loadReviewerStats = async () => {
    try {
      const response = await getReviewerStats()
      setReviewerStats({
        totalReviews: response.stats?.totalReviews ?? 0,
        approvedReviews: response.stats?.approvedReviews ?? 0,
        rejectedReviews: response.stats?.rejectedReviews ?? 0,
        pendingReviews: response.stats?.pendingReviews ?? 0,
        accuracy: response.stats?.accuracy ?? user?.trust_security?.trustScore ?? 0
      })
    } catch (error) {
      console.error('Failed to load reviewer stats:', error)
    }
  }

  const refreshReviewerDashboard = async () => {
    try {
      setRefreshing(true)
      await Promise.all([loadReviewerQueue(), loadReviewerStats()])
    } catch (error) {
      console.error('Failed to refresh reviewer dashboard:', error)
      alert(`Failed to refresh dashboard: ${error.message}`)
    } finally {
      setRefreshing(false)
    }
  }

  const loadReviewerQueue = async () => {
    try {
      const response = await getReviewerQueue()
      console.log('[ReviewCenter] Queue response:', response)
      
      let posts = []
      if (Array.isArray(response.posts)) {
        posts = response.posts
      } else if (Array.isArray(response.data)) {
        posts = response.data
      } else if (Array.isArray(response.queue)) {
        posts = response.queue
      } else if (Array.isArray(response)) {
        posts = response
      }
 
      let transformedPosts = []
       
      if (posts.length > 0) {
        transformedPosts = posts.map(post => {
          const imageUrl = post.media && post.media.length > 0 
            ? mediaUrl(post.media[0].url)
            : null
 
          const authorAvatar = post.author?.profile_info?.avatar || post.author?.avatar
 
          // Check if current reviewer has voted - need to compare as strings
          const currentReviewerId = user?.id?.toString()
          const hasAlreadyVoted = post.reviewerVotes?.some(v => 
            v.reviewer?.toString?.() === currentReviewerId || 
            v.reviewer?.toString?.() === user?.id ||
            v.reviewer === user?.id
          ) || false

          return {
            id: post._id || post.id,
            author: {
              id: post.author?._id || post.author?.id,
              name: post.author?.user_info?.fullName || post.author?.fullName || post.author?.name || 'Unknown',
              avatar: authorAvatar ? mediaUrl(authorAvatar) : undefined,
              trustScore: post.author?.trust_security?.trustScore || post.author?.trustScore || 50,
              postsCount: post.author?.social_stats?.postsCount || post.author?.totalPosts || 0
            },
            text: post.content || post.text || '',
            image: imageUrl,
            timestamp: formatTime(post.createdAt || post.created_at || post.timestamp),
            status: 'pending',
            reviewedAt: post.reviewedAt || null,
            votingSummary: post.votingSummary || post.voting_summary || { approveCount: 0, rejectCount: 0, totalVotes: 0, finalDecision: 'pending' },
            hasVoted: hasAlreadyVoted
          }
        })
      }
      
      console.log('[ReviewCenter] Transformed posts:', transformedPosts)
      setAllPosts(transformedPosts)
    } catch (error) {
      console.error('Failed to load reviewer queue:', error)
      alert(`Failed to load posts: ${error.message}`)
    } finally {
      setLoading(false)
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

  const stats = useMemo(() => {
    const pending = allPosts.filter(p => p.status === 'pending').length
    const approved = allPosts.filter(p => p.status === 'approved').length
    const rejected = allPosts.filter(p => p.status === 'rejected').length
    const total = approved + rejected
    const accuracy = total > 0 ? Math.round((approved / total) * 100) : 0
    return { pending, approved, rejected, accuracy, total }
  }, [allPosts])

  const handleLogout = () => {
    apiLogout()
    navigate('/')
    window.location.reload()
  }

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => post.status === 'pending')
  }, [allPosts])

  const handleApprove = async (postId) => {
    try {
      setVotingInProgress(true)
      console.log('[ReviewCenter] Approving post:', postId)
      
      const result = await voteOnPost(postId, 'approve', 'Post approved after manual review')
      console.log('[ReviewCenter] Vote result:', result)
      
      // Update local state
      setAllPosts(posts => posts.map(post => 
        post.id === postId 
          ? { 
              ...post,
              votingSummary: {
                approveCount: result.approveCount,
                rejectCount: result.rejectCount,
                totalVotes: result.totalVotes,
                finalDecision: result.finalDecision || 'pending'
              },
              hasVoted: true,
              status: result.finalDecision === 'approved' ? 'approved' : result.finalDecision === 'rejected' ? 'rejected' : 'pending',
              reviewedAt: result.finalDecision ? new Date().toLocaleString() : null
            }
          : post
      ))
      
      // Show feedback message
      alert(result.message || 'Vote submitted! ' + (result.finalDecision ? `Post ${result.finalDecision}!` : 'Waiting for other reviewers...'))
      
      // Reload queue to get fresh data
      setTimeout(() => loadReviewerQueue(), 1000)
    } catch (error) {
      console.error('[ReviewCenter] Vote error:', error)
      alert(`❌ Failed to vote: ${error.message}\n\nDebug tip: Open browser console (F12) to see detailed error logs.`)
    } finally {
      setVotingInProgress(false)
    }
  }

  const handleReject = (post) => {
    setSelectedPost(post)
    setShowRejectModal(true)
  }

  const handleRejectSubmit = async () => {
    if (!rejectionReason) {
      alert('Please select a rejection reason')
      return
    }
    
    try {
      setVotingInProgress(true)
      console.log('[ReviewCenter] Rejecting post:', selectedPost.id)
      
      const result = await voteOnPost(selectedPost.id, 'reject', `${rejectionReason}: ${rejectionNotes}`)
      console.log('[ReviewCenter] Reject result:', result)
      
      // Update local state
      setAllPosts(posts => posts.map(post => 
        post.id === selectedPost.id 
          ? { 
              ...post,
              votingSummary: {
                approveCount: result.approveCount,
                rejectCount: result.rejectCount,
                totalVotes: result.totalVotes,
                finalDecision: result.finalDecision || 'pending'
              },
              hasVoted: true,
              status: result.finalDecision === 'approved' ? 'approved' : result.finalDecision === 'rejected' ? 'rejected' : 'pending',
              reviewedAt: result.finalDecision ? new Date().toLocaleString() : null,
              rejectReason: rejectionReason,
              rejectNotes: rejectionNotes
            }
          : post
      ))
      
      // Show feedback message
      alert(result.message || 'Vote submitted! ' + (result.finalDecision ? `Post ${result.finalDecision}!` : 'Waiting for other reviewers...'))
      
      // Reset modal
      setShowRejectModal(false)
      setRejectionReason('')
      setRejectionNotes('')
      setSelectedPost(null)
      
      // Reload queue to get fresh data
      setTimeout(() => loadReviewerQueue(), 1000)
    } catch (error) {
      console.error('[ReviewCenter] Reject error:', error)
      alert(`❌ Failed to vote: ${error.message}\n\nDebug tip: Open browser console (F12) to see detailed error logs.`)
    } finally {
      setVotingInProgress(false)
    }
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
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading review queue...</p>
      </div>
    )
  }

  return (
    <ReviewCenterContainer>
      {}
      <TopHeader>
        <HeaderLeft>
          <HeaderTitle>Reviewer Queue</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <ReviewerInfo>
            <Avatar
              src={user?.avatar ? mediaUrl(user.avatar) : undefined}
              name={user?.fullName || 'User'}
              alt={user?.fullName || 'User'}
              size={40}
            />
            <ReviewerDetails>
              <ReviewerName>{user?.fullName}</ReviewerName>
              <ReviewerRole>Content Reviewer</ReviewerRole>
            </ReviewerDetails>
          </ReviewerInfo>
          <HeaderButton
            onClick={refreshReviewerDashboard}
            disabled={refreshing}
            title="Refresh reviewer queue"
          >
            <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </HeaderButton>
          <DangerButton
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </DangerButton>
        </HeaderRight>
      </TopHeader>

      {}
      <ContentWrapper>
        {}
        <ReviewSidebar $isOpen={sidebarOpen}>
          <SidebarPanel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Avatar
                src={user?.avatar ? mediaUrl(user.avatar) : undefined}
                name={user?.fullName || 'User'}
                alt={user?.fullName || 'User'}
                size={48}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: '700', 
                  fontSize: '0.95rem', 
                  color: 'inherit',
                  marginBottom: '0.25rem'
                }}>
                  {user?.fullName}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#64748b',
                  fontWeight: '600'
                }}>
                  Content Reviewer
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'inherit' }}>
                Trust Score
              </span>
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: '900',
                color: '#14b8a6'
              }}>
                {reviewerStats.accuracy}%
              </span>
            </div>
          </SidebarPanel>
          
          <SidebarTitle>Voting System</SidebarTitle>
          <SidebarPanel>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'inherit' }}>2-Vote Majority</div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: 'inherit', lineHeight: 1.6 }}>
              Posts need 2 votes (out of 3) to be decided. Your vote contributes to the final decision.
            </p>
          </SidebarPanel>

          <SidebarTitle>Queue Status</SidebarTitle>
          <SidebarMenu>
            <SidebarMenuItem $isActive={true}>
              Awaiting Your Vote
              {stats.pending > 0 && <MenuBadge>{stats.pending}</MenuBadge>}
            </SidebarMenuItem>
          </SidebarMenu>
        </ReviewSidebar>

        {}
        <MainContent>
          {}
          <StatsGrid>
            <StatCard>
              <StatLabel>Posts in Queue</StatLabel>
              <StatValue>{stats.pending}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Voted</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Your Trust Score</StatLabel>
              <StatValue>{reviewerStats.accuracy}%</StatValue>
            </StatCard>
          </StatsGrid>
          
          {}
          {filteredPosts.length === 0 ? (
            <ContentMessage>
              <p style={{fontSize: '1.125rem', fontWeight: 600, margin: 0}}>✨ All caught up!</p>
              <p style={{marginTop: '0.5rem', color: '#94a3b8'}}>No posts awaiting your review right now. Check back later!</p>
            </ContentMessage>
          ) : (
            <ReviewCardsGrid>
              {filteredPosts.map((post) => (
                <ReviewCard key={post.id}>
                  {}
                  <ReviewCardHeader style={{ cursor: 'pointer' }} onClick={() => {
                    if (post.author?.id) {
                      navigate(`/profile/${post.author.id}`)
                    }
                  }}>
                    <AuthorInfo>
                      <Avatar
                        src={post.author?.avatar ? mediaUrl(post.author.avatar) : undefined}
                        name={post.author.name}
                        alt={post.author.name}
                        size={40}
                      />
                      <AuthorDetails>
                        <AuthorName>{post.author.name}</AuthorName>
                        <AuthorMeta>
                          Trust: {post.author.trustScore}% • {post.author.postsCount} posts • {post.timestamp}
                        </AuthorMeta>
                      </AuthorDetails>
                    </AuthorInfo>
                  </ReviewCardHeader>
                  
                  {}
                  <PostContent>
                    <PostText>{post.text}</PostText>
                    {post.image ? (
                      <PostImage src={post.image} alt="Post content" />
                    ) : (
                      <NoImageState>
                        No image attached
                      </NoImageState>
                    )}
                  </PostContent>
                   
                  {}
                  <PostStatusBox>
                    <div style={{ fontWeight: '600', color: 'inherit', marginBottom: '0.25rem' }}>
                      Voting Progress
                    </div>
                    <div style={{ color: 'inherit' }}>
                      ✓ {post.votingSummary.approveCount} approve • ✕ {post.votingSummary.rejectCount} reject • Total: {post.votingSummary.totalVotes}/3
                    </div>
                    {post.votingSummary.finalDecision !== 'pending' && (
                      <div style={{ 
                        marginTop: '0.5rem',
                        fontWeight: '600',
                        color: post.votingSummary.finalDecision === 'approved' ? '#059669' : '#dc2626'
                      }}>
                        {post.votingSummary.finalDecision === 'approved' ? '✓ APPROVED' : '✕ REJECTED'}
                      </div>
                    )}
                  </PostStatusBox>
                  
                  {}
                  {post.votingSummary.finalDecision === 'pending' && !post.hasVoted && (
                    <ActionButtonsRow>
                      <ApproveButton onClick={() => handleApprove(post.id)} disabled={votingInProgress}>
                        <CheckCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        {votingInProgress ? 'Voting...' : 'Approve'}
                      </ApproveButton>
                      <RejectButton onClick={() => handleReject(post)} disabled={votingInProgress}>
                        <X size={18} /> {votingInProgress ? 'Voting...' : 'Reject'}
                      </RejectButton>
                    </ActionButtonsRow>
                  )}
                  
                  {post.hasVoted && (
                    <div style={{
                      padding: '0.75rem',
                      background: '#d1fae5',
                      borderRadius: '0.5rem',
                      color: '#059669',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      ✓ You voted on this post
                    </div>
                  )}
                </ReviewCard>
              ))}
            </ReviewCardsGrid>
          )}
        </MainContent>
      </ContentWrapper>

      {}
      <ModalOverlay $isOpen={showRejectModal} onClick={() => setShowRejectModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>Reject Post</ModalTitle>
          <ReasonSelect value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}>
            <option value="">Select rejection reason...</option>
            <option value="Fake/Manipulated Image">Fake/Manipulated Image</option>
            <option value="Misinformation/Fake News">Misinformation/Fake News</option>
            <option value="Spam/Promotional Content">Spam/Promotional Content</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Plagiarized Content">Plagiarized Content</option>
            <option value="Hate Speech/Harassment">Hate Speech/Harassment</option>
            <option value="Copyright Violation">Copyright Violation</option>
            <option value="Other">Other</option>
          </ReasonSelect>
          <ReasonTextarea
            placeholder="Add additional notes (optional)..."
            value={rejectionNotes}
            onChange={(e) => setRejectionNotes(e.target.value)}
          />
          <ModalButtons>
            <ModalCancelButton onClick={() => setShowRejectModal(false)} disabled={votingInProgress}>
              Cancel
            </ModalCancelButton>
            <ModalSubmitButton onClick={handleRejectSubmit} disabled={votingInProgress}>
              {votingInProgress ? 'Submitting...' : 'Reject Post'}
            </ModalSubmitButton>
          </ModalButtons>
        </ModalContent>
      </ModalOverlay>
    </ReviewCenterContainer>
  )
}

export default ReviewCenter

