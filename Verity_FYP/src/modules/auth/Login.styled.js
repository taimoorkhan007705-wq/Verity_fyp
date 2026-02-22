import styled from "styled-components";
export const PageContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;
export const OuterCard = styled.div`
  background: #e0f2f1;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 
    20px 20px 60px #becdcc,
    -20px -20px 60px #ffffff;
  width: 100%;
  max-width: 450px;
  margin: auto;
  @media (min-width: 768px) {
    max-width: 500px;
    padding: 2.5rem;
  }
`;
export const InnerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;
export const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #e0f2f1;
  box-shadow: 
    inset 8px 8px 16px #becdcc,
    inset -8px -8px 16px #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  svg {
    width: 50px;
    height: 50px;
    color: #14b8a6;
  }
  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    svg {
      width: 60px;
      height: 60px;
    }
  }
`;
export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;
export const LogoBox = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #14b8a6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 4px 4px 8px #becdcc, -4px -4px 8px #ffffff;
`;
export const BrandName = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #14b8a6;
  margin: 0;
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;
export const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  text-align: center;
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;
export const Subheading = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: -0.5rem 0 0 0;
  text-align: center;
  @media (min-width: 768px) {
    font-size: 0.9375rem;
  }
`;
export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;
export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
export const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;
  svg {
    width: 20px;
    height: 20px;
  }
`;
export const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: none;
  border-radius: 1rem;
  font-size: 0.9375rem;
  outline: none;
  background: #e0f2f1;
  box-shadow: 
    inset 6px 6px 12px #becdcc,
    inset -6px -6px 12px #ffffff;
  color: #1f2937;
  box-sizing: border-box;
  transition: all 0.2s;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    box-shadow: 
      inset 8px 8px 16px #becdcc,
      inset -8px -8px 16px #ffffff;
  }
  @media (min-width: 768px) {
    padding: 1rem 1rem 1rem 3rem;
    font-size: 1rem;
  }
`;
export const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
  &:hover {
    color: #14b8a6;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;
export const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: -0.5rem;
`;
export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border-radius: 0.375rem;
  cursor: pointer;
  accent-color: #14b8a6;
`;
export const RememberMeLabel = styled.label`
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
`;
export const SignInButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #e0f2f1;
  color: #14b8a6;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 
    8px 8px 16px #becdcc,
    -8px -8px 16px #ffffff;
  &:hover {
    box-shadow: 
      6px 6px 12px #becdcc,
      -6px -6px 12px #ffffff;
  }
  &:active {
    box-shadow: 
      inset 4px 4px 8px #becdcc,
      inset -4px -4px 8px #ffffff;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 1.125rem;
  }
`;
export const Footer = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  @media (min-width: 768px) {
    font-size: 0.9375rem;
  }
`;
export const SignUpLink = styled.span`
  color: #14b8a6;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
export const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0.5rem 0;
`;
export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: #cbd5e1;
`;
export const DividerText = styled.span`
  padding: 0 0.75rem;
  color: #9ca3af;
  font-size: 0.875rem;
`;
export const RoleDropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;
export const RoleButton = styled.button`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: #e0f2f1;
  color: #1f2937;
  font-size: 0.9375rem;
  font-weight: 500;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 
    inset 6px 6px 12px #becdcc,
    inset -6px -6px 12px #ffffff;
  position: relative;
  &:hover {
    box-shadow: 
      inset 8px 8px 16px #becdcc,
      inset -8px -8px 16px #ffffff;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (min-width: 768px) {
    padding: 1rem 1rem 1rem 3rem;
    font-size: 1rem;
  }
`;
export const RoleIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
  }
`;
export const RoleDropdownIcon = styled.div`
  color: #9ca3af;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  svg {
    width: 16px;
    height: 16px;
  }
`;
export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #e0f2f1;
  border-radius: 1rem;
  box-shadow: 
    8px 8px 16px #becdcc,
    -8px -8px 16px #ffffff;
  overflow: hidden;
  z-index: 10;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;
export const DropdownItem = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  background: ${props => props.$isSelected ? '#ccebe7' : 'transparent'};
  color: ${props => props.$isSelected ? '#14b8a6' : '#374151'};
  font-size: 0.9375rem;
  font-weight: ${props => props.$isSelected ? '600' : '500'};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #ccebe7;
    color: #14b8a6;
    padding-left: 1.25rem;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #cbd5e1;
  }
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;
export const ContinueText = styled.p`
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
  @media (min-width: 768px) {
    font-size: 0.9375rem;
  }
`;
export const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;
export const SocialButton = styled.button`
  flex: 1;
  padding: 0.875rem 1rem;
  background: #e0f2f1;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 
    6px 6px 12px #becdcc,
    -6px -6px 12px #ffffff;
  &:hover {
    box-shadow: 
      4px 4px 8px #becdcc,
      -4px -4px 8px #ffffff;
  }
  &:active {
    box-shadow: 
      inset 3px 3px 6px #becdcc,
      inset -3px -3px 6px #ffffff;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 0.9375rem;
  }
`;
export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;