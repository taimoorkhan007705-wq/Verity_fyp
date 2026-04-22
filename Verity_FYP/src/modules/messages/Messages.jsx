import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, MessageCircle, ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '../../services/api'
import CompleteProfileModal from '../shared/CompleteProfileModal'
import useProfileGuard from '../../utils/useProfileGuard'

const API = 'http://localhost:5000/api'
const token = () => localStorage.getItem('token')

const avatarUrl = (user) =>
  user?.avatar?.startsWith('/uploads')
    ? `http://localhost:5000${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14b8a6&color=fff&size=150`

export default function Messages() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const { guard, showModal, closeModal } = useProfileGuard()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [otherUser, setOtherUser] = useState(null)
  const [text, setText] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/users/conversations`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setConversations(d.conversations) })
      .finally(() => setLoadingConvs(false))
  }, [])

  useEffect(() => {
    if (!userId) return
    fetch(`${API}/users/profiles/${userId}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setOtherUser(d.user) })
    loadMessages()
  }, [userId])

  const loadMessages = () => {
    if (!userId) return
    fetch(`${API}/users/messages/${userId}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setMessages(d.messages) })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMsg = async (e) => {
    e.preventDefault()
    if (!guard()) return
    if (!text.trim()) return
    const res = await fetch(`${API}/users/messages/${userId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text.trim() })
    })
    const data = await res.json()
    if (data.success) {
      setMessages(prev => [...prev, data.message])
      setText('')
      // refresh conversations
      fetch(`${API}/users/conversations`, { headers: { Authorization: `Bearer ${token()}` } })
        .then(r => r.json()).then(d => { if (d.success) setConversations(d.conversations) })
    }
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 40px)', margin: '20px', gap: '1rem' }}>
      {/* Conversation list */}
      <div style={{ width: 300, minWidth: 300, background: 'white', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', fontWeight: 900, fontSize: '1.1rem' }}>Messages</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingConvs ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              <MessageCircle size={40} style={{ opacity: 0.4, marginBottom: 8 }} />
              <p style={{ fontSize: '0.875rem' }}>No conversations yet</p>
            </div>
          ) : conversations.map(conv => (
            <div
              key={conv.conversationId}
              onClick={() => navigate(`/messages/${conv.other.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem',
                cursor: 'pointer', borderBottom: '1px solid #f8fafc',
                backgroundColor: userId === conv.other.id ? '#f0fdfa' : 'white',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => { if (userId !== conv.other.id) e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={e => { if (userId !== conv.other.id) e.currentTarget.style.backgroundColor = 'white' }}
            >
              <img src={avatarUrl(conv.other)} alt={conv.other.fullName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #14b8a6' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{conv.other.fullName}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.lastMessage?.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, background: 'white', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {!userId ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <MessageCircle size={56} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontWeight: 700 }}>Select a conversation</p>
            <p style={{ fontSize: '0.875rem' }}>or go to Connections to start chatting</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => navigate('/messages')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                <ArrowLeft size={20} />
              </button>
              {otherUser && (
                <>
                  <img src={avatarUrl(otherUser)} alt={otherUser.fullName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #14b8a6' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{otherUser.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 600 }}>{otherUser.role}</div>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {messages.map(msg => {
                const isMine = msg.sender?.toString() === currentUser?.id?.toString()
                return (
                  <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '65%', padding: '0.625rem 1rem', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      backgroundColor: isMine ? '#14b8a6' : '#f1f5f9',
                      color: isMine ? 'white' : '#0f172a',
                      fontSize: '0.9rem', lineHeight: 1.5
                    }}>
                      <div>{msg.message}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: 2, textAlign: 'right' }}>{formatTime(msg.createdAt)}</div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMsg} style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem' }}>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" style={{ backgroundColor: '#14b8a6', color: 'white', border: 'none', borderRadius: 12, padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Send size={18} />
              </button>
            </form>
          </>
        )}
      </div>
      {showModal && <CompleteProfileModal onClose={closeModal} />}
    </div>
  )
}
