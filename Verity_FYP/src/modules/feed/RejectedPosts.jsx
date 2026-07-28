import { useState, useEffect } from 'react'
import { ArrowLeft, AlertCircle, Calendar, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_URL, mediaUrl } from '../../config'
import Avatar from '../../components/Avatar/Avatar'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.2s;

    &:hover {
      background: #e2e8f0;
    }
  }

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    flex: 1;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;

  svg {
    color: #94a3b8;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
    font-size: 0.95rem;
  }
`

const RejectedPostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #ef4444;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const PostHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`

const PostInfo = styled.div`
  flex: 1;
`

const PostDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
`

const PostContent = styled.div`
  color: #0f172a;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  word-break: break-word;
`

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;

  img, video {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    background: #f1f5f9;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    img, video {
      height: 200px;
    }
  }
`

const RejectionReason = styled.div`
  background: #fee2e2;
  border-left: 3px solid #ef4444;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;

  .reason-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .reason-text {
    color: #7f1d1d;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #f0fdfa;
  color: #0f766e;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
`

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-weight: 500;
`

function RejectedPosts() {
  const navigate = useNavigate()
  const [rejectedPosts, setRejectedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchRejectedPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts/my/rejected`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        if (data.success) {
          setRejectedPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Failed to fetch rejected posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRejectedPosts()
  }, [token])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRejectionReason = (post) => {
    if (post.verificationStatus === 'ai_rejected' && post.aiRejectionReason) {
      return post.aiRejectionReason
    }
    if (post.reviewNotes) {
      return post.reviewNotes
    }
    return 'Post was rejected. Please contact support for more details.'
  }

  if (loading) {
    return (
      <Container>
        <Header>
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1>Rejected Posts</h1>
        </Header>
        <LoadingSpinner>Loading your rejected posts...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Rejected Posts</h1>
      </Header>

      {rejectedPosts.length === 0 ? (
        <EmptyState>
          <AlertCircle size={48} />
          <h2>No Rejected Posts</h2>
          <p>Great! All your posts have been approved. Keep sharing quality content!</p>
        </EmptyState>
      ) : (
        <RejectedPostsList>
          {rejectedPosts.map(post => (
            <PostCard key={post._id}>
              <PostHeader>
                <div style={{ flex: 1 }}>
                  <PostDate>
                    <Calendar size={16} />
                    {formatDate(post.createdAt)}
                  </PostDate>
                  {post.category && post.category !== 'Other' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <CategoryBadge>
                        <Tag size={14} />
                        {post.category}
                      </CategoryBadge>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 600 }}>
                  {post.verificationStatus === 'ai_rejected' ? 'AI Rejected' : 'Rejected'}
                </div>
              </PostHeader>

              {post.content && <PostContent>{post.content}</PostContent>}

              {post.media && post.media.length > 0 && (
                <MediaGrid>
                  {post.media.map((item, idx) =>
                    item.type === 'image' ? (
                      <img key={idx} src={mediaUrl(item.url)} alt="Post media" />
                    ) : (
                      <video key={idx} controls>
                        <source src={mediaUrl(item.url)} />
                      </video>
                    )
                  )}
                </MediaGrid>
              )}

              <RejectionReason>
                <div className="reason-title">
                  <AlertCircle size={16} />
                  Why was this rejected?
                </div>
                <div className="reason-text">{getRejectionReason(post)}</div>
              </RejectionReason>
            </PostCard>
          ))}
        </RejectedPostsList>
      )}
    </Container>
  )
}

export default RejectedPosts
