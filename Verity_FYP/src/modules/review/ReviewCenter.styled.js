import styled from "styled-components";

// Main Container
export const ReviewCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
  overflow: hidden;
`;

// Top Header
export const TopHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #14b8a6;
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
  color: #1f2937;
`;

export const HeaderTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  margin-left: 2rem;
  padding-left: 2rem;
  border-left: 2px solid #e5e7eb;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
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
  color: #1f2937;
  font-size: 0.9375rem;
`;

export const ReviewerRole = styled.div`
  color: #14b8a6;
  font-size: 0.8125rem;
  font-weight: 500;
`;

export const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  color: #6b7280;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: #14b8a6;
    color: #14b8a6;
    background-color: #f0fdfa;
  }
`;

// Content Wrapper
export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Sidebar
export const ReviewSidebar = styled.div`
  width: 250px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  overflow-y: auto;
`;

export const SidebarTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SidebarMenuItem = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${(props) => (props.$isActive ? "#f0fdfa" : "transparent")};
  border: none;
  border-radius: 0.5rem;
  color: ${(props) => (props.$isActive ? "#14b8a6" : "#6b7280")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const MenuBadge = styled.span`
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-weight: 600;
`;

// Main Content
export const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

// Stats Cards
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.$color || "#1f2937"};
`;

// Filters
export const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  color: #374151;
  font-size: 0.9375rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #14b8a6;
  }
`;

// Review Cards
export const ReviewCardsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ReviewCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${(props) => {
    if (props.$risk === 'high') return '#ef4444';
    if (props.$risk === 'medium') return '#f59e0b';
    return '#10b981';
  }};
`;

export const ReviewCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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
  color: #1f2937;
  font-size: 1rem;
`;

export const AuthorMeta = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const RiskBadge = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${(props) => {
    if (props.$risk === 'high') return '#fee2e2';
    if (props.$risk === 'medium') return '#fef3c7';
    return '#d1fae5';
  }};
  color: ${(props) => {
    if (props.$risk === 'high') return '#dc2626';
    if (props.$risk === 'medium') return '#d97706';
    return '#059669';
  }};
`;

export const PostContent = styled.div`
  margin-bottom: 1rem;
`;

export const PostText = styled.p`
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const PostImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`;

// AI Analysis Section
export const AIAnalysisSection = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`;

export const AIAnalysisTitle = styled.div`
  font-weight: 600;
  color: #1f2937;
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
  color: #6b7280;
  font-size: 0.875rem;
`;

export const AIScoreValue = styled.div`
  font-weight: 600;
  font-size: 1.125rem;
  color: ${(props) => {
    if (props.$score >= 80) return '#059669';
    if (props.$score >= 50) return '#d97706';
    return '#dc2626';
  }};
`;

export const AIScoreBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.25rem;
`;

export const AIScoreBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.$score}%;
  background-color: ${(props) => {
    if (props.$score >= 80) return '#10b981';
    if (props.$score >= 50) return '#f59e0b';
    return '#ef4444';
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
  color: #dc2626;
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

// Action Buttons
export const ActionButtonsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const ApproveButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
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
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
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
  background-color: white;
  border: 2px solid #f59e0b;
  border-radius: 0.75rem;
  color: #f59e0b;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #fef3c7;
  }
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
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
  color: #1f2937;
  margin-bottom: 1rem;
`;

export const ReasonSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  outline: none;

  &:focus {
    border-color: #14b8a6;
  }
`;

export const ReasonTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #14b8a6;
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
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const ModalSubmitButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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

