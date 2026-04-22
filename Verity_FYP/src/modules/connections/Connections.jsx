import { useState, useEffect } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CompleteProfileModal from '../shared/CompleteProfileModal'
import useProfileGuard from '../../utils/useProfileGuard'

const API = 'http://localhost:5000/api'
const token = () => localStorage.getItem('token')

const avatarUrl = (user) =>
  user.avatar?.startsWith('/uploads')
    ? `http://localhost:5000${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=cccccc&color=555&size=150`

const timeAgo = (date) => {
  if (!date) return ''
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo`
  return `${Math.floor(diff / 31536000)}y`
}

export default function Connections() {
  const [tab, setTab] = useState('suggestions')
  const [connections, setConnections] = useState([])
  const [requests, setRequests] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { guard, showModal, closeModal } = useProfileGuard()

  useEffect(() => {
    Promise.all([
      fetch(`${API}/users/connections`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${API}/users/requests`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${API}/users/all`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
    ]).then(([connData, reqData, allData]) => {
      if (connData.success) setConnections(connData.connections)
      if (reqData.success) setRequests(reqData.requests)
      if (allData.success) {
        // suggestions = users with no connection yet
        setSuggestions(allData.users.filter(u => u.connectionStatus === 'none'))
      }
    }).finally(() => setLoading(false))
  }, [])

  const accept = async (requesterId) => {
    if (!guard()) return
    const res = await fetch(`${API}/users/accept/${requesterId}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    if (data.success) {
      const accepted = requests.find(r => r.id === requesterId)
      setRequests(prev => prev.filter(r => r.id !== requesterId))
      if (accepted) setConnections(prev => [accepted, ...prev])
    }
  }

  const reject = async (requesterId) => {
    if (!guard()) return
    const res = await fetch(`${API}/users/reject/${requesterId}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    if (data.success) setRequests(prev => prev.filter(r => r.id !== requesterId))
  }

  const sendRequest = async (userId) => {
    if (!guard()) return
    const res = await fetch(`${API}/users/connect/${userId}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    if (data.success) {
      setSuggestions(prev => prev.filter(u => u.id !== userId))
    }
  }

  const filteredConnections = connections.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.5rem 1rem', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Friends</h1>
        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Search size={18} color="#0f172a" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['suggestions', 'friends'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.9rem',
            backgroundColor: tab === t ? '#0f172a' : '#e2e8f0',
            color: tab === t ? 'white' : '#0f172a',
          }}>
            {t === 'suggestions' ? 'Suggestions' : 'Your friends'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>Loading...</div>
      ) : (
        <>
          {/* ── SUGGESTIONS TAB ── */}
          {tab === 'suggestions' && (
            <>
              {/* Friend Requests section */}
              {requests.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      Friend requests <span style={{ color: '#ef4444' }}>{requests.length}</span>
                    </span>
                    <span style={{ color: '#1877f2', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>See all</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {requests.map(user => (
                      <div key={user.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <img
                          src={avatarUrl(user)}
                          alt={user.fullName}
                          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 2 }}>{user.fullName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#65676b', marginBottom: '0.6rem' }}>
                            {user.role} · {timeAgo(user.createdAt)}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => accept(user.id)} style={{
                              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                              fontWeight: 700, fontSize: '0.9rem', backgroundColor: '#1877f2', color: 'white'
                            }}>Confirm</button>
                            <button onClick={() => reject(user.id)} style={{
                              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                              fontWeight: 700, fontSize: '0.9rem', backgroundColor: '#e4e6eb', color: '#0f172a'
                            }}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* People You May Know */}
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                  People you may know
                </div>
                {suggestions.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', fontSize: '0.9rem' }}>No suggestions right now</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {suggestions.map(user => (
                      <div key={user.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <img
                          src={avatarUrl(user)}
                          alt={user.fullName}
                          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 2 }}>{user.fullName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#65676b', marginBottom: '0.6rem' }}>{user.role}</div>
                          <button onClick={() => sendRequest(user.id)} style={{
                            width: '100%', padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                            fontWeight: 700, fontSize: '0.9rem', backgroundColor: '#e7f3ff', color: '#1877f2'
                          }}>Add Friend</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── YOUR FRIENDS TAB ── */}
          {tab === 'friends' && (
            <>
              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search friends"
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: 20, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', backgroundColor: '#f1f5f9', boxSizing: 'border-box' }}
                />
              </div>

              {filteredConnections.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem', fontSize: '0.9rem' }}>
                  {search ? 'No friends match your search' : 'No friends yet — send some requests!'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredConnections.map(user => (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', borderRadius: 12, backgroundColor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <img
                        src={avatarUrl(user)}
                        alt={user.fullName}
                        style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{user.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#65676b' }}>{user.role}</div>
                      </div>
                      <button
                        onClick={() => { if (!guard()) return; navigate(`/messages/${user.id}`) }}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', backgroundColor: '#e4e6eb', color: '#0f172a' }}
                      >
                        <MessageCircle size={15} /> Message
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
      {showModal && <CompleteProfileModal onClose={closeModal} />}
    </div>
  )
}
