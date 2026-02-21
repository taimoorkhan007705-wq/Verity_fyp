import styled from "styled-components";

// Main Feed Container
export const FeedContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 1rem;
  background-color: #f8fafc;
  min-height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
`;

// Stories Section
export const StoriesContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StoryCard = styled.div`
  min-width: 120px;
  height: 180px;
  border-radius: 1rem;
  background: ${(props) => props.$bgColor || "#e5e7eb"};
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const CreateStoryCard = styled(StoryCard)`
  background: white;
  border: 2px dashed #d1d5db;
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
`;

export const StoryTime = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

export const CreateStoryIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #14b8a6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

export const CreateStoryText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
`;

// Post Card
export const PostCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;

// Post Header
export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const PostAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const PostUserInfo = styled.div`
  flex: 1;
`;

export const PostUserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const VerifiedBadge = styled.span`
  color: #14b8a6;
  font-size: 1rem;
`;

export const PostUsername = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const PostTime = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
  
  &::before {
    content: "• ";
  }
`;

// Post Content
export const PostText = styled.p`
  color: #374151;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const PostHashtag = styled.span`
  color: #14b8a6;
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
`;

// Post Actions
export const PostActions = styled.div`
  display: flex;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #f3f4f6;
    color: #14b8a6;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
