import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import {
  LayoutContainer,
  MainContent,
  MobileToggleButton,
  Overlay,
} from "./Layout.styled";

// onLogout prop yahan receive karein
function Layout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <LayoutContainer>
      {/* Left Sidebar - Hum onLogout prop sidebar ko pass kar sakte hain */}
      <Sidebar isOpen={sidebarOpen} setsidebarOpen={setSidebarOpen} onLogout={onLogout} />

      {/* Overlay for mobile when sidebar is open */}
      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <MainContent>
        {/* Mobile Toggle Button */}
        <MobileToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </MobileToggleButton>

        {/* Is Outlet ke andar Feed.jsx, Profile.jsx etc nazar aayenge */}
        <Outlet />
      </MainContent>

      {/* Right Sidebar */}
      <RightSidebar />
    </LayoutContainer>
  );
}

export default Layout;