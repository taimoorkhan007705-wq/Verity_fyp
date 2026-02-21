import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Video, Smile, MapPin, X, Camera, Globe } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { getCurrentUser, createPost } from '../../services/api'
import { hasCompletedProfile, promptProfileCompletion } from '../../utils/profileCheck'
import {
  CreatePostContainer,
  PostCard,
  PostHeader,
  UserAvatar,
  UserInfo,
  UserName,
  PostVisibility,
  TextArea,
  CharacterCount,
  MediaUploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  UploadHint,
  HiddenFileInput,
  MediaPreviewGrid,
  MediaPreviewItem,
  MediaImage,
  MediaVideo,
  RemoveMediaButton,
  ActionButtonsRow,
  ActionButton,
  HashtagSection,
  SectionLabel,
  HashtagList,
  HashtagBadge,
  RemoveHashtagButton,
  SubmitSection,
  CancelButton,
  SubmitButton,
  PreviewSection,
  PreviewTitle,
} from './CreatePost.styled'

function CreatePost() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const textAreaRef = useRef(null)

  // Check profile completion on mount
  useEffect(() => {
    if (!hasCompletedProfile(user)) {
      promptProfileCompletion(navigate)
    }
  }, [user, navigate])

  // State
  const [postText, setPostText] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [hashtags, setHashtags] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const MAX_CHARS = 500
  const MAX_IMAGES = 10

  // Extract hashtags from text
  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w]+/g
    const matches = text.match(hashtagRegex)
    if (matches) {
      const uniqueTags = [...new Set(matches)]
      setHashtags(uniqueTags)
    } else {
      setHashtags([])
    }
  }

  // Handle text change
  const handleTextChange = (e) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      setPostText(text)
      extractHashtags(text)
    }
  }

  // Handle emoji click
  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji
    const cursorPosition = textAreaRef.current?.selectionStart || postText.length
    const newText = postText.slice(0, cursorPosition) + emoji + postText.slice(cursorPosition)
    
    if (newText.length <= MAX_CHARS) {
      setPostText(newText)
      extractHashtags(newText)
      setShowEmojiPicker(false)
      
      // Focus back on textarea
      setTimeout(() => {
        textAreaRef.current?.focus()
        textAreaRef.current?.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length)
      }, 0)
    }
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    addMediaFiles(files)
  }

  // Add media files
  const addMediaFiles = (files) => {
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
    }))

    setMediaFiles((prev) => {
      const combined = [...prev, ...newFiles]
      return combined.slice(0, MAX_IMAGES)
    })
  }

  // Remove media file
  const removeMediaFile = (index) => {
    setMediaFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index)
      // Revoke URL to free memory
      URL.revokeObjectURL(prev[index].preview)
      return newFiles
    })
  }

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    addMediaFiles(files)
  }

  // Remove hashtag
  const removeHashtag = (tag) => {
    const newText = postText.replace(tag, '').trim()
    setPostText(newText)
    extractHashtags(newText)
  }

  // Handle submit
  const handleSubmit = async () => {
    if (!postText.trim() && mediaFiles.length === 0) {
      alert('Please add some content to your post')
      return
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('content', postText)
      formData.append('hashtags', JSON.stringify(hashtags))
      formData.append('visibility', 'public')

      // Append media files
      mediaFiles.forEach((media) => {
        formData.append('media', media.file)
      })

      // Submit to backend
      const response = await createPost(formData)
      
      alert('Post submitted for review! It will appear in the feed once approved by reviewers.')
      navigate('/feed')
    } catch (error) {
      alert(`Failed to create post: ${error.message}`)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (postText || mediaFiles.length > 0) {
      if (window.confirm('Discard this post?')) {
        navigate('/feed')
      }
    } else {
      navigate('/feed')
    }
  }

  const isOverLimit = postText.length > MAX_CHARS
  const canSubmit = (postText.trim() || mediaFiles.length > 0) && !isOverLimit

  return (
    <CreatePostContainer>
      <PostCard>
        {/* Header */}
        <PostHeader>
          <UserAvatar 
            src={
              user?.avatar?.startsWith('http') 
                ? user.avatar 
                : user?.avatar?.startsWith('/uploads')
                ? `http://localhost:5000${user.avatar}`
                : 'https://via.placeholder.com/50'
            } 
            alt={user?.fullName} 
          />
          <UserInfo>
            <UserName>{user?.fullName}</UserName>
            <PostVisibility><Globe size={14} /> Public</PostVisibility>
          </UserInfo>
        </PostHeader>

        {/* Text Input */}
        <TextArea
          ref={textAreaRef}
          placeholder="What's on your mind? Use #hashtags to reach more people..."
          value={postText}
          onChange={handleTextChange}
        />
        <CharacterCount $isOverLimit={isOverLimit}>
          {postText.length}/{MAX_CHARS}
        </CharacterCount>

        {/* Media Upload */}
        {mediaFiles.length === 0 && (
          <MediaUploadSection>
            <UploadArea
              $isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon>
                <Camera size={48} strokeWidth={1.5} />
              </UploadIcon>
              <UploadText>Drag & drop images or videos here</UploadText>
              <UploadHint>or click to browse (Max 10 files)</UploadHint>
            </UploadArea>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
            />
          </MediaUploadSection>
        )}

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <MediaPreviewGrid>
            {mediaFiles.map((media, index) => (
              <MediaPreviewItem key={index}>
                {media.type === 'image' ? (
                  <MediaImage src={media.preview} alt={`Upload ${index + 1}`} />
                ) : (
                  <MediaVideo src={media.preview} controls />
                )}
                <RemoveMediaButton onClick={() => removeMediaFile(index)}>
                  <X />
                </RemoveMediaButton>
              </MediaPreviewItem>
            ))}
          </MediaPreviewGrid>
        )}

        {/* Action Buttons */}
        <ActionButtonsRow>
          <ActionButton onClick={() => fileInputRef.current?.click()}>
            <Image />
            Photo
          </ActionButton>
          <ActionButton onClick={() => videoInputRef.current?.click()}>
            <Video />
            Video
          </ActionButton>
          <ActionButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile />
            Emoji
          </ActionButton>
          <ActionButton>
            <MapPin />
            Location
          </ActionButton>
        </ActionButtonsRow>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div style={{ marginTop: '1rem', position: 'relative' }}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              height="400px"
            />
          </div>
        )}

        <HiddenFileInput
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
        />

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <HashtagSection>
            <SectionLabel>Hashtags</SectionLabel>
            <HashtagList>
              {hashtags.map((tag, index) => (
                <HashtagBadge key={index}>
                  {tag}
                  <RemoveHashtagButton onClick={() => removeHashtag(tag)}>
                    ×
                  </RemoveHashtagButton>
                </HashtagBadge>
              ))}
            </HashtagList>
          </HashtagSection>
        )}

        {/* Submit Buttons */}
        <SubmitSection>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={!canSubmit}>
            Post
          </SubmitButton>
        </SubmitSection>
      </PostCard>

      {/* Preview Section */}
      {(postText || mediaFiles.length > 0) && (
        <PreviewSection>
          <PreviewTitle>Preview</PreviewTitle>
          <PostCard>
            <PostHeader>
              <UserAvatar 
                src={
                  user?.avatar?.startsWith('http') 
                    ? user.avatar 
                    : user?.avatar?.startsWith('/uploads')
                    ? `http://localhost:5000${user.avatar}`
                    : 'https://via.placeholder.com/50'
                } 
                alt={user?.fullName} 
              />
              <UserInfo>
                <UserName>{user?.fullName}</UserName>
                <PostVisibility>Just now • <Globe size={14} /> Public</PostVisibility>
              </UserInfo>
            </PostHeader>
            <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>
              {postText || 'Your post content will appear here...'}
            </div>
            {mediaFiles.length > 0 && (
              <MediaPreviewGrid style={{ marginTop: '1rem' }}>
                {mediaFiles.slice(0, 4).map((media, index) => (
                  <MediaPreviewItem key={index}>
                    {media.type === 'image' ? (
                      <MediaImage src={media.preview} alt={`Preview ${index + 1}`} />
                    ) : (
                      <MediaVideo src={media.preview} />
                    )}
                  </MediaPreviewItem>
                ))}
              </MediaPreviewGrid>
            )}
          </PostCard>
        </PreviewSection>
      )}
    </CreatePostContainer>
  )
}

export default CreatePost
