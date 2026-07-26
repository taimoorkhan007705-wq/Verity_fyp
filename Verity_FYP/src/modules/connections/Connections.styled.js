import styled from 'styled-components'

export const ConnectionsContainer = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`

export const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 900;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  transition: color 0.3s ease;

  @media (max-width: 640px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

export const SearchButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.surfaceHover};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: ${props => props.theme.colors.textPrimary};
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;

  &:hover {
    background-color: ${props => props.theme.colors.border};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    min-width: 40px;
    min-height: 40px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`

export const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    gap: 0.375rem;
  }
`

export const TabButton = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  background-color: ${props => props.$active ? props.theme.colors.textPrimary : props.theme.colors.surfaceHover};
  color: ${props => props.$active ? 'white' : props.theme.colors.textPrimary};
  transition: all 0.2s ease;
  touch-action: manipulation;
  min-height: 40px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${props => props.theme.colors.shadow};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 6px 16px;
    font-size: 0.8rem;
    min-height: 36px;
  }
`

export const LoadingText = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textTertiary};
  padding: 3rem 1rem;
  font-size: 0.95rem;
`

export const Section = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`

export const SectionTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${props => props.theme.colors.textPrimary};
  transition: color 0.3s ease;

  @media (max-width: 640px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`

export const RequestBadge = styled.span`
  color: #ef4444;
  font-weight: 700;
`

export const SeeAllLink = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

export const ItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 1024px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

export const UserItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 16px;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.borderLight};
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;

  &:hover {
    box-shadow: 0 8px 16px ${props => props.theme.colors.shadow};
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px);
    }
    
    padding: 1rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    gap: 0.625rem;
    
    &:hover {
      transform: none;
    }
  }
`

export const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 3px solid ${props => props.theme.colors.primary};
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    border-width: 2.5px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    border-width: 2px;
  }
`

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;
  text-align: center;
`

export const UserName = styled.div`
  font-weight: 800;
  font-size: 1.05rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`

export const UserRole = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;

  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`

export const Button = styled.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  touch-action: manipulation;
  min-height: 40px;

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    padding: 6px 0;
    font-size: 0.8rem;
    min-height: 36px;
  }
`

export const ConfirmButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`

export const DeleteButton = styled(Button)`
  background-color: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background-color: ${props => props.theme.colors.border};
  }
`

export const AddFriendButton = styled(Button)`
  width: 100%;
  background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`

export const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.25rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 36px;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  outline: none;
  font-size: 0.9rem;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textPrimary};
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }

  @media (max-width: 480px) {
    padding: 8px 8px 8px 32px;
    font-size: 0.85rem;
  }
`

export const FriendItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 16px;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.borderLight};
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    box-shadow: 0 8px 16px ${props => props.theme.colors.shadow};
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px);
    }
    
    padding: 1rem;
    gap: 0.625rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    gap: 0.5rem;
    
    &:hover {
      transform: none;
    }
  }
`

export const FriendsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;

  @media (max-width: 1024px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

export const FriendAvatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 3px solid ${props => props.theme.colors.primary};

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    border-width: 2.5px;
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    border-width: 2px;
  }
`

export const FriendInfo = styled.div`
  flex: 1;
  width: 100%;
  text-align: center;
`

export const FriendName = styled.div`
  font-weight: 800;
  font-size: 1.05rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`

export const FriendRole = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`

export const MessageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  transition: all 0.2s ease;
  white-space: nowrap;
  touch-action: manipulation;
  min-height: 40px;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${props => props.theme.colors.shadow};
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 15px;
    height: 15px;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.75rem;
    min-height: 36px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`

export const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  padding: 2rem 1rem;
  font-size: 0.9rem;
  border-radius: 12px;
  background-color: ${props => props.theme.colors.surface};
  border: 1px dashed ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
    font-size: 0.85rem;
  }
`
