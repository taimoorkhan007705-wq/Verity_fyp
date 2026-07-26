import { API_BASE, API_URL, mediaUrl } from '../../config.js'
import { useState, useEffect } from 'react'
import { XCircle, AlertTriangle, Trash2, ImageOff } from 'lucide-react'
import { useBadges } from '../../contexts/BadgeContext'
import { useToast } from '../../contexts/ToastContext'

const API = `${API_URL}`
const token = () => localStorage.getItem('token')

const formatTime = (ts) => {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return new Date(ts).toLocaleDateString()
}

export default function RejectedPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { markRejectionsVisited } = useBadges()
  const toast = useToast()

  useEffect(() => {
    // Mark rejections as visited when component mounts
    markRejectionsVisited()
    
    fetch(`${API}/posts/my/rejected`, {
      headers: { Authorization: `Bearer ${token()}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setPosts(d.posts) })
      .finally(() => setLoading(false))
  }, [markRejectionsVisited])

  const deletePost = async (id) => {
    const r = await fetch(`${API}/posts/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.json())
    if (r.success) {
      setPosts(prev => prev.filter(p => p._id !== id))
      toast.success('Post removed from rejected list')
    } else {
      toast.error('Failed to remove post')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <XCircle size={24} color="#ef4444" />
        <h2 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#0f172a', margin: 0 }}>
          Rejected Posts
        </h2>
        {posts.length > 0 && (
          <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.8rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
            {posts.length}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          <XCircle size={52} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ fontWeight: 700, fontSize: '1rem' }}>No rejected posts</p>
          <p style={{ fontSize: '0.875rem' }}>All your posts passed verification.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(post => (
            <div key={post._id} style={{
              background: 'white', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #fee2e2'
            }}>
              {}
              <div style={{ backgroundColor: '#ef4444', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={15} color="white" />
                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.82rem' }}>Post Rejected</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginLeft: 'auto' }}>{formatTime(post.createdAt)}</span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                {}
                <div style={{ backgroundColor: '#fff7f7', border: '1px solid #fecaca', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#dc2626', marginBottom: 2 }}>Reason</div>
                    <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                      {post.reviewNotes || 'AI-generated content detected'}
                    </div>
                  </div>
                </div>

                {}
                {post.content && (
                  <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {post.content}
                  </p>
                )}

                {}
                {post.media?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    {post.media.map((item, idx) => (
                      item.type === 'image' ? (
                        <img
                          key={idx}
                          src={mediaUrl(item.url)}
                          alt="rejected media"
                          style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '2px solid #fecaca', filter: 'grayscale(30%)' }}
                        />
                      ) : (
                        <div key={idx} style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fecaca' }}>
                          <ImageOff size={24} color="#94a3b8" />
                        </div>
                      )
                    ))}
                  </div>
                )}

                {}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => deletePost(post._id)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '0.82rem'
                  }}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

