import styled from "styled-components";

export const LayoutContainer = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0.5rem 1rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
  flex-shrink: 0;
  height: 60px;
  
  @media (max-width: 768px) {
    order: -1;
    padding: 0.5rem 0.75rem 0.5rem 5rem;
    gap: 0.375rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.375rem 0.5rem 0.375rem 4rem;
    height: 56px;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export const HeaderLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 0;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    gap: 0.25rem;
  }
`;

export const HeaderSearch = styled.div`
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.background};
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};

  input {
    flex: 1 1 0;
    min-width: 0;
    border: none;
    background: transparent;
    outline: none;
    color: ${props => props.theme.colors.textPrimary};
    font-size: 0.875rem;
    font-weight: 500;

    &::placeholder {
      color: ${props => props.theme.colors.textTertiary};
    }

    /* Ensure text is visible on all backgrounds */
    &:autofill {
      -webkit-autofill;
      -webkit-text-fill-color: ${props => props.theme.colors.textPrimary};
      -webkit-box-shadow: 0 0 0px 1000px ${props => props.theme.colors.background} inset;
    }

    /* iOS fix for input visibility */
    -webkit-appearance: none;
    -webkit-border-radius: 0;
  }
   
  @media (max-width: 480px) {
    padding: 0.375rem 0.5rem;
     
    input {
      font-size: 0.8125rem;
    }
  }
`;

export const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${props => props.theme.colors.textSecondary};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
    position: relative;
    min-width: 44px;
    min-height: 44px;
    touch-action: manipulation;

    &:hover {
      background: ${props => props.theme.colors.background};
      color: ${props => props.theme.colors.primary};
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 700;
      border: 2px solid ${props => props.theme.colors.surface};
    }
  }
  
  @media (max-width: 480px) {
    gap: 0;
    
    button {
      width: 2.25rem;
      height: 2.25rem;
      min-width: 40px;
      min-height: 40px;
      
      svg {
        width: 1.125rem;
        height: 1.125rem;
      }
    }
  }
`;

export const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding-bottom: 70px;
  }
  
  @media (max-width: 480px) {
    padding-bottom: 66px;
  }
`;

export const MobileToggleButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "none" : "flex")};
    position: fixed;
    top: 0.75rem;
    left: 0.75rem;
    right: auto;
    z-index: 1000;
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    min-width: 44px;
    min-height: 44px;
    touch-action: manipulation;

    svg {
      width: 1.25rem;
      height: 1.25rem;
      stroke-width: 2;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  @media (max-width: 480px) {
    width: 2.25rem;
    height: 2.25rem;
    top: 0.5rem;
    left: ${(props) => (props.$isOpen ? "auto" : "0.5rem")};
    right: ${(props) => (props.$isOpen ? "0.5rem" : "auto")};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 25;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  @media (min-width: 769px) {
    display: none;
  }
`;

export const BottomNav = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.surface};
    border-top: 1px solid ${props => props.theme.colors.border};
    padding: 0.25rem 0;
    z-index: 999;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -1px 3px ${props => props.theme.colors.shadow};
    height: 70px;
    padding-bottom: max(0, env(safe-area-inset-bottom));
  }
  
  @media (max-width: 480px) {
    height: 66px;
  }
`;

export const BottomNavItem = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  transition: color 0.2s ease-in-out;
  flex: 1;
  position: relative;
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .badge {
    position: absolute;
    top: 0;
    right: 5%;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: 700;
    border: 2px solid ${props => props.theme.colors.surface};
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 480px) {
    padding: 0.375rem;
    font-size: 0.6rem;
    gap: 0.125rem;
    
    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
`;
