import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Flag, ArrowLeft, TrendingUp, Award, Check, X, AlertCircle, BarChart3 } from 'lucide-react'
import { getCurrentUser, getPendingReviews, submitReview, getReviewerStats } from '../../services/api'
import {
  ReviewCenterContainer,
  TopHeader,
  HeaderLeft,
  Logo,
  LogoIcon,
  LogoText,
  HeaderTitle,
  HeaderRight,
  ReviewerInfo,
  ReviewerAvatar,
  ReviewerDetails,
  ReviewerName,
  ReviewerRole,
  BackButton,
  ContentWrapper,
  ReviewSidebar,
  SidebarTitle,
  SidebarMenu,
  SidebarMenuItem,
  MenuBadge,
  MainContent,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  FiltersRow,
  FilterSelect,
  ReviewCardsGrid,
  ReviewCard,
  ReviewCardHeader,
  AuthorInfo,
  AuthorAvatar,
  AuthorDetails,
  AuthorName,
  AuthorMeta,
  RiskBadge,
  PostContent,
  PostText,
  PostImage,
  AIAnalysisSection,
  AIAnalysisTitle,
  AIScoreGrid,
  AIScoreItem,
  AIScoreLabel,
  AIScoreValue,
  AIScoreBar,
  AIScoreBarFill,
  AIIssuesList,
  AIIssueItem,
  ActionButtonsRow,
  ApproveButton,
  RejectButton,
  FlagButton,
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
  const [sortBy, setSortBy] = useState('newest')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionNotes, setRejectionNotes] = useState('')
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewerStats, setReviewerStats] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    pendingReviews: 0,
    accuracy: 0
  })
  useEffect(() => {
    loadPendingReviews()
    loadReviewerStats()
  }, [])
  const loadReviewerStats = async () => {
    try {
      const response = await getReviewerStats()
      setReviewerStats(response.stats)
    } catch (error) {
      console.error('Failed to load reviewer stats:', error)
    }
  }
  const loadPendingReviews = async () => {
    try {
      const response = await getPendingReviews()
      console.log('API Response:', response)
      console.log('Full API Response JSON:', JSON.stringify(response, null, 2))
      let transformedPosts = []
      if (response.groupedPosts) {
        response.groupedPosts.forEach(group => {
          console.log('Processing group:', group.author.fullName)
          console.log('Group posts:', JSON.stringify(group.posts, null, 2))
          group.posts.forEach(post => {
            console.log('Post media:', post.media)
            const imageUrl = post.media && post.media.length > 0 
              ? `http://localhost:5000${post.media[0]}` 
              : null
            console.log('Image URL:', imageUrl)
            transformedPosts.push({
              id: post._id,
              author: {
                name: group.author.fullName,
                avatar: group.author.avatar 
                  ? (group.author.avatar.startsWith('http') 
                      ? group.author.avatar 
                      : `http://localhost:5000${group.author.avatar}`)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(group.author.fullName)}&background=14b8a6&color=fff&size=150`,
                trustScore: group.author.trustScore || 50,
                postsCount: group.totalPosts
              },
              text: post.content,
              image: imageUrl,
              timestamp: formatTime(post.createdAt),
              status: 'pending',
              reviewedAt: null
            })
          })
        })
      } else if (response.posts) {
        transformedPosts = response.posts.map(post => ({
          id: post._id,
          author: {
            name: post.author?.user_info?.fullName || post.author?.fullName || 'Unknown',
            avatar: post.author?.profile_info?.avatar || post.author?.avatar 
              ? `http://localhost:5000${post.author.profile_info?.avatar || post.author.avatar}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.fullName || 'User')}&background=14b8a6&color=fff&size=150`,
            trustScore: post.author?.trust_security?.trustScore || post.author?.trustScore || 50,
            postsCount: post.author?.social_stats?.postsCount || post.author?.totalPosts || 0
          },
          text: post.content,
          image: post.media && post.media.length > 0 ? `http://localhost:5000${post.media[0].url}` : null,
          timestamp: formatTime(post.createdAt),
          status: 'pending',
          reviewedAt: null
        }))
      }
      console.log('Transformed posts:', transformedPosts)
      setAllPosts(transformedPosts)
    } catch (error) {
      console.error('Failed to load pending reviews:', error)
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
    const flagged = allPosts.filter(p => p.status === 'flagged').length
    const total = approved + rejected
    const accuracy = total > 0 ? Math.round((approved / total) * 100) : 0
    return { pending, approved, rejected, flagged, accuracy, total }
  }, [allPosts])
  const filteredPosts = useMemo(() => {
    let posts = allPosts.filter(post => post.status === activeTab)
    posts = [...posts].sort((a, b) => {
      if (sortBy === 'newest') return a.id > b.id ? -1 : 1
      if (sortBy === 'oldest') return a.id < b.id ? -1 : 1
      return 0
    })
    return posts
  }, [allPosts, activeTab, sortBy])
  const handleApprove = async (postId) => {
    try {
      await submitReview({
        postId,
        verdict: 'verified',
        notes: 'Post approved after manual review',
        confidence: 90,
        sources: [],
        tags: ['approved']
      })
      setAllPosts(posts => posts.map(post => 
        post.id === postId 
          ? { ...post, status: 'approved', reviewedAt: new Date().toLocaleString() }
          : post
      ))
      alert('Post approved successfully!')
    } catch (error) {
      alert(`Failed to approve post: ${error.message}`)
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
      await submitReview({
        postId: selectedPost.id,
        verdict: 'false',
        notes: `${rejectionReason}: ${rejectionNotes}`,
        confidence: 85,
        sources: [],
        tags: [rejectionReason]
      })
      setAllPosts(posts => posts.map(post => 
        post.id === selectedPost.id 
          ? { 
              ...post, 
              status: 'rejected', 
              reviewedAt: new Date().toLocaleString(),
              rejectReason: rejectionReason,
              rejectNotes: rejectionNotes
            }
          : post
      ))
      alert('Post rejected successfully!')
      setShowRejectModal(false)
      setRejectionReason('')
      setRejectionNotes('')
      setSelectedPost(null)
    } catch (error) {
      alert(`Failed to reject post: ${error.message}`)
    }
  }
  const handleFlag = (postId) => {
    setAllPosts(posts => posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            status: 'flagged', 
            reviewedAt: new Date().toLocaleString(),
            flagReason: 'Flagged for admin review'
          }
        : post
    ))
    alert('Post flagged for admin review!')
  }
  return (
    <ReviewCenterContainer>
      {}
      <TopHeader>
        <HeaderLeft>
          <Logo>
            <LogoIcon><Check size={24} /></LogoIcon>
            <LogoText>Verity</LogoText>
          </Logo>
          <HeaderTitle>Review Center</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <ReviewerInfo>
            <ReviewerAvatar 
              src={
                user?.avatar?.startsWith('http') 
                  ? user.avatar 
                  : user?.avatar?.startsWith('/uploads')
                  ? `http://localhost:5000${user.avatar}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
              } 
              alt={user?.fullName}
              onError={(e) => {
                console.error('ReviewCenter header avatar failed to load:', e.target.src)
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
              }}
            />
            <ReviewerDetails>
              <ReviewerName>{user?.fullName}</ReviewerName>
              <ReviewerRole>Content Reviewer</ReviewerRole>
            </ReviewerDetails>
          </ReviewerInfo>
          <BackButton onClick={() => navigate('/feed')}>
            <ArrowLeft size={18} />
            Back to Feed
          </BackButton>
        </HeaderRight>
      </TopHeader>
      {}
      <ContentWrapper>
        {}
        <ReviewSidebar>
          {}
          <div style={{
            backgroundColor: '#f0fdfa',
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '2px solid #14b8a6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <img 
                src={
                  user?.avatar?.startsWith('http') 
                    ? user.avatar 
                    : user?.avatar?.startsWith('/uploads')
                    ? `http://localhost:5000${user.avatar}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
                } 
                alt={user?.fullName}
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%',
                  border: '2px solid #14b8a6',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  console.error('ReviewCenter sidebar avatar failed to load:', e.target.src)
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '700', 
                  fontSize: '0.95rem', 
                  color: '#1f2937',
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
              borderTop: '1px solid #99f6e4'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>
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
          </div>
          <SidebarTitle>Navigation</SidebarTitle>
          <SidebarMenu>
            <SidebarMenuItem $isActive={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
              Pending
              {stats.pending > 0 && <MenuBadge>{stats.pending}</MenuBadge>}
            </SidebarMenuItem>
            <SidebarMenuItem $isActive={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>
              Approved
              {stats.approved > 0 && <span style={{color: '#10b981', fontSize: '0.875rem', fontWeight: 600}}>({stats.approved})</span>}
            </SidebarMenuItem>
            <SidebarMenuItem $isActive={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')}>
              Rejected
              {stats.rejected > 0 && <span style={{color: '#ef4444', fontSize: '0.875rem', fontWeight: 600}}>({stats.rejected})</span>}
            </SidebarMenuItem>
            <SidebarMenuItem $isActive={activeTab === 'flagged'} onClick={() => setActiveTab('flagged')}>
              Flagged
              {stats.flagged > 0 && <span style={{color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600}}>({stats.flagged})</span>}
            </SidebarMenuItem>
            <SidebarMenuItem $isActive={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
              Statistics
            </SidebarMenuItem>
          </SidebarMenu>
        </ReviewSidebar>
        {}
        <MainContent>
          {}
          {activeTab === 'stats' && (
            <>
              <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937'}}>
                📊 Reviewer Statistics
              </h2>
              <StatsGrid>
                <StatCard>
                  <StatLabel>Total Reviews</StatLabel>
                  <StatValue $color="#6366f1">{stats.total}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Pending Reviews</StatLabel>
                  <StatValue $color="#f59e0b">{stats.pending}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Approved Posts</StatLabel>
                  <StatValue $color="#10b981">{stats.approved}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Rejected Posts</StatLabel>
                  <StatValue $color="#ef4444">{stats.rejected}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Flagged Posts</StatLabel>
                  <StatValue $color="#f59e0b">{stats.flagged}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Verity Score</StatLabel>
                  <StatValue $color="#14b8a6">
                    {stats.accuracy}%
                    <Award size={24} style={{display: 'inline', marginLeft: '0.5rem', verticalAlign: 'middle'}} />
                  </StatValue>
                </StatCard>
              </StatsGrid>
              <div style={{marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <TrendingUp size={24} color="#14b8a6" />
                  Your Verity Score Breakdown
                </h3>
                <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                  Your Verity Score is calculated based on your review accuracy and consistency. Keep up the great work!
                </p>
                <div style={{display: 'grid', gap: '1rem'}}>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{color: '#374151', fontWeight: 600}}>Accuracy Rate</span>
                      <span style={{color: '#14b8a6', fontWeight: 'bold'}}>{stats.accuracy}%</span>
                    </div>
                    <div style={{width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: `${stats.accuracy}%`, height: '100%', background: 'linear-gradient(90deg, #14b8a6, #10b981)', transition: 'width 0.3s'}}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{color: '#374151', fontWeight: 600}}>Review Speed</span>
                      <span style={{color: '#10b981', fontWeight: 'bold'}}>Fast</span>
                    </div>
                    <div style={{width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: '85%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', transition: 'width 0.3s'}}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{color: '#374151', fontWeight: 600}}>Consistency</span>
                      <span style={{color: '#6366f1', fontWeight: 'bold'}}>Excellent</span>
                    </div>
                    <div style={{width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: '92%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #4f46e5)', transition: 'width 0.3s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {}
          {activeTab !== 'stats' && (
            <>
              {}
              <StatsGrid>
                <StatCard>
                  <StatLabel>Pending Reviews</StatLabel>
                  <StatValue $color="#f59e0b">{stats.pending}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Approved Today</StatLabel>
                  <StatValue $color="#10b981">{stats.approved}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Rejected Today</StatLabel>
                  <StatValue $color="#ef4444">{stats.rejected}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Verity Score</StatLabel>
                  <StatValue $color="#14b8a6">{stats.accuracy}%</StatValue>
                </StatCard>
              </StatsGrid>
              {}
              <FiltersRow>
                <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </FilterSelect>
              </FiltersRow>
              {}
              {filteredPosts.length === 0 ? (
                <div style={{textAlign: 'center', padding: '3rem', color: '#6b7280'}}>
                  <p style={{fontSize: '1.125rem', fontWeight: 600}}>No posts in this category</p>
                  <p style={{marginTop: '0.5rem'}}>Check other tabs for more content</p>
                </div>
              ) : (
                <ReviewCardsGrid>
                  {filteredPosts.map((post) => (
                    <ReviewCard key={post.id}>
                      {}
                      <ReviewCardHeader>
                        <AuthorInfo>
                          <AuthorAvatar src={post.author.avatar} alt={post.author.name} />
                          <AuthorDetails>
                            <AuthorName>{post.author.name}</AuthorName>
                            <AuthorMeta>
                              Trust Score: {post.author.trustScore}% • {post.author.postsCount} posts • {post.timestamp}
                            </AuthorMeta>
                          </AuthorDetails>
                        </AuthorInfo>
                      </ReviewCardHeader>
                      {}
                      <PostContent>
                        <PostText>{post.text}</PostText>
                        {console.log('Post ID:', post.id, 'Image URL:', post.image)}
                        {post.image ? (
                          <PostImage src={post.image} alt="Post content" onError={(e) => console.error('Image failed to load:', post.image, e)} />
                        ) : (
                          <div style={{padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem', color: '#dc2626'}}>
                            No image attached to this post
                          </div>
                        )}
                      </PostContent>
                      {}
                      {post.status !== 'pending' && (
                        <div style={{
                          padding: '0.75rem',
                          background: post.status === 'approved' ? '#d1fae5' : post.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            fontWeight: 600,
                            color: post.status === 'approved' ? '#059669' : post.status === 'rejected' ? '#dc2626' : '#d97706',
                            marginBottom: '0.25rem'
                          }}>
                            {post.status === 'approved' && '✓ Approved'}
                            {post.status === 'rejected' && '✕ Rejected'}
                            {post.status === 'flagged' && '⚑ Flagged'}
                          </div>
                          <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
                            {post.reviewedAt}
                          </div>
                          {post.rejectReason && (
                            <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#374151'}}>
                              <strong>Reason:</strong> {post.rejectReason}
                              {post.rejectNotes && <div><strong>Notes:</strong> {post.rejectNotes}</div>}
                            </div>
                          )}
                          {post.flagReason && (
                            <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#374151'}}>
                              <strong>Reason:</strong> {post.flagReason}
                            </div>
                          )}
                        </div>
                      )}
                      {}
                      {post.status === 'pending' && (
                        <ActionButtonsRow>
                          <ApproveButton onClick={() => handleApprove(post.id)}>
                            <CheckCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Approve
                          </ApproveButton>
                          <RejectButton onClick={() => handleReject(post)}>
                            <X size={18} /> Reject
                          </RejectButton>
                        </ActionButtonsRow>
                      )}
                    </ReviewCard>
                  ))}
                </ReviewCardsGrid>
              )}
            </>
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
            <ModalCancelButton onClick={() => setShowRejectModal(false)}>
              Cancel
            </ModalCancelButton>
            <ModalSubmitButton onClick={handleRejectSubmit}>
              Reject Post
            </ModalSubmitButton>
          </ModalButtons>
        </ModalContent>
      </ModalOverlay>
    </ReviewCenterContainer>
  )
}
export default ReviewCenter
