import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getStories, createStory } from '../../services/api'
import { hasCompletedProfile, promptProfileCompletion } from '../../utils/profileCheck'
import StoryViewer from './StoryViewer'
import {
  StoriesContainer,
  StoriesScroll,
  StoryCircle,
  StoryImage,
  StoryName,
  AddStoryCircle,
  AddStoryIcon,
  StoryRing,
  CreateStoryModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FileInput,
  PreviewImage,
  CaptionInput,
  SubmitButton
} from './Stories.styled'
const Stories = () => {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [viewingStory, setViewingStory] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      console.log('Current user from localStorage:', user)
      setCurrentUser(user)
    }
    fetchStories()
  }, [])
  const fetchStories = async () => {
    try {
      const response = await getStories()
      console.log('Stories response:', response)
      console.log('All story authors:', response.stories?.map(s => ({ id: s.author._id, name: s.author.user_info?.fullName || s.author.fullName })))
      setStories(response.stories || [])
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleCreateStory = async () => {
    if (!selectedFile) {
      alert('Please select a file')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('media', selectedFile)
      formData.append('caption', caption)
      await createStory(formData)
      alert('Story created successfully!')
      setShowCreateModal(false)
      setSelectedFile(null)
      setPreview(null)
      setCaption('')
      fetchStories()
    } catch (error) {
      alert(error.message || 'Failed to create story')
    } finally {
      setUploading(false)
    }
  }
  const handleYourStoryImageClick = (e) => {
    const currentUserId = currentUser?._id?.toString() || currentUser?._id
    const userStories = stories.find(storyGroup => 
      storyGroup.author._id.toString() === currentUserId
    )
    if (userStories) {
      handleStoryClick(userStories)
    }
  }
  const handleCreateStoryClick = (e) => {
    e.stopPropagation() // Prevent triggering the image click
    setShowCreateModal(true)
  }
  const handleStoryClick = (storyGroup) => {
    setViewingStory(storyGroup)
  }
  const handleCloseViewer = () => {
    setViewingStory(null)
    fetchStories() // Refresh to update view counts
  }
  if (loading) {
    return <StoriesContainer>Loading stories...</StoriesContainer>
  }
  return (
    <>
      <StoriesContainer>
        <StoriesScroll>
          {}
          {(() => {
            const currentUserId = currentUser?._id
            const userStories = stories.find(storyGroup => 
              storyGroup.author._id === currentUserId
            )
            const hasStories = !!userStories
            return (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <StoryCircle onClick={hasStories ? () => handleStoryClick(userStories) : undefined}>
                  <StoryRing $hasViewed={hasStories ? userStories.stories.every(s => s.hasViewed) : false}>
                    <StoryImage 
                      src={
                        currentUser?.profile_info?.avatar 
                          ? (currentUser.profile_info.avatar.startsWith('http') 
                              ? currentUser.profile_info.avatar 
                              : `http://localhost:5000${currentUser.profile_info.avatar}`)
                          : currentUser?.avatar
                          ? (currentUser.avatar.startsWith('http') 
                              ? currentUser.avatar 
                              : `http://localhost:5000${currentUser.avatar}`)
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.user_info?.fullName || currentUser?.fullName || 'You')}&background=14b8a6&color=fff&size=150`
                      } 
                      alt="Your story"
                    />
                    {}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!hasCompletedProfile(currentUser)) {
                          promptProfileCompletion(navigate)
                        } else {
                          setShowCreateModal(true)
                        }
                      }}
                      style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        right: '0', 
                        width: '28px', 
                        height: '28px', 
                        backgroundColor: '#14b8a6', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '3px solid white',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                    >
                      <Plus size={18} color="white" />
                    </div>
                  </StoryRing>
                </StoryCircle>
              </div>
            )
          })()}
          {}
          {stories
            .filter(storyGroup => {
              const isCurrentUser = storyGroup.author._id === currentUser?._id
              console.log('Filter check:', { 
                authorId: storyGroup.author._id, 
                currentUserId: currentUser?._id, 
                isCurrentUser,
                authorName: storyGroup.author.user_info?.fullName || storyGroup.author.fullName
              })
              return !isCurrentUser
            })
            .map((storyGroup) => (
              <StoryCircle 
                key={storyGroup.author._id} 
                onClick={() => handleStoryClick(storyGroup)}
              >
                <StoryRing $hasViewed={storyGroup.stories.every(s => s.hasViewed)}>
                  <StoryImage 
                    src={
                      storyGroup.author.profile_info?.avatar 
                        ? (storyGroup.author.profile_info.avatar.startsWith('http') 
                            ? storyGroup.author.profile_info.avatar 
                            : `http://localhost:5000${storyGroup.author.profile_info.avatar}`)
                        : storyGroup.author.avatar
                        ? (storyGroup.author.avatar.startsWith('http') 
                            ? storyGroup.author.avatar 
                            : `http://localhost:5000${storyGroup.author.avatar}`)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(storyGroup.author.user_info?.fullName || storyGroup.author.fullName)}&background=14b8a6&color=fff&size=150`
                    } 
                    alt={storyGroup.author.user_info?.fullName || storyGroup.author.fullName}
                  />
                </StoryRing>
                <StoryName>{storyGroup.author.user_info?.fullName || storyGroup.author.fullName}</StoryName>
              </StoryCircle>
            ))}
        </StoriesScroll>
      </StoriesContainer>
      {showCreateModal && (
        <CreateStoryModal>
          <ModalOverlay onClick={() => setShowCreateModal(false)} />
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create Story</ModalTitle>
              <CloseButton onClick={() => setShowCreateModal(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {!preview ? (
                <FileInput>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="story-file-input"
                  />
                  <label htmlFor="story-file-input" style={{ cursor: 'pointer', width: '100%', textAlign: 'center' }}>
                    <Plus size={48} />
                    <p>Click to select image or video</p>
                  </label>
                </FileInput>
              ) : (
                <>
                  <PreviewImage src={preview} alt="Preview" />
                  <CaptionInput
                    placeholder="Add a caption (optional)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={200}
                  />
                  <SubmitButton onClick={handleCreateStory} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Share Story'}
                  </SubmitButton>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </CreateStoryModal>
      )}
      {viewingStory && (
        <StoryViewer 
          storyGroup={viewingStory} 
          onClose={handleCloseViewer}
        />
      )}
    </>
  )
}
export default Stories
