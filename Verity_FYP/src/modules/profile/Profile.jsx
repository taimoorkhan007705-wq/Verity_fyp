import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Grid, Bookmark, UserPlus } from 'lucide-react'
import { getCurrentUser, getProfile } from '../../services/api'
import {
  ProfileContainer,
  ProfileHeader,
  ProfileImageSection,
  ProfileImage,
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
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadProfile()
  }, [])
  const loadProfile = async () => {
    try {
      const response = await getProfile()
      setUser(response.user)
    } catch (error) {
      console.error('Failed to load profile:', error)
      const currentUser = getCurrentUser()
      setUser(currentUser)
    } finally {
      setLoading(false)
    }
  }
  const handleEditProfile = () => {
    navigate('/profile/edit')
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
    ? `http://localhost:5000${user.avatar}`
    : 'https://via.placeholder.com/150'
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileImageSection>
          <ProfileImage src={avatarUrl} alt={user.fullName} />
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
              <PostItem key={post._id}>
                <PostImage src={post.media[0]?.url} alt="Post" />
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
    </ProfileContainer>
  )
}
export default Profile
