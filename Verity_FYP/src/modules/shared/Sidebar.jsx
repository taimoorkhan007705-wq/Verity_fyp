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
  Check, 
  LogOut,
  ClipboardCheck,
  BarChart3,
  ShoppingBag
} from 'lucide-react'
import { getCurrentUser, logout as apiLogout } from '../../services/api'
import {
  SidebarContainer,
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
  UserProfileSection,
  UserProfileButton,
  UserAvatar,
  UserInfo,
  UserName,
  UserEmail,
  LogoutIconButton,
  UserMenu,
  UserMenuItem,
  SignOutButton,
} from './Sidebar.styled'
function Sidebar({ isOpen, setsidebarOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log('Sidebar - Current user from localStorage:', currentUser)
    console.log('Sidebar - User avatar:', currentUser?.avatar)
    if (currentUser && currentUser.fullName) {
      const nameParts = currentUser.fullName.split(' ')
      const uniqueParts = [...new Set(nameParts)]
      currentUser.fullName = uniqueParts.join(' ')
    }
    setUser(currentUser)
  }, [])
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
  const isFeedActive = location.pathname === '/feed' || location.pathname === '/'
  const isMessagesActive = location.pathname.startsWith('/messages')
  const isConnectionsActive = location.pathname === '/connections'
  const isDiscoverActive = location.pathname === '/discover'
  const isCreatePostActive = location.pathname === '/create-post'
  const isProfileActive = location.pathname.startsWith('/profile')
  const isReviewCenterActive = location.pathname === '/review-center'
  const isShoppingActive = location.pathname.startsWith('/shopping')
  const isReviewer = user?.role === 'Reviewer'
  const isBusiness = user?.role === 'Business'
  return (
    <SidebarContainer $isOpen={isOpen}>
      {}
      <LogoSection>
        <LogoContainer onClick={handleLogoClick}>
          <LogoBox><Check size={20} /></LogoBox>
          <BrandName $isOpen={isOpen}>Verity</BrandName>
        </LogoContainer>
        <Divider />
      </LogoSection>
      {}
      <NavigationMenu>
        <MenuList>
          {}
          {isReviewer && (
            <>
              <Feed_Button to="/review-center" $isActive={isReviewCenterActive} $isOpen={isOpen}>
                <ClipboardCheck />
                <span>Review Center</span>
              </Feed_Button>
              <Connections_Button to="/feed" $isActive={isFeedActive} $isOpen={isOpen}>
                <Home />
                <span>Feed</span>
              </Connections_Button>
              <Discover_Button to="/shopping" $isActive={isShoppingActive} $isOpen={isOpen}>
                <ShoppingBag />
                <span>Shopping</span>
              </Discover_Button>
              <Discover_Button to="/messages" $isActive={isMessagesActive} $isOpen={isOpen}>
                <MessageCircle />
                <span>Messages</span>
              </Discover_Button>
              <Profile_Button to="/connections" $isActive={isConnectionsActive} $isOpen={isOpen}>
                <Users />
                <span>Connections</span>
              </Profile_Button>
              <CreatePost_Button to="/create-post" $isActive={isCreatePostActive} $isOpen={isOpen}>
                <PlusSquare />
                <span>Create Post</span>
              </CreatePost_Button>
              <Profile_Button to="/profile" $isActive={isProfileActive} $isOpen={isOpen}>
                <User />
                <span>Profile</span>
              </Profile_Button>
            </>
          )}
          {}
          {!isReviewer && !isBusiness && (
            <>
              <Feed_Button to="/feed" $isActive={isFeedActive} $isOpen={isOpen}>
                <Home />
                <span>Feed</span>
              </Feed_Button>
              <Discover_Button to="/shopping" $isActive={isShoppingActive} $isOpen={isOpen}>
                <ShoppingBag />
                <span>Shopping</span>
              </Discover_Button>
              <Messages_Button to="/messages" $isActive={isMessagesActive} $isOpen={isOpen}>
                <MessageCircle />
                <span>Messages</span>
              </Messages_Button>
              <Connections_Button to="/connections" $isActive={isConnectionsActive} $isOpen={isOpen}>
                <Users />
                <span>Connections</span>
              </Connections_Button>
              <Discover_Button to="/discover" $isActive={isDiscoverActive} $isOpen={isOpen}>
                <Compass />
                <span>Discover</span>
              </Discover_Button>
              <CreatePost_Button to="/create-post" $isActive={isCreatePostActive} $isOpen={isOpen}>
                <PlusSquare />
                <span>Create Post</span>
              </CreatePost_Button>
              <Profile_Button to="/profile" $isActive={isProfileActive} $isOpen={isOpen}>
                <User />
                <span>Profile</span>
              </Profile_Button>
            </>
          )}
        </MenuList>
      </NavigationMenu>
      {}
      <UserProfileSection>
        <UserProfileButton onClick={() => setMenuOpen(!menuOpen)}>
          <UserAvatar 
            src={
              user?.avatar?.startsWith('http') 
                ? user.avatar 
                : user?.avatar?.startsWith('/uploads')
                ? `http://localhost:5000${user.avatar}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
            } 
            alt={user?.fullName || 'User'} 
            onError={(e) => {
              console.error('Sidebar avatar failed to load:', e.target.src)
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14b8a6&color=fff&size=150`
            }}
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