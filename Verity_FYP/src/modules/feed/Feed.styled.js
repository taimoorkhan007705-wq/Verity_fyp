import styled from "styled-components";

export const FeedContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
  
  @media (max-width: 640px) {
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

export const StoriesContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  scrollbar-width: none; 
  -ms-overflow-style: none; 
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 640px) {
    gap: 0.75rem;
    padding: 0.75rem 0;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.5rem 0;
    margin-bottom: 0.75rem;
  }
`;

export const StoryCard = styled.div`
  min-width: 120px;
  height: 180px;
  border-radius: 1rem;
  background: ${(props) => props.$bgColor || "#e5e7eb"};
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 640px) {
    min-width: 100px;
    height: 150px;
  }
  
  @media (max-width: 480px) {
    min-width: 80px;
    height: 120px;
  }
`;

export const CreateStoryCard = styled(StoryCard)`
  background: ${props => props.theme.colors.surface};
  border: 2px dashed ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const StoryAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  position: absolute;
  top: 10px;
  left: 10px;
  
  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
    top: 8px;
    left: 8px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    top: 6px;
    left: 6px;
    border-width: 1.5px;
  }
`;

export const StoryTime = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    bottom: 6px;
    left: 6px;
  }
`;

export const CreateStoryIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  
  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
`;

export const CreateStoryText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  
  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

export const PostCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.colors.borderLight};
  transition: all 0.2s ease;
  
  @media (max-width: 640px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
    border-radius: 0.5rem;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

export const PostAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

export const PostUserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PostUserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

export const VerifiedBadge = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 1rem;
  flex-shrink: 0;
`;

export const PostUsername = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const PostTime = styled.span`
  color: ${props => props.theme.colors.textTertiary};
  font-size: 0.875rem;
  &::before {
    content: " · ";
  }
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const PostText = styled.p`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
    line-height: 1.5;
  }
`;

export const PostHashtag = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
`;

export const PostImage = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  object-fit: cover;
  display: block;
  
  @media (max-width: 480px) {
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

export const PostActions = styled.div`
  display: flex;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.borderLight};
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    padding-top: 0.5rem;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.375rem;
    font-size: 0.8125rem;
    min-width: 40px;
    min-height: 40px;
    
    svg {
      width: 1.125rem;
      height: 1.125rem;
    }
  }
`;

export const CategoryBar = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
  overflow-x: auto;
  border: 1px solid ${props => props.theme.colors.borderLight};
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.border} transparent;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  @media (max-width: 640px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

export const CategoryTabs = styled.div`
  display: flex;
  gap: 0.75rem;
  min-width: min-content;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const CategoryTab = styled.button`
  padding: 0.625rem 1.25rem;
  border: 2px solid ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.textSecondary};
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  flex-shrink: 0;
  touch-action: manipulation;
  min-height: 40px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$isActive ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    min-height: 36px;
  }
`;

export const CreatePostSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
  border: 1px solid ${props => props.theme.colors.borderLight};
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
    transform: translateY(-2px);
  }
  
  @media (max-width: 640px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }
`;

export const CreatePostInput = styled.input`
  flex: 1;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
`;
