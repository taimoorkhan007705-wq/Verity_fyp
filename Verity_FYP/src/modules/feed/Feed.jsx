import { useState, useEffect, useRef } from 'react'
import { Heart, MessageCircle, Share2, CheckCircle, Send, Trash2, Flag } from 'lucide-react'
import { getFeed } from '../../services/api'
import Stories from '../story/Stories'
import CompleteProfileModal from '../shared/CompleteProfileModal'
import useProfileGuard from '../../utils/useProfileGuard'
import {
  FeedContainer, PostCard, PostHeader, PostAvatar, PostUserInfo,
  PostUserName, VerifiedBadge, PostUsername, PostTime, PostText,
  PostHashtag, PostImage, PostActions, ActionButton,
} from './Feed.styled'

const API = 'http://localhost:5000/api'
const token = () => localStorage.getItem('token')
const currentUserId = () => { try { return JSON.parse(localStorage.getItem('user'))?.id } catch { return null } }
const isAdmin = () => { try { return JSON.parse(localStorage.getItem('user'))?.role === 'Admin' } catch { return false } }

const getAvatar = (author) =>
  author?.profile_info?.avatar
    ? `http://localhost:5000${author.profile_info.avatar}`
    : author?.avatar
    ? (author.avatar.startsWith('http') ? author.avatar : `http://localhost:5000${author.avatar}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.user_info?.fullName || author?.fullName || 'User')}&background=14b8a6&color=fff&size=150`

const formatTime = (ts) => {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function PostItem({ post, onRemove }) {
  const uid = currentUserId()
  const admin = isAdmin()
  const { guard, showModal, closeModal } = useProfileGuard()
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

  const adminDelete = async () => {
    if (!confirm('Delete this post?')) return
    const res = await fetch(`http://localhost:5000/api/admin/posts/${post._id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    if (data.success && onRemove) onRemove(post._id)
  }

  const adminFlag = () => {
    setFlagged(f => !f)
    // visual flag only — can wire to backend later
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
    const res = await fetch(`${API}/posts/${post._id}/comment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText.trim() })
    })
    const data = await res.json()
    if (data.success) { setComments(data.comments); setCommentText('') }
    setSubmitting(false)
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
      } catch (err) {
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
      <PostHeader>
        <PostAvatar src={getAvatar(post.author)} alt={post.author?.user_info?.fullName} />
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

      {post.media?.length > 0 && post.media.map((item, idx) =>
        item.type === 'image'
          ? <PostImage key={idx} src={`http://localhost:5000${item.url}`} alt="Post media" />
          : <video key={idx} controls style={{ width: '100%', borderRadius: 12, marginBottom: '1rem' }}>
              <source src={`http://localhost:5000${item.url}`} />
            </video>
      )}

      <PostActions>
        <ActionButton onClick={handleLike} style={{ color: liked ? '#ef4444' : undefined }}>
          <Heart fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'currentColor'} />
          {likes}
        </ActionButton>
        <ActionButton onClick={toggleComments}>
          <MessageCircle />
          {comments.length}
        </ActionButton>
        <ActionButton onClick={handleShare} style={{ position: 'relative' }}>
          <Share2 />
          {shares}
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
                  <img
                    src={c.user?.profile_info?.avatar ? `http://localhost:5000${c.user.profile_info.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.user_info?.fullName || 'U')}&background=14b8a6&color=fff&size=60`}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    alt=""
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
  const admin = isAdmin()

  useEffect(() => {
    const url = admin
      ? 'http://localhost:5000/api/admin/feed'
      : null
    if (admin) {
      fetch(url, { headers: { Authorization: `Bearer ${token()}` } })
        .then(r => r.json())
        .then(d => { if (d.success) setPosts(d.posts) })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      getFeed()
        .then(r => setPosts(r.posts))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [])

  const handleRemove = (postId) => setPosts(prev => prev.filter(p => p._id !== postId))

  if (loading) return <FeedContainer><div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading feed...</div></FeedContainer>

  return (
    <FeedContainer>
      <Stories />
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem' }}>No posts yet — be the first to post!</p>
        </div>
      ) : posts.map(post => <PostItem key={post._id} post={post} onRemove={handleRemove} />)}
    </FeedContainer>
  )
}

export default Feed
