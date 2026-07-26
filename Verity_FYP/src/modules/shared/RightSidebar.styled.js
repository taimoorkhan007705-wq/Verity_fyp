import styled from "styled-components";

export const RightSidebarContainer = styled.div`
  width: ${(props) => (props.$isOpen ? "18rem" : "5rem")};
  height: 100dvh;
  max-height: 100dvh;
  background-color: ${props => props.theme.colors.surface};
  border-left: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 30;
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
  overflow-y: auto;
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

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const LogoSection = styled.div`
  padding: 1.5rem 1rem;
  padding-bottom: 1rem;
  overflow: hidden;
`;

export const RightSidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const ReviewerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: ${props => props.$isActive ? "#0d9488" : "#14b8a6"};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);

  &:hover {
    background-color: #0d9488;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: white;
  }
`;

export const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: ${props => props.$isActive ? "#0d9488" : "#14b8a6"};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);

  &:hover {
    background-color: #0d9488;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: white;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const SidebarCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.textPrimary};
  }

  svg {
    width: 1rem;
    height: 1rem;
    stroke-width: 2;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin: 0;
`;

export const LeaderboardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
  gap: 1rem;
`;

export const LeaderboardHeader = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 0.5rem;
`;

export const CurrentUserCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background-color: rgba(20, 184, 166, 0.1);
  border-radius: 0.5rem;
  border: 1px solid #14b8a6;
`;

export const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ReviewerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background-color: ${props => props.theme.colors.surfaceHover};
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: rgba(20, 184, 166, 0.1);
    border-color: #14b8a6;
  }
`;

export const NoDataMessage = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8125rem;
  padding: 1.5rem 0.5rem;
`;


/* Settings Styles */
export const SettingsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
  gap: 0.5rem;
`;

export const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.surfaceHover};
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const SettingLabel = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SettingDescription = styled.p`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.25rem 0 0 0;
`;

export const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SettingInput = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  background-color: white;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.8125rem;
  transition: all 0.2s ease-in-out;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

export const SettingButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: #14b8a6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #0d9488;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  -webkit-appearance: none;
  width: 44px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease-in-out;
  position: relative;
  flex-shrink: 0;

  &:checked {
    background-color: #14b8a6;
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: left 0.3s ease-in-out;
  }

  &:checked::before {
    left: 22px;
  }
`;
