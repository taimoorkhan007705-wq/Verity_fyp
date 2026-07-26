import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, MessageCircle, Users, Home, Compass, PlusSquare, User, ShoppingBag, LogOut, Settings, ChevronDown, Award } from "lucide-react";
import { API_BASE } from "../../config.js";
import { getCurrentUser, logout as apiLogout } from "../../services/api";
import Avatar from '../../components/Avatar/Avatar'
import DarkModeToggle from "../../components/DarkModeToggle/DarkModeToggle";
import {
  LayoutContainer,
  HeaderContainer,
  HeaderLogo,
  HeaderSearch,
  HeaderIcons,
  MainContent,
  MobileToggleButton,
  Overlay,
  BottomNav,
  BottomNavItem,
} from "./Layout.styled";
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
  UserInfo,
  UserName,
  UserEmail,
  LogoutIconButton,
  UserMenu,
  UserMenuItem,
  SignOutButton,
  ThemeToggleSection,
} from "./Sidebar.styled";

function ReviewerLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Check active routes
  const isFeedActive = location.pathname === "/feed" || location.pathname === "/";
  const isReviewCenterActive = location.pathname === "/review-center";
  const isLeaderboardActive = location.pathname === "/leaderboard";
  const isShoppingActive = location.pathname.startsWith("/shopping");
  const isMessagesActive = location.pathname.startsWith("/messages");
  const isConnectionsActive = location.pathname === "/connections";
  const isProfileActive = location.pathname.startsWith("/profile");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
      setSearchExpanded(false);
    }
  };

  const navigateTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth <= 639) {
      setSidebarOpen(false);
    }
  };

  const handleLogoClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignOut = () => {
    apiLogout();
    onLogout();
    navigate("/");
    window.location.reload();
  };

  const handleManageAccount = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  return (
    <LayoutContainer>
      {}
      <HeaderContainer>
        <HeaderLogo onClick={() => navigate("/review-center")}>
          ✓ Verity Reviewer
        </HeaderLogo>
        <HeaderSearch 
          $isExpanded={searchExpanded}
          style={{
            maxWidth: searchExpanded ? '100%' : '300px',
            transition: 'all 0.3s ease',
            flex: searchExpanded ? '1 1 0' : '0 0 auto',
          }}
        >
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearch}
            onFocus={() => setSearchExpanded(true)}
            onBlur={() => !searchInput && setSearchExpanded(false)}
            style={{
              width: searchExpanded ? '100%' : '0',
              opacity: searchExpanded ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
          />
        </HeaderSearch>
        <HeaderIcons>
          <button onClick={() => navigateTo("/messages")} title="Messages">
            <MessageCircle size={20} />
          </button>
        </HeaderIcons>
      </HeaderContainer>

      {}
      <SidebarContainer $isOpen={sidebarOpen}>
        {}
        <LogoSection>
          <LogoContainer onClick={handleLogoClick}>
            <LogoBox>V</LogoBox>
            <BrandName $isOpen={sidebarOpen}>Reviewer</BrandName>
          </LogoContainer>
          <Divider />
        </LogoSection>

        {}
        <NavigationMenu>
          <MenuList>
            <Feed_Button 
              to="/review-center" 
              $isActive={isReviewCenterActive} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <span style={{ fontSize: '1.2rem' }}>📋</span>
              <span>Review Queue</span>
            </Feed_Button>

            <Connections_Button 
              to="/leaderboard" 
              $isActive={isLeaderboardActive} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <Award size={20} />
              <span>Leaderboard</span>
            </Connections_Button>

            <Connections_Button 
              to="/all-reviewers" 
              $isActive={location.pathname === '/all-reviewers'} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <Users size={20} />
              <span>All Reviewers</span>
            </Connections_Button>

            <Connections_Button 
              to="/feed" 
              $isActive={isFeedActive} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <Home size={20} />
              <span>Feed</span>
            </Connections_Button>

            <Discover_Button 
              to="/shopping" 
              $isActive={isShoppingActive} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <ShoppingBag size={20} />
              <span>Shopping</span>
            </Discover_Button>

            <Discover_Button 
              to="/messages" 
              $isActive={isMessagesActive} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <MessageCircle size={20} />
              <span>Messages</span>
            </Discover_Button>

            <Profile_Button 
              to="/connections" 
              $isActive={isConnectionsActive} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <Users size={20} />
              <span>Connections</span>
            </Profile_Button>

            <CreatePost_Button 
              to="/create-post" 
              $isActive={location.pathname === "/create-post"} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <PlusSquare size={20} />
              <span>Create Post</span>
            </CreatePost_Button>

            <Profile_Button 
              to="/profile" 
              $isActive={isProfileActive} 
              $isOpen={sidebarOpen} 
              onClick={handleMenuItemClick}
            >
              <User size={20} />
              <span>Profile</span>
            </Profile_Button>
          </MenuList>
        </NavigationMenu>

        {}
        <ThemeToggleSection $isOpen={sidebarOpen}>
          <DarkModeToggle />
          {sidebarOpen && <span>Dark mode</span>}
        </ThemeToggleSection>

        {}
        <UserProfileSection>
          <UserProfileButton onClick={() => setMenuOpen(!menuOpen)}>
            <Avatar
              src={
                user?.avatar?.startsWith("http")
                  ? user.avatar
                  : user?.avatar?.startsWith("/uploads")
                    ? `${API_BASE}${user.avatar}`
                    : undefined
              }
              name={user?.fullName || "Reviewer"}
              alt={user?.fullName || "Reviewer"}
              size={44}
            />
            <UserInfo $isOpen={sidebarOpen}>
              <UserName>{user?.fullName || "Reviewer"}</UserName>
              <UserEmail style={{ fontSize: "0.75rem", color: "#64748b" }}>
                Reviewer
              </UserEmail>
            </UserInfo>
            <LogoutIconButton 
              $isOpen={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                handleSignOut();
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </LogoutIconButton>
          </UserProfileButton>

          {}
          <UserMenu $isOpen={menuOpen}>
            <UserMenuItem onClick={handleManageAccount}>
              <Settings size={18} />
              <span>Manage Account</span>
            </UserMenuItem>
            <SignOutButton onClick={handleSignOut}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </SignOutButton>
          </UserMenu>
        </UserProfileSection>
      </SidebarContainer>

      {}
      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      {}
      <MobileToggleButton $isOpen={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
      </MobileToggleButton>

      {}
      <MainContent>
        <Outlet />
      </MainContent>

      {}
      <BottomNav>
        <BottomNavItem
          $isActive={isReviewCenterActive}
          onClick={() => navigateTo("/review-center")}
          title="Review Queue"
        >
          <span style={{ fontSize: "1.2rem" }}>📋</span>
          <span>Review</span>
        </BottomNavItem>

        <BottomNavItem
          $isActive={isFeedActive}
          onClick={() => navigateTo("/feed")}
          title="Feed"
        >
          <Home size={20} />
          <span>Feed</span>
        </BottomNavItem>

        <BottomNavItem
          onClick={() => navigateTo("/create-post")}
          title="Create Post"
        >
          <PlusSquare size={20} />
          <span>Create</span>
        </BottomNavItem>

        <BottomNavItem
          $isActive={isMessagesActive}
          onClick={() => navigateTo("/messages")}
          title="Messages"
        >
          <MessageCircle size={20} />
          <span>Messages</span>
        </BottomNavItem>

        <BottomNavItem
          $isActive={isProfileActive}
          onClick={() => navigateTo("/profile")}
          title="Profile"
        >
          <User size={20} />
          <span>Profile</span>
        </BottomNavItem>
      </BottomNav>
    </LayoutContainer>
  );
}

export default ReviewerLayout;

