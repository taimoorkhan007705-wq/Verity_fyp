import { API_BASE, API_URL, mediaUrl } from '../../config.js'
import { useState, useEffect, useRef } from 'react'
import { Heart, MessageCircle, Share2, CheckCircle, Send, Trash2, Flag, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { getFeed } from '../../services/api'
import { useBadges } from '../../contexts/BadgeContext'
import { useToast } from '../../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar/Avatar'
import Stories from '../story/Stories'
import CompleteProfileModal from '../shared/CompleteProfileModal'
import useProfileGuard from '../../utils/useProfileGuard'
import {
  FeedContainer, PostCard, PostHeader, PostUserInfo,
  PostUserName, VerifiedBadge, PostUsername, PostTime, PostText,
  PostHashtag, PostImage, PostActions, ActionButton,
  CategoryBar, CategoryTabs, CategoryTab,
  CreatePostSection, CreatePostInput,
} from './Feed.styled'

const API = `${API_URL}`
const token = () => localStorage.getItem('token')
const currentUserId = () => { try { return JSON.parse(localStorage.getItem('user'))?.id } catch { return null } }
const isAdmin = () => { try { return JSON.parse(localStorage.getItem('user'))?.role === 'Admin' } catch { return false } }

const getAvatar = (author) =>
  author?.profile_info?.avatar
    ? mediaUrl(author.profile_info.avatar)
    : author?.avatar
    ? mediaUrl(author.avatar)
    : undefined

const formatTime = (ts) => {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const CATEGORIES = ['All', 'Sports', 'News', 'Trending', 'Entertainment', 'Food', 'Other']

const getStoredCategory = () => {
  try {
    return localStorage.getItem('selectedCategory') || 'All'
  } catch {
    return 'All'
  }
}

const setStoredCategory = (category) => {
  try {
    localStorage.setItem('selectedCategory', category)
  } catch (error) {
    console.error('Failed to store category preference:', error)
  }
}

function PostItem({ post, onRemove }) {
  const uid = currentUserId()
  const admin = isAdmin()
  const navigate = useNavigate()
  const { guard, showModal, closeModal } = useProfileGuard()
  const toast = useToast()
  const [likes, setLikes] = useState(post.likes?.length || 0)
  const [liked, setLiked] = useState(post.likes?.some(l => l.user?.toString() === uid))
  const [comments, setComments] = useState(post.comments || [])
  const [shares, setShares] = useState(post.shares?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [flagged, setFlagged] = useState(false)
  const inputRef = useRef(null)

  const handleProfileClick = () => {
    const authorId = post.author?._id || post.author?.id
    if (authorId) {
      navigate(`/profile/${authorId}`)
    }
  }

  const adminDelete = async () => {
    const res = await fetch(`${API_BASE}/api/admin/posts/${post._id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    if (data.success) {
      if (onRemove) onRemove(post._id)
      toast.success('Post deleted successfully')
    } else {
      toast.error('Failed to delete post')
    }
  }

  const adminFlag = () => {
    setFlagged(f => !f)
    toast.info(flagged ? 'Post unflagged' : 'Post flagged for review')
  }

  const handleLike = async () => {
    if (!guard()) return
    const res = await fetch(`${API}/posts/${post._id}/like`, {
      method: 'POST', headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    if (data.success) { setLikes(data.likes); setLiked(l => !l) }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!guard()) return
    if (!commentText.trim() || submitting) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/posts/${post._id}/comment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText.trim() })
      })
      
      if (!res.ok) {
        console.error('Comment API error:', res.status, res.statusText)
        alert(`Error: ${res.statusText}`)
        setSubmitting(false)
        return
      }
      
      const data = await res.json()
      console.log('Comment response:', data)
      
      if (data.success) { 
        setComments(data.comments || [])
        setCommentText('')
        toast?.success('Comment posted successfully')
      } else {
        console.error('Comment failed:', data.message)
        alert(data.message || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Comment error:', error)
      alert('Failed to post comment: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleShare = async () => {
    if (!guard()) return
    const postUrl = `${window.location.origin}/post/${post._id}`
    const authorName = post.author?.user_info?.fullName || post.author?.fullName || 'Someone'

    // try native share sheet first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${authorName}`,
          text: post.content?.slice(0, 100),
          url: postUrl,
        })
        // only count share if user completed it
        const res = await fetch(`${API}/posts/${post._id}/share`, {
          method: 'POST', headers: { Authorization: `Bearer ${token()}` }
        })
        const data = await res.json()
        if (data.success) setShares(data.shares)
      } catch (error) {
        // user cancelled — do nothing
      }
    } else {
      // fallback: copy link to clipboard and show toast
      await navigator.clipboard.writeText(postUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2500)
      const res = await fetch(`${API}/posts/${post._id}/share`, {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }
      })
      const data = await res.json()
      if (data.success) setShares(data.shares)
    }
  }

  const toggleComments = () => {
    if (!guard()) return
    setShowComments(v => !v)
    if (!showComments) setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <PostCard>
      <PostHeader onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        <Avatar src={getAvatar(post.author)} name={post.author?.user_info?.fullName || post.author?.fullName} alt={post.author?.user_info?.fullName || post.author?.fullName} size={48} />
        <PostUserInfo>
          <PostUserName>
            <span>{post.author?.user_info?.fullName || post.author?.fullName}</span>
            {post.isVerified && <VerifiedBadge><CheckCircle size={14} /></VerifiedBadge>}
          </PostUserName>
          <PostUsername>
            @{post.author?.email?.split('@')[0]}
            <PostTime>{formatTime(post.createdAt)}</PostTime>
          </PostUsername>
        </PostUserInfo>
      </PostHeader>

      <PostText>
        {post.content.split('#').map((part, i) => {
          if (i === 0) return part
          const [tag, ...rest] = part.split(' ')
          return <span key={i}><PostHashtag>#{tag}</PostHashtag> {rest.join(' ')}</span>
        })}
      </PostText>

      {}
      {post.category && post.category !== 'Other' && (
        <div style={{ 
          display: 'inline-block', 
          padding: '4px 10px', 
          borderRadius: '6px', 
          backgroundColor: '#f0fdfa', 
          border: '1px solid #14b8a6',
          color: '#0f766e',
          fontSize: '0.75rem',
          fontWeight: 600,
          marginBottom: '0.75rem'
        }}>
          📁 {post.category}
        </div>
      )}

      {post.media?.length > 0 && post.media.map((item, idx) =>
        item.type === 'image'
          ? <PostImage key={idx} src={mediaUrl(item.url)} alt="Post media" />
          : <video key={idx} controls style={{ width: '100%', borderRadius: 12, marginBottom: '1rem' }}>
              <source src={mediaUrl(item.url)} />
            </video>
      )}

      <PostActions>
        <ActionButton onClick={handleLike} style={{ color: liked ? '#ef4444' : undefined }}>
          <Heart fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'currentColor'} />
          {likes > 0 && <span>{likes}</span>}
        </ActionButton>
        <ActionButton onClick={toggleComments}>
          <MessageCircle />
          {comments.length > 0 && <span>{comments.length}</span>}
        </ActionButton>
        <ActionButton onClick={handleShare} style={{ position: 'relative' }}>
          <Share2 />
          {shares > 0 && <span>{shares}</span>}
          {shareCopied && (
            <span style={{
              position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#0f172a', color: 'white', fontSize: '0.75rem', fontWeight: 600,
              padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap', pointerEvents: 'none'
            }}>
              Link copied!
            </span>
          )}
        </ActionButton>
        {admin && (
          <>
            <ActionButton onClick={adminFlag} style={{ color: flagged ? '#f59e0b' : undefined, marginLeft: 'auto' }}>
              <Flag fill={flagged ? '#f59e0b' : 'none'} stroke={flagged ? '#f59e0b' : 'currentColor'} size={18} />
            </ActionButton>
            <ActionButton onClick={adminDelete} style={{ color: '#ef4444' }}>
              <Trash2 size={18} />
            </ActionButton>
          </>
        )}
      </PostActions>

      {showModal && <CompleteProfileModal onClose={closeModal} />}

      {showComments && (        <div style={{ marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
          {comments.length > 0 && (
            <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 200, overflowY: 'auto' }}>
              {comments.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Avatar
                    src={c.user?.profile_info?.avatar ? `${API_BASE}${c.user.profile_info.avatar}` : c.user?.avatar?.startsWith('http') ? c.user.avatar : undefined}
                    name={c.user?.user_info?.fullName || 'User'}
                    alt={c.user?.user_info?.fullName || 'User'}
                    size={28}
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: 10, padding: '6px 10px', flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>{c.user?.user_info?.fullName || 'User'}</div>
                    <div style={{ fontSize: '0.85rem', color: '#374151' }}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleComment} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              ref={inputRef}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
            />
            <button type="submit" disabled={submitting} style={{ background: '#14b8a6', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Send size={15} color="white" />
            </button>
          </form>
        </div>
      )}
    </PostCard>
  )
}

function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(getStoredCategory())
  const admin = isAdmin()
  const navigate = useNavigate()
  const { markFeedVisited } = useBadges()

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true)
      const url = admin ? `${API_URL}/admin/feed` : null
      try {
        if (admin) {
          const response = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
          const data = await response.json()
          if (data.success) setPosts(data.posts)
        } else {
          const data = await getFeed(1, 10, selectedCategory)
          setPosts(data.posts)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadFeed()
  }, [selectedCategory, admin])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setStoredCategory(category)
  }

  const handleRemove = (postId) => setPosts(prev => prev.filter(p => p._id !== postId))

  if (loading) return <FeedContainer><div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading feed...</div></FeedContainer>

  return (
    <FeedContainer>
      <Stories />
      
      {/* Rejected Posts Button - Only show for non-admin */}
      {!admin && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
        onClick={() => navigate('/rejected-posts')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} color="#dc2626" />
            <span style={{ fontWeight: 600, color: '#991b1b' }}>View Rejected Posts</span>
          </div>
          <span style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>→</span>
        </div>
      )}
      
      <CreatePostSection onClick={() => navigate('/create-post')}>
        <CreatePostInput placeholder="What's on your mind?" readOnly />
        <ImageIcon size={18} style={{ color: '#14b8a6' }} />
      </CreatePostSection>

      <CategoryBar>
        <CategoryTabs>
          {CATEGORIES.map(category => (
            <CategoryTab
              key={category}
              $isActive={selectedCategory === category}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </CategoryTab>
          ))}
        </CategoryTabs>
      </CategoryBar>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {selectedCategory === 'All' 
              ? 'No posts yet!' 
              : `No ${selectedCategory} posts yet!`}
          </p>
          <p style={{ fontSize: '0.9375rem' }}>
            {selectedCategory === 'All' 
              ? 'Be the first to share something!' 
              : `Be the first to post about ${selectedCategory}!`}
          </p>
        </div>
      ) : posts.map(post => <PostItem key={post._id} post={post} onRemove={handleRemove} />)}
    </FeedContainer>
  )
}

export default Feed

