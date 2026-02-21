import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SidebarContainer = styled.div`
  width: ${(props) => (props.$isOpen ? "15rem" : "5rem")};
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  transition: width 0.3s ease-in-out;

  @media (max-width: 639px) {
    position: fixed;
    width: 15rem;
    transform: ${(props) => (props.$isOpen ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 0.3s ease-in-out;
  }

  @media (min-width: 1280px) {
    width: ${(props) => (props.$isOpen ? "18rem" : "5rem")};
  }
`;

export const LogoSection = styled.div`
  padding: 1.5rem;
  padding-bottom: 1rem;
  overflow: hidden;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const LogoBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #14b8a6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  flex-shrink: 0;
`;

export const BrandName = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  transition: opacity 0.2s ease-in-out;
  
  @media (max-width: 639px) {
    opacity: 1;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 0;
`;

export const NavigationMenu = styled.div`
  flex: 1;
  padding: 0.5rem 1rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

// Base style for all navigation buttons
const BaseNavButton = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  span {
    opacity: ${(props) => (props.$isOpen ? "1" : "0")};
    transition: opacity 0.2s ease-in-out;
    
    @media (max-width: 639px) {
      opacity: 1;
    }
  }
`;

// Individual button styles
export const Feed_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? "#0d9488" : "#4b5563")};
  background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "#f3f4f6")};
  }
`;

export const Messages_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? "#0d9488" : "#4b5563")};
  background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "#f3f4f6")};
  }
`;

export const Connections_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? "#0d9488" : "#4b5563")};
  background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "#f3f4f6")};
  }
`;

export const Discover_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? "#0d9488" : "#4b5563")};
  background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "#f3f4f6")};
  }
`;

export const CreatePost_Button = styled(BaseNavButton)`
  background-color: ${(props) => (props.$isActive ? "#0d9488" : "#14b8a6")};
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#0d9488" : "#0d9488")};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  }

  svg {
    color: white;
  }
`;

export const Profile_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? "#0d9488" : "#4b5563")};
  background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "#f3f4f6")};
  }
`;

// User Profile Section at Bottom
export const UserProfileSection = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
`;

export const UserProfileButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const LogoutIconButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  
  &:hover {
    background-color: #fee2e2;
    color: #ef4444;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  @media (max-width: 639px) {
    opacity: 1;
  }
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  flex: 1;
  text-align: left;
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  transition: opacity 0.2s ease-in-out;
  overflow: hidden;
  
  @media (max-width: 639px) {
    opacity: 1;
  }
`;

export const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9375rem;
  white-space: nowrap;
`;

export const UserEmail = styled.div`
  color: #6b7280;
  font-size: 0.8125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// User Menu Dropdown
export const UserMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  z-index: 50;
`;

export const UserMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #374151;
  font-size: 0.9375rem;
  transition: all 0.2s ease-in-out;
  text-align: left;

  &:hover {
    background-color: #f3f4f6;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`;

export const SignOutButton = styled(UserMenuItem)`
  color: #ef4444;

  &:hover {
    background-color: #fee2e2;
  }
`;
