import { API_BASE, API_URL, mediaUrl } from '../../config.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Grid, Bookmark, UserPlus, Heart, MessageCircle, Trash2, X } from 'lucide-react'
import { getCurrentUser, getProfile } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { useTheme } from '../../contexts/ThemeContext'
import Avatar from '../../components/Avatar/Avatar'
import {
  ProfileContainer,
  ProfileHeader,
  ProfileImageSection,
  EditImageButton,
  ProfileStats,
  StatItem,
  StatNumber,
  StatLabel,
  ProfileInfo,
  ProfileName,
  ProfileBio,
  ProfileWebsite,
  ProfileActions,
  EditProfileButton,
  SettingsButton,
  ProfileTabs,
  TabButton,
  TabIcon,
  PostsGrid,
  PostItem,
  PostImage,
  EmptyState
} from './Profile.styled'
function Profile() {
  const navigate = useNavigate()
  const toast = useToast()
  const { theme } = useTheme()
  const isDarkMode = theme.mode === 'dark'
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    loadProfile()
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/posts/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setPosts(data.posts)
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }
  const loadProfile = async () => {
    try {
      const response = await getProfile()
      console.log('[Profile] Loaded fresh profile from API:', response.user)
      localStorage.setItem('user', JSON.stringify(response.user))
      setUser(response.user)
    } catch (error) {
      console.error('[Profile] Failed to load profile from API:', error)
      try {
        const currentUser = getCurrentUser()
        if (!currentUser) {
          throw new Error('No user logged in')
        }
        console.log('[Profile] Falling back to localStorage user:', currentUser)
        setUser(currentUser)
      } catch (fallbackError) {
        console.error('[Profile] Fallback also failed:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }
  const handleEditProfile = () => {
    navigate('/profile/edit')
  }

  const handleApplyForReviewer = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/reviewer-request/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Your request has been sent to admin. Please wait for approval.')
      } else {
        toast.error(data.message || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Failed to apply for reviewer:', error)
      toast.error('Failed to submit request')
    }
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
    setShowModal(true)
  }

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setPosts(posts.filter(p => p._id !== postId))
        setShowModal(false)
        setSelectedPost(null)
        toast.success('Post deleted successfully')
      } else {
        toast.error(data.message || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast.error('Failed to delete post')
    }
  }
  if (loading) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading profile...
        </div>
      </ProfileContainer>
    )
  }
  if (!user) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Profile not found
        </div>
      </ProfileContainer>
    )
  }
  const avatarUrl = user.avatar?.startsWith('http') 
    ? user.avatar 
    : user.avatar?.startsWith('/uploads')
    ? `${API_BASE}${user.avatar}`
    : undefined
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileImageSection>
          <Avatar src={avatarUrl} name={user.fullName} alt={user.fullName} size={120} />
          <EditImageButton onClick={handleEditProfile}>
            <UserPlus size={20} />
          </EditImageButton>
        </ProfileImageSection>
        <ProfileStats>
          <StatItem>
            <StatNumber>{user.postsCount || 0}</StatNumber>
            <StatLabel>Posts</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{user.followersCount || 0}</StatNumber>
            <StatLabel>Followers</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{user.followingCount || 0}</StatNumber>
            <StatLabel>Following</StatLabel>
          </StatItem>
        </ProfileStats>
      </ProfileHeader>
      <ProfileInfo>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ProfileName>{user.fullName}</ProfileName>
          {user.role === 'Reviewer' && (
            <div style={{
              backgroundColor: '#10b981',
              color: 'white',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
        {user.bio && <ProfileBio>{user.bio}</ProfileBio>}
        {user.website && (
          <ProfileWebsite href={user.website} target="_blank" rel="noopener noreferrer">
            {user.website}
          </ProfileWebsite>
        )}
      </ProfileInfo>
      <ProfileActions>
        <EditProfileButton onClick={handleEditProfile}>
          Edit Profile
        </EditProfileButton>
        {user.role !== 'Reviewer' && (
          <EditProfileButton onClick={handleApplyForReviewer} style={{ backgroundColor: '#6366f1', color: 'white' }}>
            Apply for Reviewer
          </EditProfileButton>
        )}
        <SettingsButton onClick={() => navigate('/settings')}>
          <Settings size={20} />
        </SettingsButton>
      </ProfileActions>
      <ProfileTabs>
        <TabButton $active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
          <TabIcon><Grid size={20} /></TabIcon>
          POSTS
        </TabButton>
        <TabButton $active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
          <TabIcon><Bookmark size={20} /></TabIcon>
          SAVED
        </TabButton>
      </ProfileTabs>
      {activeTab === 'posts' && (
        <PostsGrid>
          {posts.length === 0 ? (
            <EmptyState>
              <Grid size={64} />
              <h3>No Posts Yet</h3>
              <p>When you share photos and videos, they'll appear on your profile.</p>
            </EmptyState>
          ) : (
            posts.map((post) => (
              <PostItem key={post._id} onClick={() => handlePostClick(post)} style={{ cursor: 'pointer' }}>
                {post.media?.[0] ? (
                  <PostImage src={mediaUrl(post.media[0].url)} alt="Post" />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{post.content}</span>
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  padding: '1rem 0.5rem 0.5rem',
                  display: 'flex',
                  gap: '1rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Heart size={16} fill="white" /> {post.likes?.length || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MessageCircle size={16} /> {post.comments?.length || 0}
                  </span>
                </div>
              </PostItem>
            ))
          )}
        </PostsGrid>
      )}
      {activeTab === 'saved' && (
        <EmptyState>
          <Bookmark size={64} />
          <h3>Save</h3>
          <p>Save photos and videos that you want to see again.</p>
        </EmptyState>
      )}

      {}
      {showModal && selectedPost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            overflow: 'hidden',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            {}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
              <X size={20} />
            </button>

            {}
            <div style={{
              flex: 1,
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedPost.media?.[0] ? (
                selectedPost.media[0].type === 'video' ? (
                  <video
                    src={mediaUrl(selectedPost.media[0].url)}
                    controls
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <img
                    src={mediaUrl(selectedPost.media[0].url)}
                    alt="Post"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                )
              ) : (
                <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
                  <p>{selectedPost.content}</p>
                </div>
              )}
            </div>

            {}
            <div style={{
              width: '340px',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary
            }}>
              {}
              <div style={{
                padding: '1rem',
                borderBottom: `1px solid ${theme.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <img
                  src={avatarUrl}
                  alt={user.fullName}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem', color: theme.colors.textPrimary }}>{user.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {}
              <div style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto'
              }}>
                {selectedPost.content && (
                  <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: theme.colors.textPrimary }}>
                    {selectedPost.content}
                  </p>
                )}
                {selectedPost.hashtags?.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    {selectedPost.hashtags.map((tag, idx) => (
                      <span key={idx} style={{ color: '#0ea5e9', fontSize: '0.875rem', marginRight: '0.5rem' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {}
              <div style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                <div style={{
                  padding: '1rem',
                  display: 'flex',
                  gap: '2rem',
                  fontSize: '0.875rem',
                  color: theme.colors.textSecondary
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={20} /> {selectedPost.likes?.length || 0} likes
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageCircle size={20} /> {selectedPost.comments?.length || 0} comments
                  </span>
                </div>

                {}
                <div style={{ padding: '0 1rem 1rem' }}>
                  <button
                    onClick={() => handleDeletePost(selectedPost._id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                    <Trash2 size={16} />
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProfileContainer>
  )
}
export default Profile

