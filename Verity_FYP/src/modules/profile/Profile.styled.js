import styled from 'styled-components'

export const ProfileContainer = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: ${props => props.theme.mode === 'dark' ? props.theme.colors.surface : props.theme.colors.background};
  color: ${props => props.theme.colors.textPrimary};
  min-height: 100vh;
  transition: background-color 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    gap: 2rem;
    flex-direction: column;
    text-align: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
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
  border: 3px solid ${props => props.theme.colors.primary};
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`

export const EditImageButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: 3px solid ${props => props.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  touch-action: manipulation;
  min-width: 44px;
  min-height: 44px;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    border-width: 2px;
    bottom: 0;
    right: 0;
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
  
  @media (max-width: 480px) {
    gap: 1.5rem;
    justify-content: space-around;
    width: 100%;
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
  color: ${props => props.theme.colors.textPrimary};
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`

export const ProfileInfo = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

export const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

export const ProfileBio = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0.5rem 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin: 0.375rem 0;
  }
`

export const ProfileWebsite = styled.a`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  margin-top: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`

export const ProfileActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  
  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
`

export const EditProfileButton = styled.button`
  flex: 1;
  min-width: 120px;
  padding: 0.625rem 1.5rem;
  background-color: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  touch-action: manipulation;
  min-height: 40px;
  
  &:hover {
    background-color: ${props => props.theme.colors.border};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    min-width: auto;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    flex: 1;
  }
`

export const SettingsButton = styled.button`
  padding: 0.625rem 1rem;
  background-color: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  touch-action: manipulation;
  min-width: 44px;
  min-height: 44px;
  
  &:hover {
    background-color: ${props => props.theme.colors.border};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: 0.5rem;
  }
`

export const ProfileTabs = styled.div`
  display: flex;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  overflow-x: auto;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

export const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  border-top: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textSecondary};
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
  min-height: 44px;
  touch-action: manipulation;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.7rem;
    min-height: 40px;
  }
`

export const TabIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

export const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
  }
`

export const PostItem = styled.div`
  aspect-ratio: 1;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.5rem;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    border-radius: 0;
    
    &:hover {
      transform: none;
    }
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
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  
  svg {
    margin-bottom: 1rem;
    stroke-width: 1;
    width: 64px;
    height: 64px;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.textPrimary};
    margin: 0.5rem 0;
  }
  
  p {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
    
    svg {
      width: 48px;
      height: 48px;
    }
    
    h3 {
      font-size: 1.25rem;
    }
    
    p {
      font-size: 0.8125rem;
    }
  }
`
