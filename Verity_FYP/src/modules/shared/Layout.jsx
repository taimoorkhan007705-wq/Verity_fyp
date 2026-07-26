import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Plus, Search, Heart, MessageCircle, Users, Home, Compass, PlusSquare, User, ShoppingBag } from "lucide-react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import { useBadges } from "../../contexts/BadgeContext";
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

function Layout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { badges } = useBadges();

  // Check active routes for bottom nav
  const isFeedActive = location.pathname === "/feed" || location.pathname === "/";
  const isShoppingActive = location.pathname.startsWith("/shopping");
  const isMessagesActive = location.pathname.startsWith("/messages");
  const isDiscoverActive = location.pathname === "/discover" || location.pathname === "/connections";
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

  return (
    <LayoutContainer>
      {}
      <HeaderContainer>
        <HeaderLogo onClick={() => navigate("/")}>
          ✓ Verity
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
          <button onClick={() => navigateTo("/create-post")} title="Create Post">
            <Plus size={20} />
          </button>
          <button title="Messages" onClick={() => navigateTo("/messages")}>
            <MessageCircle size={20} />
            {badges.unreadMessages > 0 && (
              <span className="notification-badge">{badges.unreadMessages}</span>
            )}
          </button>
        </HeaderIcons>
      </HeaderContainer>

      {}
      <Sidebar isOpen={sidebarOpen} setsidebarOpen={setSidebarOpen} onLogout={onLogout} />

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
      <RightSidebar />

      {}
      <BottomNav>
        <BottomNavItem
          $isActive={isFeedActive}
          onClick={() => navigateTo("/feed")}
          title="Feed"
        >
          <Home size={20} />
          <span>Feed</span>
          {badges.newFeedAuthors > 0 && (
            <span className="badge">{badges.newFeedAuthors}</span>
          )}
        </BottomNavItem>

        <BottomNavItem
          $isActive={isShoppingActive}
          onClick={() => navigateTo("/shopping")}
          title="Shopping"
        >
          <ShoppingBag size={20} />
          <span>Shop</span>
        </BottomNavItem>
 
        <BottomNavItem
          $isActive={isDiscoverActive}
          onClick={() => navigateTo("/discover")}
          title="Discover"
        >
          <Compass size={20} />
          <span>Discover</span>
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
          {badges.unreadMessages > 0 && (
            <span className="badge">{badges.unreadMessages}</span>
          )}
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

export default Layout;
