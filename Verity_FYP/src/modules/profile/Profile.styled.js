import styled from 'styled-components'
export const ProfileContainer = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: #fff;
  min-height: 100vh;
`
export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  @media (max-width: 768px) {
    gap: 2rem;
    flex-direction: column;
    text-align: center;
  }
`
export const ProfileImageSection = styled.div`
  position: relative;
  flex-shrink: 0;
`
export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #14b8a6;
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`
export const EditImageButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #14b8a6;
  color: white;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0d9488;
    transform: scale(1.1);
  }
`
export const ProfileStats = styled.div`
  display: flex;
  gap: 3rem;
  flex: 1;
  @media (max-width: 768px) {
    gap: 2rem;
    justify-content: center;
  }
`
export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`
export const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`
export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`
export const ProfileInfo = styled.div`
  margin-bottom: 1.5rem;
`
export const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`
export const ProfileBio = styled.p`
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.5;
  margin: 0.5rem 0;
  white-space: pre-wrap;
`
export const ProfileWebsite = styled.a`
  font-size: 0.9375rem;
  color: #14b8a6;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  margin-top: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`
export const ProfileActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`
export const EditProfileButton = styled.button`
  flex: 1;
  padding: 0.625rem 1.5rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #e5e7eb;
  }
`
export const SettingsButton = styled.button`
  padding: 0.625rem 1rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background-color: #e5e7eb;
  }
`
export const ProfileTabs = styled.div`
  display: flex;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`
export const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  border-top: 2px solid ${props => props.$active ? '#14b8a6' : 'transparent'};
  color: ${props => props.$active ? '#14b8a6' : '#6b7280'};
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  margin-top: -1px;
  &:hover {
    color: #14b8a6;
  }
`
export const TabIcon = styled.span`
  display: flex;
  align-items: center;
`
export const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`
export const PostItem = styled.div`
  aspect-ratio: 1;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.5rem;
  position: relative;
  &:hover {
    opacity: 0.9;
  }
  @media (max-width: 768px) {
    border-radius: 0;
  }
`
export const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
export const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  text-align: center;
  svg {
    margin-bottom: 1rem;
    stroke-width: 1;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0.5rem 0;
  }
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
`
