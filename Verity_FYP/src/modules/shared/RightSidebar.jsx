import { useState, useEffect } from 'react'
import { Award, Settings, X, Lock, Bell, Mail, LogOut, User, Shield } from 'lucide-react'
import { getCurrentUser, getReviewerStats, getReviewerLeaderboard } from '../../services/api'
import Avatar from '../../components/Avatar/Avatar'
import { mediaUrl, API_BASE } from '../../config.js'
import {
  RightSidebarContainer,
  RightSidebarHeader,
  LogoSection,
  LogoBox,
  ReviewerButton,
  SettingsButton,
  ButtonsContainer,
  SidebarCloseButton,
  Divider,
  LeaderboardContent,
  LeaderboardHeader,
  LeaderboardList,
  ReviewerItem,
  CurrentUserCard,
  NoDataMessage,
  SettingsContent,
  SettingsSection,
  SettingItem,
  SettingLabel,
  SettingDescription,
  SettingControl,
  SettingInput,
  SettingButton,
  ToggleSwitch,
} from './RightSidebar.styled'

function RightSidebar() {
  const user = getCurrentUser()
  const [isOpen, setIsOpen] = useState(true)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [stats, setStats] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    pendingReviews: 0,
    accuracy: 0
  })
  const [leaderboard, setLeaderboard] = useState([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false,
    profileVisibility: 'public',
    dataCollection: true,
  })
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('')
  const [passwordChangeError, setPasswordChangeError] = useState('')

  useEffect(() => {
    if (showLeaderboard) {
      loadLeaderboard()
    }
  }, [showLeaderboard])

  useEffect(() => {
    // Listen for Settings click from Sidebar
    const handleOpenSettings = () => {
      setShowSettings(true)
      setShowLeaderboard(false)
      setIsOpen(true)
      localStorage.removeItem('openRightSidebarSettings')
    }

    window.addEventListener('openSettings', handleOpenSettings)
    return () => window.removeEventListener('openSettings', handleOpenSettings)
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true)
      const response = await getReviewerLeaderboard()
      
      if (response?.leaderboard && Array.isArray(response.leaderboard)) {
        setLeaderboard(response.leaderboard)
      } else {
        setLeaderboard([])
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
      setLeaderboard([])
    } finally {
      setLoadingLeaderboard(false)
    }
  }

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard)
    setIsOpen(!showLeaderboard)  // Auto-expand when opening leaderboard
    if (showSettings) setShowSettings(false)
  }

  const closeLeaderboard = () => {
    setShowLeaderboard(false)
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
    setIsOpen(!showSettings)  // Auto-expand when opening settings
    if (showLeaderboard) setShowLeaderboard(false)
  }

  const closeSettings = () => {
    setShowSettings(false)
  }

  const handleSettingChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    })
    setPasswordChangeMessage('')
    setPasswordChangeError('')
  }

  const handlePasswordChange = async () => {
    setPasswordChangeError('')
    setPasswordChangeMessage('')

    if (!settings.currentPassword) {
      setPasswordChangeError('Current password is required')
      return
    }
    if (!settings.newPassword) {
      setPasswordChangeError('New password is required')
      return
    }
    if (settings.newPassword !== settings.confirmPassword) {
      setPasswordChangeError('Passwords do not match')
      return
    }
    if (settings.newPassword.length < 8) {
      setPasswordChangeError('Password must be at least 8 characters')
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('verity_user_token') || localStorage.getItem('verity_reviewer_token') || localStorage.getItem('verity_business_token')}`
        },
        body: JSON.stringify({
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword
        })
      })

      if (response.ok) {
        setPasswordChangeMessage('✅ Password changed successfully!')
        setSettings({
          ...settings,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          setPasswordChangeMessage('')
        }, 3000)
      } else {
        const error = await response.json()
        setPasswordChangeError(error.message || 'Failed to change password')
      }
    } catch (error) {
      setPasswordChangeError('Error changing password. Please try again.')
      console.error('Password change error:', error)
    }
  }

  const handleToggleSetting = (field) => {
    handleSettingChange(field, !settings[field])
  }

  const getTrustScoreColor = (score) => {
    if (score >= 90) return '#10b981'
    if (score >= 80) return '#14b8a6'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <>
      {/* Right Sidebar */}
      <RightSidebarContainer $isOpen={isOpen}>
        {/* Header with Logo */}
        <LogoSection>
          <RightSidebarHeader>
            <ButtonsContainer>
              <ReviewerButton 
                onClick={toggleLeaderboard}
                title="Reviewer Leaderboard"
                $isActive={showLeaderboard}
              >
                <LogoBox>
                  <Award size={24} />
                </LogoBox>
              </ReviewerButton>
              <SettingsButton 
                onClick={toggleSettings}
                title="Settings"
                $isActive={showSettings}
              >
                <LogoBox>
                  <Settings size={24} />
                </LogoBox>
              </SettingsButton>
            </ButtonsContainer>
            {isOpen && (
              <SidebarCloseButton 
                onClick={() => {
                  setIsOpen(false)
                  setShowLeaderboard(false)
                  setShowSettings(false)
                }}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </SidebarCloseButton>
            )}
          </RightSidebarHeader>
        </LogoSection>

        <Divider />

        {/* Leaderboard Content */}
        {showLeaderboard && isOpen && (
          <LeaderboardContent>
            <LeaderboardHeader>
              <span>Top Reviewers ({leaderboard.length})</span>
            </LeaderboardHeader>

            {/* Current User Stats */}
            {user?.role === 'Reviewer' && (
              <CurrentUserCard>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>
                    ⭐
                  </div>
                  <img 
                    src={
                      user?.avatar?.startsWith('http') 
                        ? user.avatar 
                        : user?.avatar?.startsWith('/uploads')
                        ? `${API_BASE}${user.avatar}`
                        : 'https://via.placeholder.com/50'
                    }
                    alt={user?.fullName}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #14b8a6',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user?.fullName}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '900',
                      color: getTrustScoreColor(stats.accuracy),
                    }}>
                      {stats.accuracy}%
                    </div>
                  </div>
                </div>
              </CurrentUserCard>
            )}

            {/* Leaderboard List */}
            {loadingLeaderboard ? (
              <NoDataMessage>⏳ Loading...</NoDataMessage>
            ) : leaderboard.length > 0 ? (
              <LeaderboardList>
                {leaderboard.slice(0, 10).map((reviewer, idx) => (
                  <ReviewerItem key={reviewer.id}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '900',
                      minWidth: '28px'
                    }}>
                      {getRankBadge(reviewer.rank)}
                    </div>
                    <Avatar
                      src={reviewer.avatar ? mediaUrl(reviewer.avatar) : undefined}
                      name={reviewer.fullName}
                      alt={reviewer.fullName}
                      size={32}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {reviewer.fullName}
                      </div>
                      <div style={{
                        fontSize: '0.65rem',
                        color: '#64748b'
                      }}>
                        {reviewer.reviewsCompleted} reviews
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: getTrustScoreColor(reviewer.trustScore),
                    }}>
                      {reviewer.trustScore}%
                    </div>
                  </ReviewerItem>
                ))}
              </LeaderboardList>
            ) : (
              <NoDataMessage>📊 No reviewers yet</NoDataMessage>
            )}
          </LeaderboardContent>
        )}

        {/* Settings Content */}
        {showSettings && isOpen && (
          <SettingsContent>
            <SettingsSection>
              <SettingLabel style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
                🔐 Security
              </SettingLabel>

              {/* Change Password */}
              <SettingItem>
                <div>
                  <SettingLabel style={{ fontSize: '0.8125rem' }}>
                    <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Change Password
                  </SettingLabel>
                  <SettingDescription>Update your account password</SettingDescription>
                </div>
              </SettingItem>

              <SettingInput
                type="password"
                placeholder="Current password"
                value={settings.currentPassword}
                onChange={(e) => handleSettingChange('currentPassword', e.target.value)}
              />
              <SettingInput
                type="password"
                placeholder="New password"
                value={settings.newPassword}
                onChange={(e) => handleSettingChange('newPassword', e.target.value)}
              />
              <SettingInput
                type="password"
                placeholder="Confirm new password"
                value={settings.confirmPassword}
                onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
              />

              {passwordChangeError && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  ⚠️ {passwordChangeError}
                </div>
              )}
              {passwordChangeMessage && (
                <div style={{ color: '#10b981', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {passwordChangeMessage}
                </div>
              )}

              <SettingButton onClick={handlePasswordChange}>
                Update Password
              </SettingButton>
            </SettingsSection>

            <Divider style={{ margin: '1rem 0' }} />

            <SettingsSection>
              <SettingLabel style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
                🔔 Notifications
              </SettingLabel>

              <SettingItem>
                <div>
                  <SettingLabel style={{ fontSize: '0.8125rem' }}>
                    <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Email Notifications
                  </SettingLabel>
                  <SettingDescription>Receive updates via email</SettingDescription>
                </div>
                <ToggleSwitch
                  checked={settings.emailNotifications}
                  onChange={() => handleToggleSetting('emailNotifications')}
                />
              </SettingItem>

              <SettingItem>
                <div>
                  <SettingLabel style={{ fontSize: '0.8125rem' }}>
                    <Bell size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Push Notifications
                  </SettingLabel>
                  <SettingDescription>Receive browser notifications</SettingDescription>
                </div>
                <ToggleSwitch
                  checked={settings.pushNotifications}
                  onChange={() => handleToggleSetting('pushNotifications')}
                />
              </SettingItem>
            </SettingsSection>

            <Divider style={{ margin: '1rem 0' }} />

            <SettingsSection>
              <SettingLabel style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
                👤 Privacy
              </SettingLabel>

              <SettingItem>
                <div>
                  <SettingLabel style={{ fontSize: '0.8125rem' }}>
                    <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Profile Visibility
                  </SettingLabel>
                  <SettingDescription>Who can see your profile</SettingDescription>
                </div>
                <select 
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    fontSize: '0.8125rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </SettingItem>

              <SettingItem>
                <div>
                  <SettingLabel style={{ fontSize: '0.8125rem' }}>
                    <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Two-Factor Authentication
                  </SettingLabel>
                  <SettingDescription>Add extra security to your account</SettingDescription>
                </div>
                <ToggleSwitch
                  checked={settings.twoFactorAuth}
                  onChange={() => handleToggleSetting('twoFactorAuth')}
                />
              </SettingItem>

              <SettingItem>
                <div>
                  <SettingLabel style={{ fontSize: '0.8125rem' }}>
                    📊 Data Collection
                  </SettingLabel>
                  <SettingDescription>Allow usage analytics</SettingDescription>
                </div>
                <ToggleSwitch
                  checked={settings.dataCollection}
                  onChange={() => handleToggleSetting('dataCollection')}
                />
              </SettingItem>
            </SettingsSection>

            <Divider style={{ margin: '1rem 0' }} />

            <SettingsSection style={{ paddingBottom: '1rem' }}>
              <SettingButton 
                onClick={() => {
                  // Handle logout
                  localStorage.clear()
                  window.location.href = '/login'
                }}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  marginTop: '0.5rem'
                }}
              >
                <LogOut size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Sign Out
              </SettingButton>
            </SettingsSection>
          </SettingsContent>
        )}
      </RightSidebarContainer>

      {/* Backdrop for Leaderboard */}
      {showLeaderboard && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 999,
            display: 'none'
          }}
          onClick={closeLeaderboard}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default RightSidebar
