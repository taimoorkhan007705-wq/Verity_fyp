import styled from "styled-components";
import { NavLink } from "react-router-dom";
export const SidebarContainer = styled.div`
  width: ${(props) => (props.$isOpen ? "15rem" : "5rem")};
  height: 100dvh;
  max-height: 100dvh;
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.25) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, 0.25);
    border-radius: 999px;
    
    &:hover {
      background: rgba(15, 23, 42, 0.4);
    }
  }

  @media (max-width: 639px) {
    position: fixed;
    width: 15rem;
    height: 100vh;
    max-height: 100vh;
    transform: ${(props) => (props.$isOpen ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 0.3s ease-in-out;
    z-index: 1001;
    padding-bottom: calc(70px + 1.5rem);
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
export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;
export const SidebarCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: translateY(-1px);
  }

  svg {
    width: 1rem;
    height: 1rem;
    stroke-width: 2;
  }
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
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  transition: opacity 0.2s ease-in-out;
  @media (max-width: 639px) {
    opacity: 1;
  }
`;
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin: 0;
`;
export const NavigationMenu = styled.div`
  flex: 1;
  padding: 0.5rem 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.25) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, 0.25);
    border-radius: 999px;
  }

  &::after {
    content: '';
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.06) 100%);
  }
`;
export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
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
export const Feed_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? props.theme.colors.primaryHover : props.theme.colors.textSecondary)};
  background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  &:hover {
    background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : props.theme.colors.surfaceHover)};
  }
`;
export const Messages_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? props.theme.colors.primaryHover : props.theme.colors.textSecondary)};
  background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  &:hover {
    background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : props.theme.colors.surfaceHover)};
  }
`;
export const Connections_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? props.theme.colors.primaryHover : props.theme.colors.textSecondary)};
  background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  &:hover {
    background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : props.theme.colors.surfaceHover)};
  }
`;
export const Discover_Button = styled(BaseNavButton)`
  color: ${(props) => (props.$isActive ? props.theme.colors.primaryHover : props.theme.colors.textSecondary)};
  background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  &:hover {
    background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : props.theme.colors.surfaceHover)};
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
  color: ${(props) => (props.$isActive ? props.theme.colors.primaryHover : props.theme.colors.textSecondary)};
  background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : "transparent")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  &:hover {
    background-color: ${(props) => (props.$isActive ? props.theme.colors.primaryLight : props.theme.colors.surfaceHover)};
  }
`;
export const UserProfileSection = styled.div`
  position: sticky;
  bottom: 0;
  background: ${props => props.theme.colors.surface};
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: auto;
  z-index: 20;
  box-shadow: 0 -1px 10px rgba(15, 23, 42, 0.05);
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
    background-color: ${props => props.theme.colors.surfaceHover};
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
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.9375rem;
  white-space: nowrap;
`;
export const UserEmail = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const UserMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px ${props => props.theme.colors.shadowHeavy};
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
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.9375rem;
  transition: all 0.2s ease-in-out;
  text-align: left;
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
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
export const ThemeToggleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  span {
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    transition: opacity 0.2s ease-in-out;
    white-space: nowrap;
    @media (max-width: 639px) {
      opacity: 1;
    }
  }
`;
