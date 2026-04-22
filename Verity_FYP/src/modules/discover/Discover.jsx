import { useState, useEffect } from 'react'
import { UserPlus, UserCheck, Clock, Search, ShieldOff, Shield } from 'lucide-react'
import CompleteProfileModal from '../shared/CompleteProfileModal'
import useProfileGuard from '../../utils/useProfileGuard'

const isAdmin = () => { try { return JSON.parse(localStorage.getItem('user'))?.role === 'Admin' } catch { return false } }

const API = 'http://localhost:5000/api'
const token = () => localStorage.getItem('token')

const avatarUrl = (user) =>
  user.avatar?.startsWith('/uploads')
    ? `http://localhost:5000${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=14b8a6&color=fff&size=150`

const btnConfig = {
  none:             { label: 'Connect',           icon: UserPlus,  bg: '#14b8a6', color: 'white' },
  pending_sent:     { label: 'Requested',          icon: Clock,     bg: '#f1f5f9', color: '#64748b' },
  pending_received: { label: 'Respond in Requests',icon: Clock,     bg: '#fef9c3', color: '#92400e' },
  active:           { label: 'Connected',          icon: UserCheck, bg: '#f0fdf4', color: '#16a34a' },
}

export default function Discover() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { guard, showModal, closeModal } = useProfileGuard()
  const admin = isAdmin()

  const loadUsers = () => {
    fetch(`${API}/users/all`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setUsers(d.users) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const handleConnect = async (userId, currentStatus) => {
    if (!guard()) return
    if (currentStatus === 'active' || currentStatus === 'pending_received') return
    const res = await fetch(`${API}/users/connect/${userId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    if (data.success) {
      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, connectionStatus: data.status === 'pending' ? 'pending_sent' : 'none' }
          : u
      ))
    }
  }

  const handleBan = async (userId) => {
    const r = await fetch(`http://localhost:5000/api/admin/users/${userId}/ban`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.json())
    if (r.success) setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: r.isBanned } : u))
  }

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>Discover People</h2>

      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(user => {
            const status = user.connectionStatus || 'none'
            const btn = btnConfig[status]
            const Icon = btn.icon
            return (
              <div key={user.id} style={{ background: 'white', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <img src={avatarUrl(user)} alt={user.fullName} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #14b8a6', marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{user.fullName}</div>
                <div style={{ fontSize: '0.8rem', color: '#14b8a6', fontWeight: 700, marginBottom: '0.5rem' }}>{user.role}</div>
                {user.bio && <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: 1.4 }}>{user.bio}</div>}
                <button
                  onClick={() => handleConnect(user.id, status)}
                  disabled={status === 'active' || status === 'pending_received'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                    width: '100%', padding: '9px 0', borderRadius: 10, border: 'none',
                    cursor: status === 'active' || status === 'pending_received' ? 'default' : 'pointer',
                    fontWeight: 700, fontSize: '0.875rem',
                    backgroundColor: btn.bg, color: btn.color, transition: 'all 0.2s'
                  }}
                >
                  <Icon size={16} /> {btn.label}
                </button>
                {admin && (
                  <button
                    onClick={() => handleBan(user.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                      width: '100%', padding: '9px 0', borderRadius: 10, border: 'none',
                      cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', marginTop: 6,
                      backgroundColor: user.isBanned ? '#dcfce7' : '#fee2e2',
                      color: user.isBanned ? '#16a34a' : '#dc2626'
                    }}
                  >
                    {user.isBanned ? <><Shield size={15} /> Unban</> : <><ShieldOff size={15} /> Ban</>}
                  </button>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>No users found</div>
          )}
        </div>
      )}
      {showModal && <CompleteProfileModal onClose={closeModal} />}
    </div>
  )
}
