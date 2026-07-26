import styled from 'styled-components'

export const EditContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  min-height: 100vh;
  transition: background-color 0.3s ease;
  
  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

export const EditHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }
`

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textPrimary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s;
  min-width: 44px;
  min-height: 44px;
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
  
  &:active {
    transform: scale(0.95);
  }
`

export const EditTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  
  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`

export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`

export const ProfileImageEdit = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`

export const ProfileImageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`

export const ProfileImageLarge = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${props => props.theme.colors.primary};
  transition: all 0.3s ease;
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    border-width: 2px;
  }
`

export const ChangePhotoButton = styled.button`
  padding: 0.625rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  touch-action: manipulation;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1.25rem;
    font-size: 0.8125rem;
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  transition: color 0.3s ease;
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textPrimary};
  background-color: ${props => props.theme.colors.surface};
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
`

export const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textPrimary};
  background-color: ${props => props.theme.colors.surface};
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    min-height: 80px;
  }
`

export const CharCount = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textTertiary};
  text-align: right;
  
  @media (max-width: 480px) {
    font-size: 0.6875rem;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-top: 0.75rem;
    flex-direction: column;
  }
`

export const SaveButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  touch-action: manipulation;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
`

export const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background-color: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  touch-action: manipulation;
  
  &:hover {
    background-color: ${props => props.theme.colors.border};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
`
