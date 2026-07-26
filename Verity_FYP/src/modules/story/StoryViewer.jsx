import { API_BASE, API_URL, mediaUrl } from '../../config.js'
import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { viewStory } from '../../services/api'
import Avatar from '../../components/Avatar/Avatar'
import {
  ViewerContainer,
  ViewerOverlay,
  ViewerContent,
  ViewerHeader,
  AuthorInfo,
  AuthorName,
  TimeAgo,
  CloseBtn,
  StoryMedia,
  StoryImage,
  StoryVideo,
  StoryCaption,
  ProgressBar,
  ProgressSegment,
  ProgressFill,
  NavigationButton,
  ViewCount
} from './StoryViewer.styled'
const StoryViewer = ({ storyGroup, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const currentStory = storyGroup.stories[currentIndex]
  useEffect(() => {
    if (currentStory && !currentStory.hasViewed) {
      viewStory(currentStory._id).catch(console.error)
    }
    const duration = 5000 // 5 seconds per story
    const interval = 50
    const increment = (interval / duration) * 100
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, interval)
    return () => clearInterval(timer)
  }, [currentIndex])
  const handleNext = () => {
    if (currentIndex < storyGroup.stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }
  return (
    <ViewerContainer>
      <ViewerOverlay onClick={onClose} />
      <ViewerContent>
        <ProgressBar>
          {storyGroup.stories.map((_, index) => (
            <ProgressSegment key={index}>
              <ProgressFill 
                $progress={
                  index < currentIndex ? 100 : 
                  index === currentIndex ? progress : 
                  0
                } 
              />
            </ProgressSegment>
          ))}
        </ProgressBar>
        <ViewerHeader>
          <AuthorInfo>
            <Avatar
              src={mediaUrl(storyGroup.author.avatar)}
              name={storyGroup.author.fullName}
              alt={storyGroup.author.fullName}
              size={48}
            />
            <div>
              <AuthorName>{storyGroup.author.fullName}</AuthorName>
              <TimeAgo>{getTimeAgo(currentStory.createdAt)}</TimeAgo>
            </div>
          </AuthorInfo>
          <CloseBtn onClick={onClose}>
            <X size={24} />
          </CloseBtn>
        </ViewerHeader>
        <StoryMedia>
          {currentStory.mediaType === 'image' ? (
            <StoryImage 
              src={mediaUrl(currentStory.mediaUrl)}
              alt="Story"
            />
          ) : (
            <StoryVideo 
              src={mediaUrl(currentStory.mediaUrl)}
              autoPlay
              muted
              loop
            />
          )}
        </StoryMedia>
        {currentStory.caption && (
          <StoryCaption>{currentStory.caption}</StoryCaption>
        )}
        <ViewCount>
          <Eye size={16} />
          {currentStory.viewCount}
        </ViewCount>
        {currentIndex > 0 && (
          <NavigationButton $position="left" onClick={handlePrevious}>
            <ChevronLeft size={32} />
          </NavigationButton>
        )}
        {currentIndex < storyGroup.stories.length - 1 && (
          <NavigationButton $position="right" onClick={handleNext}>
            <ChevronRight size={32} />
          </NavigationButton>
        )}
      </ViewerContent>
    </ViewerContainer>
  )
}
export default StoryViewer

