import { useState } from 'react'
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
  LayoutDashboard // Added this icon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
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
} from './pages/Styled_components/Sidebar.styled'

function Sidebar({ isOpen, setsidebarOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  // In a real app, this comes from user object: user?.role === "Business"
  const isBusinessUser = user?.role === "Business" || true; 

  const handleLogoClick = () => {
    setsidebarOpen(!isOpen)
  }

  const handleManageAccount = () => {
    setMenuOpen(false)
    navigate('/profile')
  }

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  // Check if route is active
  const isFeedActive = location.pathname === '/feed' || location.pathname === '/'
  const isDashboardActive = location.pathname === '/dashboard' // New active state
  const isMessagesActive = location.pathname.startsWith('/messages')
  const isConnectionsActive = location.pathname === '/connections'
  const isDiscoverActive = location.pathname === '/discover'
  const isCreatePostActive = location.pathname === '/create-post'
  const isProfileActive = location.pathname.startsWith('/profile')

  return (
    <SidebarContainer $isOpen={isOpen}>
      {/* Logo Section */}
      <LogoSection>
        <LogoContainer onClick={handleLogoClick}>
          <LogoBox>✓</LogoBox>
          <BrandName $isOpen={isOpen}>Verity</BrandName>
        </LogoContainer>
        <Divider />
      </LogoSection>

      {/* Navigation Menu */}
      <NavigationMenu>
        <MenuList>
          {/* Feed Button */}
          <Feed_Button to="/feed" $isActive={isFeedActive} $isOpen={isOpen}>
            <Home />
            <span>Feed</span>
          </Feed_Button>

          {/* Business Dashboard Button (Conditional) */}
          {isBusinessUser && (
            <Feed_Button to="/dashboard" $isActive={isDashboardActive} $isOpen={isOpen}>
              <LayoutDashboard />
              <span>Business Desk</span>
            </Feed_Button>
          )}

          {/* Messages Button */}
          <Messages_Button to="/messages" $isActive={isMessagesActive} $isOpen={isOpen}>
            <MessageCircle />
            <span>Messages</span>
          </Messages_Button>

          {/* Connections Button */}
          <Connections_Button to="/connections" $isActive={isConnectionsActive} $isOpen={isOpen}>
            <Users />
            <span>Connections</span>
          </Connections_Button>

          {/* Discover Button */}
          <Discover_Button to="/discover" $isActive={isDiscoverActive} $isOpen={isOpen}>
            <Compass />
            <span>Discover</span>
          </Discover_Button>

          {/* Create Post Button */}
          <CreatePost_Button to="/create-post" $isActive={isCreatePostActive} $isOpen={isOpen}>
            <PlusSquare />
            <span>Create Post</span>
          </CreatePost_Button>

          {/* Profile Button */}
          <Profile_Button to="/profile" $isActive={isProfileActive} $isOpen={isOpen}>
            <User />
            <span>Profile</span>
          </Profile_Button>
        </MenuList>
      </NavigationMenu>

      {/* User Profile Section */}
      <UserProfileSection>
        <UserProfileButton onClick={() => setMenuOpen(!menuOpen)}>
          <UserAvatar src={user?.avatar} alt={user?.name} />
          <UserInfo $isOpen={isOpen}>
            <UserName>{user?.name || "Business Owner"}</UserName>
            <UserEmail>{user?.email || "business@verity.com"}</UserEmail>
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

        {/* User Menu Dropdown */}
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