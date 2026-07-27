import styled from "styled-components";


export const ReviewCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  overflow: hidden;
  @media (max-width: 900px) {
    height: 100vh;
    overflow: hidden;
  }
`;

export const TopHeader = styled.div`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px ${props => props.theme.colors.shadow};
  min-width: 0;
  @media (max-width: 900px) {
    flex-wrap: wrap;
    padding: 1rem;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
`;

export const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.textPrimary};
`;

export const HeaderTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

export const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.surfaceHover};
  border-radius: 0.75rem;
  min-width: 0;
`;

export const ReviewerAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ReviewerDetails = styled.div``;

export const ReviewerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.9375rem;
`;

export const ReviewerRole = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 0.8125rem;
  font-weight: 500;
`;

export const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

export const SidebarToggleButton = styled.button`
  display: none;
  background-color: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
  }
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
  min-width: 0;
  flex-direction: row-reverse;
  @media (max-width: 900px) {
    flex-direction: column-reverse;
  }
`;

export const ReviewSidebar = styled.div`
  width: 280px;
  min-width: 280px;
  background-color: ${props => props.theme.colors.surface};
  border-left: 1px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  overflow-y: auto;
  min-height: 0;
  box-sizing: border-box;
  @media (max-width: 900px) {
    width: 100%;
    min-width: unset;
    border-left: none;
    border-top: 1px solid ${props => props.theme.colors.border};
    display: ${props => props.$isOpen ? 'block' : 'none'};
    padding: 1.5rem;
  }
`;

export const SidebarTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1.5rem;
`;

export const SidebarPanel = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  color: ${props => props.theme.colors.textPrimary};
  min-width: 0;
  box-sizing: border-box;
`;

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SidebarMenuItem = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.$isActive ? props.theme.colors.primaryLight : 'transparent'};
  border: none;
  border-radius: 0.5rem;
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: ${props => props.$isActive ? '600' : '400'};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
`;

export const MenuBadge = styled.span`
  background-color: ${props => props.theme.colors.error};
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-weight: 600;
`;

export const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  @media (max-width: 900px) {
    padding: 1rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
  min-width: 0;
  box-sizing: border-box;
`;

export const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  word-break: break-word;
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.9375rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const ReviewCardsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
`;

export const ReviewCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  padding: 0.75rem;
  box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
  border-left: 4px solid ${props => {
    if (props.$risk === 'high') return props.theme.colors.error;
    if (props.$risk === 'medium') return props.theme.colors.warning;
    return props.theme.colors.success;
  }};
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

export const ReviewCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  min-width: 0;
  width: 100%;
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AuthorDetails = styled.div``;

export const AuthorName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.875rem;
`;

export const AuthorMeta = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const RiskBadge = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => {
    if (props.$risk === 'high') return '#fee2e2';
    if (props.$risk === 'medium') return '#fef3c7';
    return '#d1fae5';
  }};
  color: ${props => {
    if (props.$risk === 'high') return props.theme.colors.error;
    if (props.$risk === 'medium') return props.theme.colors.warning;
    return props.theme.colors.success;
  }};
`;

export const PostContent = styled.div`
  margin-bottom: 0.5rem;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
`;

export const PostText = styled.p`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;

export const PostImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.75rem;
  margin: 0.5rem 0;
  flex-shrink: 0;
`;

export const AIAnalysisSection = styled.div`
  background-color: ${props => props.theme.colors.surfaceHover};
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`;

export const InfoBox = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: ${props => props.theme.colors.surfaceHover};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.6;
  min-width: 0;
  box-sizing: border-box;
`;

export const NoImageState = styled(InfoBox)`
  text-align: center;
  color: ${props => props.theme.colors.error};
  background-color: ${props => props.theme.colors.surface};
`;

export const PostStatusBox = styled(InfoBox)`
  margin-bottom: 1rem;
`;

export const AIAnalysisTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AIScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

export const AIScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const AIScoreLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const AIScoreValue = styled.div`
  font-weight: 600;
  font-size: 1.125rem;
  color: ${props => {
    if (props.$score >= 80) return props.theme.colors.success;
    if (props.$score >= 50) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
`;

export const AIScoreBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${props => props.theme.colors.borderLight};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.25rem;
`;

export const AIScoreBarFill = styled.div`
  height: 100%;
  width: ${props => props.$score}%;
  background-color: ${props => {
    if (props.$score >= 80) return props.theme.colors.success;
    if (props.$score >= 50) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
  transition: width 0.3s ease;
`;

export const AIIssuesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0 0;
`;

export const AIIssueItem = styled.li`
  padding: 0.5rem;
  background-color: #fee2e2;
  color: ${props => props.theme.colors.error};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  flex-wrap: wrap;
  min-width: 0;
  padding-top: 0.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const HeaderButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-1px);
    background: ${props => props.theme.colors.primaryHover};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(HeaderButton)`
  background: ${props => props.theme.colors.error};
  color: white;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
  &:hover {
    transform: translateY(-1px);
    background: #dc2626;
  }
`;

export const ContentMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  margin-top: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const ApproveButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.success} 0%, #059669 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const RejectButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.error} 0%, #dc2626 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const FlagButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.warning};
  border-radius: 0.75rem;
  color: ${props => props.theme.colors.warning};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #fef3c7;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

export const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1rem;
`;

export const ReasonSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  outline: none;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const ReasonTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const ModalCancelButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
`;

export const ModalSubmitButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.error} 0%, #dc2626 100%);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export const SettingsButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.primary};
  }
`;

export const SettingsMenu = styled.div`
  position: relative;
`;

export const SettingsDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  z-index: 100;
  margin-bottom: 0.5rem;
  overflow: hidden;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

export const SettingsMenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textPrimary};
  text-align: left;
  cursor: pointer;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
`;

export const HeaderToggleButton = styled.button`
  display: none;
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  transition: all 0.2s;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px ${props => props.theme.colors.shadow};
  }
  @media (max-width: 768px) {
    display: ${props => props.$isMinimized ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
  }
`;

export const HeaderPopup = styled.div`
  display: none;
  position: fixed;
  bottom: 140px;
  right: 20px;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  padding: 1.5rem;
  width: calc(100% - 40px);
  max-width: 400px;
  box-shadow: 0 8px 24px ${props => props.theme.colors.shadow};
  z-index: 101;
  animation: slideUp 0.3s ease-out;
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`;

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const PopupTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

export const PopupCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PopupUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PopupActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
`;
