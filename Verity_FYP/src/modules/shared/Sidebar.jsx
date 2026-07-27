import { API_BASE, API_URL } from '../../config.js'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  MessageCircle, 
  Users, 
  Compass, 
  PlusSquare, 
  User, 
  Settings,
  LogOut,
  ClipboardCheck,
  BarChart3,
  ShoppingBag,
  Shield,
  XCircle,
  X,
  AlertTriangle
} from 'lucide-react'
import { getCurrentUser, logout as apiLogout } from '../../services/api'
import NotificationBadge from '../../components/Badge/NotificationBadge'
import { useBadges } from '../../contexts/BadgeContext'
import Avatar from '../../components/Avatar/Avatar'
import DarkModeToggle from '../../components/DarkModeToggle/DarkModeToggle'
import {
  SidebarContainer,
  SidebarHeader,
  SidebarCloseButton,
  LogoSection,
  LogoContainer,
  LogoBox,
  BrandName,
  Divider,
  NavigationMenu,
  MenuList,
  Feed_Button,
  Messages_Button,
  Connections_Button,
  Discover_Button,
  CreatePost_Button,
  Profile_Button,
  Settings_Button,
  UserProfileSection,
  UserProfileButton,
  UserInfo,
  UserName,
  UserEmail,
  LogoutIconButton,
  UserMenu,
  UserMenuItem,
  SignOutButton,
  ThemeToggleSection,
} from './Sidebar.styled'
function Sidebar({ isOpen, setsidebarOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.fullName) {
      const nameParts = currentUser.fullName.split(' ')
      const uniqueParts = [...new Set(nameParts)]
      return { ...currentUser, fullName: uniqueParts.join(' ') }
    }
    return currentUser
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const { badges, refreshBadges } = useBadges()

  useEffect(() => {
    refreshBadges()
  }, [location.pathname, refreshBadges])
  const handleMenuItemClick = () => {
    // Only close sidebar on mobile when clicking a menu item
    if (window.innerWidth <= 639) {
      setsidebarOpen(false)
    }
  }

  const handleLogoClick = () => {
    setsidebarOpen(!isOpen)
  }
  const handleManageAccount = () => {
    setMenuOpen(false)
    navigate('/profile')
  }
  const handleSignOut = () => {
    apiLogout()
    navigate('/')
    window.location.reload() // Reload to clear state
  }

  const handleSettingsClick = () => {
    // Signal RightSidebar to open settings
    localStorage.setItem('openRightSidebarSettings', 'true')
    // Trigger a custom event that RightSidebar can listen to
    window.dispatchEvent(new Event('openSettings'))
    handleMenuItemClick()
  }
  
  const handlePanelClick = () => {
    // If already on admin panel, go back
    if (location.pathname === '/admin') {
      navigate(-1)
    } else {
      navigate('/admin')
    }
    handleMenuItemClick()
  }
  const isFeedActive = location.pathname === '/feed' || location.pathname === '/'
  const isMessagesActive = location.pathname.startsWith('/messages')
  const isConnectionsActive = location.pathname === '/connections'
  const isDiscoverActive = location.pathname === '/discover'
  const isCreatePostActive = location.pathname === '/create-post'
  const isProfileActive = location.pathname.startsWith('/profile')
  const isReviewCenterActive = location.pathname === '/review-center'
  const isShoppingActive = location.pathname.startsWith('/shopping')
  const isRejectedActive = location.pathname === '/rejected-posts'
  const isRequestsActive = location.pathname === '/admin/requests'
  const isReviewer = user?.role === 'Reviewer'
  const isBusiness = user?.role === 'Business'
  const isAdmin = user?.role === 'Admin'
  return (
    <SidebarContainer $isOpen={isOpen}>
      {}
      <LogoSection>
        <SidebarHeader>
          <LogoContainer onClick={handleLogoClick}>
            <LogoBox>V</LogoBox>
            <BrandName $isOpen={isOpen}>Verity</BrandName>
          </LogoContainer>
          {isOpen && (
            <SidebarCloseButton onClick={() => setsidebarOpen(false)} aria-label="Close sidebar">
              <X size={18} />
            </SidebarCloseButton>
          )}
        </SidebarHeader>
        <Divider />
      </LogoSection>
      {}
      <NavigationMenu>
        <MenuList>
          {}
          {isReviewer && (
            <>
              <Feed_Button to="/review-center" $isActive={isReviewCenterActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <ClipboardCheck />
                <span>Review Center</span>
              </Feed_Button>
              <Connections_Button to="/feed" $isActive={isFeedActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <NotificationBadge count={badges.newFeedAuthors} feedMode>
                  <Home />
                </NotificationBadge>
                <span>Feed</span>
              </Connections_Button>
              <Discover_Button to="/shopping" $isActive={isShoppingActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <ShoppingBag />
                <span>Shopping</span>
              </Discover_Button>
              <Discover_Button to="/messages" $isActive={isMessagesActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <NotificationBadge count={badges.unreadMessages}>
                  <MessageCircle />
                </NotificationBadge>
                <span>Messages</span>
              </Discover_Button>
              <Profile_Button to="/connections" $isActive={isConnectionsActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <Users />
                <span>Connections</span>
              </Profile_Button>
              <CreatePost_Button to="/create-post" $isActive={isCreatePostActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <PlusSquare />
                <span>Create Post</span>
              </CreatePost_Button>
              <Profile_Button to="/profile" $isActive={isProfileActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <User />
                <span>Profile</span>
              </Profile_Button>
              <Settings_Button as="button" $isActive={false} $isOpen={isOpen} onClick={handleSettingsClick}>
                <Settings />
                <span>Settings</span>
              </Settings_Button>
            </>
          )}
          {isAdmin && (
            <>
              <Feed_Button to="/feed" $isActive={isFeedActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <NotificationBadge count={badges.newFeedAuthors} feedMode>
                  <Home />
                </NotificationBadge>
                <span>Feed</span>
              </Feed_Button>
              <Discover_Button to="/discover" $isActive={isDiscoverActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <Compass /><span>Discover</span>
              </Discover_Button>
              <Connections_Button to="/connections" $isActive={isConnectionsActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <Users /><span>Connections</span>
              </Connections_Button>
              <Messages_Button to="/messages" $isActive={isMessagesActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <NotificationBadge count={badges.unreadMessages}>
                  <MessageCircle />
                </NotificationBadge>
                <span>Messages</span>
              </Messages_Button>
              <CreatePost_Button to="/create-post" $isActive={isCreatePostActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <PlusSquare /><span>Create Post</span>
              </CreatePost_Button>
              <Profile_Button to="/profile" $isActive={isProfileActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <User /><span>Profile</span>
              </Profile_Button>
              <Settings_Button as="button" $isActive={false} $isOpen={isOpen} onClick={handleSettingsClick}>
                <Settings />
                <span>Settings</span>
              </Settings_Button>
              <Profile_Button to="/admin" $isActive={isRequestsActive} $isOpen={isOpen} onClick={handlePanelClick} as="button">
                <AlertTriangle /><span>Panel</span>
              </Profile_Button>
            </>
          )}
          {}
          {!isReviewer && !isBusiness && !isAdmin && (
            <>
              <Feed_Button to="/feed" $isActive={isFeedActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <NotificationBadge count={badges.newFeedAuthors} feedMode>
                  <Home />
                </NotificationBadge>
                <span>Feed</span>
              </Feed_Button>
              <Discover_Button to="/shopping" $isActive={isShoppingActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <ShoppingBag />
                <span>Shopping</span>
              </Discover_Button>
              <Messages_Button to="/messages" $isActive={isMessagesActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <NotificationBadge count={badges.unreadMessages}>
                  <MessageCircle />
                </NotificationBadge>
                <span>Messages</span>
              </Messages_Button>
              <Connections_Button to="/connections" $isActive={isConnectionsActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <Users />
                <span>Connections</span>
              </Connections_Button>
              <Discover_Button to="/discover" $isActive={isDiscoverActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <Compass />
                <span>Discover</span>
              </Discover_Button>
              <CreatePost_Button to="/create-post" $isActive={isCreatePostActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <PlusSquare />
                <span>Create Post</span>
              </CreatePost_Button>
              <Profile_Button to="/rejected-posts" $isActive={isRejectedActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <NotificationBadge count={badges.unreadRejections}>
                  <XCircle />
                </NotificationBadge>
                <span>Rejected Posts</span>
              </Profile_Button>
              <Profile_Button to="/profile" $isActive={isProfileActive} $isOpen={isOpen} onClick={handleMenuItemClick}>
                <User />
                <span>Profile</span>
              </Profile_Button>
            </>
          )}
        </MenuList>
      </NavigationMenu>
      <ThemeToggleSection $isOpen={isOpen}>
        <DarkModeToggle />
        {isOpen && <span>Dark mode</span>}
      </ThemeToggleSection>
      {}
      <UserProfileSection>
        <UserProfileButton onClick={() => setMenuOpen(!menuOpen)}>
          <Avatar
            src={
              user?.avatar?.startsWith('http')
                ? user.avatar
                : user?.avatar?.startsWith('/uploads')
                  ? `${API_BASE}${user.avatar}`
                  : undefined
            }
            name={user?.fullName || 'User'}
            alt={user?.fullName || 'User'}
            size={44}
          />
          <UserInfo $isOpen={isOpen}>
            <UserName>{user?.fullName || "User"}</UserName>
            <UserEmail>{user?.email?.toLowerCase() || "user@verity.com"}</UserEmail>
          </UserInfo>
          <LogoutIconButton 
            $isOpen={isOpen}
            onClick={(e) => {
              e.stopPropagation()
              handleSignOut()
            }}
          >
            <LogOut />
          </LogoutIconButton>
        </UserProfileButton>
        {}
        <UserMenu $isOpen={menuOpen}>
          <UserMenuItem onClick={handleManageAccount}>
            <Settings />
            <span>Manage account</span>
          </UserMenuItem>
          <SignOutButton onClick={handleSignOut}>
            <LogOut />
            <span>Sign out</span>
          </SignOutButton>
        </UserMenu>
      </UserProfileSection>
    </SidebarContainer>
  )
}
export default Sidebar
