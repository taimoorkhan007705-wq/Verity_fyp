import styled from 'styled-components'

export const StoriesContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
  border: 1px solid ${props => props.theme.colors.borderLight};
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  @media (max-width: 640px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
  }
`

export const StoriesScroll = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 640px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    padding-bottom: 0.25rem;
  }
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 10px;
    
    &:hover {
      background: ${props => props.theme.colors.primaryHover};
    }
  }
`

export const StoryCircle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s, filter 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`

export const StoryRing = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 3px;
  background: ${props => props.$hasViewed 
    ? props.theme.mode === 'dark' 
      ? 'linear-gradient(45deg, #475569, #334155)' 
      : 'linear-gradient(45deg, #d1d5db, #9ca3af)' 
    : 'linear-gradient(45deg, #14b8a6, #0d9488)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
  overflow: hidden;
  
  @media (max-width: 640px) {
    width: 60px;
    height: 60px;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`

export const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 3px solid white;
`
export const StoryName = styled.span`
  font-size: 0.75rem;
  color: #374151;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`
export const AddStoryCircle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`
export const AddStoryIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 6px rgba(20, 184, 166, 0.3);
`
export const CreateStoryModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
`
export const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
`
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`
export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`
export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s;
  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`
export const ModalBody = styled.div`
  padding: 1.5rem;
`
export const FileInput = styled.div`
  border: 2px dashed #14b8a6;
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  text-align: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #0d9488;
    background: #f0fdfa;
  }
  svg {
    color: #14b8a6;
    margin-bottom: 0.5rem;
  }
`
export const PreviewImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`
export const CaptionInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 1rem;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #14b8a6;
  }
`
export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(20, 184, 166, 0.4);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`
