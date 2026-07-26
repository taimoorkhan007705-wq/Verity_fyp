import styled from 'styled-components'

export const ViewerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  
  @media (max-width: 640px) {
    padding: 0;
  }
`

export const ViewerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(4px);
`

export const ViewerContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 500px;
  height: 90dvh;
  max-height: 90dvh;
  background: #000;
  border-radius: 1rem;
  overflow: hidden;
  z-index: 2001;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 640px) {
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
  }
  
  @media (max-height: 600px) {
    height: 100dvh;
    max-height: 100dvh;
  }
`

export const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 4px;
  padding: 0.5rem;
  z-index: 10;
  
  @media (max-width: 480px) {
    gap: 2px;
    padding: 0.375rem;
  }
`

export const ProgressSegment = styled.div`
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  
  @media (max-width: 480px) {
    height: 2px;
  }
`

export const ProgressFill = styled.div`
  height: 100%;
  background: white;
  width: ${props => props.$progress}%;
  transition: width 0.05s linear;
`

export const ViewerHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 1rem 1rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent);
  z-index: 10;
  
  @media (max-width: 640px) {
    padding: 2rem 0.75rem 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0.5rem 0.5rem;
  }
`

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`

export const AuthorAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-width: 1.5px;
  }
`

export const AuthorName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`

export const TimeAgo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  
  @media (max-width: 480px) {
    font-size: 0.6875rem;
  }
`

export const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 480px) {
    padding: 0.375rem;
    min-width: 40px;
    min-height: 40px;
  }
`

export const StoryMedia = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
`

export const StoryImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const StoryVideo = styled.video`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const StoryCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  font-size: 0.9375rem;
  text-align: center;
  z-index: 10;
  max-height: 25%;
  overflow-y: auto;
  word-wrap: break-word;
  
  @media (max-width: 640px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8125rem;
  }
`

export const ViewCount = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.875rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  z-index: 10;
  backdrop-filter: blur(4px);
  
  @media (max-width: 640px) {
    bottom: 0.75rem;
    right: 0.75rem;
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
  }
  
  @media (max-width: 480px) {
    bottom: 0.5rem;
    right: 0.5rem;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
`

export const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.$position}: 1rem;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 10;
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  @media (max-width: 640px) {
    ${props => props.$position}: 0.5rem;
    padding: 0.5rem;
    min-width: 40px;
    min-height: 40px;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`