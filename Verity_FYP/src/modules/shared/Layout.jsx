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
function Layout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <LayoutContainer>
      {}
      <Sidebar isOpen={sidebarOpen} setsidebarOpen={setSidebarOpen} onLogout={onLogout} />
      {}
      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      {}
      <MainContent>
        {}
        <MobileToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </MobileToggleButton>
        {}
        <Outlet />
      </MainContent>
      {}
      <RightSidebar />
    </LayoutContainer>
  );
}
export default Layout;