import { API_BASE, API_URL } from '../../config.js'
import { useState, useEffect, useMemo } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import CompleteProfileModal from '../shared/CompleteProfileModal'
import useProfileGuard from '../../utils/useProfileGuard'
import Avatar from '../../components/Avatar/Avatar'
import * as S from './Connections.styled'

const API = `${API_URL}`
const token = () => localStorage.getItem('token')

const avatarUrl = (user) =>
  user.avatar?.startsWith('/uploads')
    ? `${API_BASE}${user.avatar}`
    : user.avatar?.startsWith('http')
      ? user.avatar
      : undefined

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
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const search = useMemo(() => new URLSearchParams(location.search).get('search') || '', [location.search])
  const { guard, showModal, closeModal } = useProfileGuard()
  const { theme } = useTheme()

  useEffect(() => {
    Promise.all([
      fetch(`${API}/users/connections`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${API}/users/requests`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${API}/users/all`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
    ]).then(([connData, reqData, allData]) => {
      if (connData.success) setConnections(connData.connections)
      if (reqData.success) setRequests(reqData.requests)
      if (allData.success) {
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

  const normalizedSearch = search.toLowerCase().trim()
  const filteredConnections = connections.filter(u =>
    u.fullName.toLowerCase().includes(normalizedSearch) ||
    u.role.toLowerCase().includes(normalizedSearch)
  )
  const filteredSuggestions = suggestions.filter(u =>
    u.fullName.toLowerCase().includes(normalizedSearch) ||
    u.role.toLowerCase().includes(normalizedSearch)
  )

  return (
    <S.ConnectionsContainer theme={theme}>
      {}
      <S.Header>
        <S.Title>Discover People</S.Title>
        <S.SearchButton theme={theme}>
          <Search size={18} />
        </S.SearchButton>
      </S.Header>

      {}
      <S.TabsContainer>
        {['suggestions', 'friends'].map(t => (
          <S.TabButton
            key={t}
            $active={tab === t}
            onClick={() => setTab(t)}
            theme={theme}
          >
            {t === 'suggestions' ? 'Suggestions' : 'Your friends'}
          </S.TabButton>
        ))}
      </S.TabsContainer>

      {loading ? (
        <S.LoadingText theme={theme}>Loading...</S.LoadingText>
      ) : (
        <>
          {}
          {tab === 'suggestions' && (
            <>
              {}
              {requests.length > 0 && (
                <S.Section>
                  <S.SectionHeader>
                    <S.SectionTitle theme={theme}>
                      Friend requests <S.RequestBadge>{requests.length}</S.RequestBadge>
                    </S.SectionTitle>
                    <S.SeeAllLink theme={theme}>See all</S.SeeAllLink>
                  </S.SectionHeader>
                  <S.ItemsList>
                    {requests.map(user => (
                      <S.UserItem key={user.id} theme={theme}>
                        <Avatar src={avatarUrl(user)} name={user.fullName} alt={user.fullName} size={72} style={{ margin: '0 auto 0.75rem' }} />
                        <S.UserInfo>
                          <S.UserName theme={theme}>{user.fullName}</S.UserName>
                          <S.UserRole theme={theme}>
                            {user.role} · {timeAgo(user.createdAt)}
                          </S.UserRole>
                          <S.ButtonGroup>
                            <S.ConfirmButton
                              onClick={() => accept(user.id)}
                              theme={theme}
                            >
                              Confirm
                            </S.ConfirmButton>
                            <S.DeleteButton
                              onClick={() => reject(user.id)}
                              theme={theme}
                            >
                              Delete
                            </S.DeleteButton>
                          </S.ButtonGroup>
                        </S.UserInfo>
                      </S.UserItem>
                    ))}
                  </S.ItemsList>
                </S.Section>
              )}

              {}
              <S.Section>
                <S.SectionTitle theme={theme}>People you may know</S.SectionTitle>
                {filteredSuggestions.length === 0 ? (
                  <S.EmptyState theme={theme}>No suggestions right now</S.EmptyState>
                ) : (
                  <S.ItemsList>
                    {filteredSuggestions.map(user => (
                      <S.UserItem key={user.id} theme={theme}>
                        <Avatar src={avatarUrl(user)} name={user.fullName} alt={user.fullName} size={72} style={{ margin: '0 auto 0.75rem' }} />
                        <S.UserInfo>
                          <S.UserName theme={theme}>{user.fullName}</S.UserName>
                          <S.UserRole theme={theme}>{user.role}</S.UserRole>
                          <S.AddFriendButton
                            onClick={() => sendRequest(user.id)}
                            theme={theme}
                          >
                            Connect
                          </S.AddFriendButton>
                        </S.UserInfo>
                      </S.UserItem>
                    ))}
                  </S.ItemsList>
                )}
              </S.Section>
            </>
          )}

          {}
          {tab === 'friends' && (
            <>
              {}
              <S.SearchContainer>
                <Search size={16} style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.colors.textTertiary
                }} />
                <S.SearchInput
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search friends"
                  theme={theme}
                />
              </S.SearchContainer>

              {filteredConnections.length === 0 ? (
                <S.EmptyState theme={theme}>
                  {search ? 'No friends match your search' : 'No friends yet — send some requests!'}
                </S.EmptyState>
              ) : (
                <S.FriendsList>
                  {filteredConnections.map(user => (
                    <S.FriendItem key={user.id} theme={theme}>
                      <Avatar src={avatarUrl(user)} name={user.fullName} alt={user.fullName} size={80} style={{ margin: '0 auto 0.75rem' }} />
                      <S.FriendInfo>
                        <S.FriendName theme={theme}>{user.fullName}</S.FriendName>
                        <S.FriendRole theme={theme}>{user.role}</S.FriendRole>
                      </S.FriendInfo>
                      <S.MessageButton
                        onClick={() => { if (!guard()) return; navigate(`/messages/${user.id}`) }}
                        theme={theme}
                      >
                        <MessageCircle />
                        <span>Message</span>
                      </S.MessageButton>
                    </S.FriendItem>
                  ))}
                </S.FriendsList>
              )}
            </>
          )}
        </>
      )}
      {showModal && <CompleteProfileModal onClose={closeModal} />}
    </S.ConnectionsContainer>
  )
}

