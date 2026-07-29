import { API_BASE, API_URL } from '../../config.js'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Video, Smile, MapPin, X, Camera, Globe } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { getCurrentUser, createPost } from '../../services/api'
import { hasCompletedProfile } from '../../utils/profileCheck'
import CompleteProfileModal from '../shared/CompleteProfileModal'
import ImageCropper from '../../components/ImageCropper/ImageCropper'
import { useToast } from '../../contexts/ToastContext'
import { loadImageFile, validateImageDimensions } from '../../utils/imageUploadHandler'
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
  CategorySection,
  CategoryGrid,
  CategoryButton,
  CategoryIcon,
  CategoryName,
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
  const toast = useToast()
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const textAreaRef = useRef(null)
  const [postText, setPostText] = useState('')
  const [category, setCategory] = useState('Other')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [cropperImage, setCropperImage] = useState(null)
  useEffect(() => {
    if (!hasCompletedProfile(user)) {
      setShowProfileModal(true)
    }
  }, [user, navigate])
  const [mediaFiles, setMediaFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [hashtags, setHashtags] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const MAX_CHARS = 500
  const MAX_IMAGES = 10
  const categories = ['Sports', 'News', 'Trending', 'Entertainment', 'Food', 'Other']
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
  const handleTextChange = (e) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      setPostText(text)
      extractHashtags(text)
    }
  }
  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji
    const cursorPosition = textAreaRef.current?.selectionStart || postText.length
    const newText = postText.slice(0, cursorPosition) + emoji + postText.slice(cursorPosition)
    if (newText.length <= MAX_CHARS) {
      setPostText(newText)
      extractHashtags(newText)
      setShowEmojiPicker(false)
      setTimeout(() => {
        textAreaRef.current?.focus()
        textAreaRef.current?.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length)
      }, 0)
    }
  }
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    const videoFiles = files.filter(f => f.type.startsWith('video/'))

    // Process images with cropper
    if (imageFiles.length > 0) {
      const firstImage = imageFiles[0]
      loadImageFile(firstImage)
        .then(async (base64) => {
          // Validate dimensions
          await validateImageDimensions(base64, 200, 200)
          setCropperImage(base64)
        })
        .catch(error => {
          toast.error(error.message)
        })
    }

    // Add remaining image files without cropping (if multiple selected)
    if (imageFiles.length > 1) {
      const remainingImages = imageFiles.slice(1).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: 'image',
      }))
      setMediaFiles((prev) => {
        const combined = [...prev, ...remainingImages]
        return combined.slice(0, MAX_IMAGES)
      })
    }

    // Add all video files
    if (videoFiles.length > 0) {
      const videoMedia = videoFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: 'video',
      }))
      setMediaFiles((prev) => {
        const combined = [...prev, ...videoMedia]
        return combined.slice(0, MAX_IMAGES)
      })
    }
  }
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
  const removeMediaFile = (index) => {
    setMediaFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index)
      URL.revokeObjectURL(prev[index].preview)
      return newFiles
    })
  }
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
  const removeHashtag = (tag) => {
    const newText = postText.replace(tag, '').trim()
    setPostText(newText)
    extractHashtags(newText)
  }
  const handleSubmit = async () => {
    if (!postText.trim() && mediaFiles.length === 0) {
      toast.warning('Please add either text content or media to your post')
      return
    }
    try {
      const formData = new FormData()
      formData.append('content', postText || '') // Allow empty content if media exists
      formData.append('category', category)
      formData.append('hashtags', JSON.stringify(hashtags))
      formData.append('visibility', 'public')
      mediaFiles.forEach((media) => {
        formData.append('media', media.file)
      })
      const response = await createPost(formData)
      
      // Show appropriate toast based on response
      if (response.verificationStatus === 'pending' || response.verificationStatus === 'awaiting_review' || response.verificationStatus === 'awaiting_ai_detection') {
        toast.info(response.message || 'Your post is sent for verification, please wait')
      } else if (response.verificationStatus === 'approved') {
        toast.success(response.message || 'Post published successfully!')
      } else {
        toast.error(response.message || 'Post was rejected')
      }
      
      navigate('/feed')
    } catch (error) {
      toast.error(`Failed to create post: ${error.message}`)
    }
  }
  const handleCancel = () => {
    if (postText || mediaFiles.length > 0) {
      toast.warning('Draft discarded')
    }
    navigate('/feed')
  }
  const isOverLimit = postText.length > MAX_CHARS
  const canSubmit = (postText.trim() || mediaFiles.length > 0) && !isOverLimit
  return (
    <>
    <CreatePostContainer>
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onCrop={(croppedImage) => {
            console.log('Cropped image received:', {
              type: typeof croppedImage,
              length: croppedImage?.length,
              startsWithDataUrl: croppedImage?.startsWith('data:')
            })
            
            if (!croppedImage) {
              console.error('Cropped image is null or undefined')
              toast.error('Failed to process cropped image')
              setCropperImage(null)
              return
            }

            try {
              // Convert cropped base64 back to file
              const arr = croppedImage.split(',')
              const mime = arr[0].match(/:(.*?);/)?.[1]
              if (!mime) {
                console.error('Invalid base64 format:', arr[0])
                toast.error('Invalid image format')
                setCropperImage(null)
                return
              }
              const bstr = atob(arr[1])
              let n = bstr.length
              const u8arr = new Uint8Array(n)
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
              }
              
              // Create a proper File object with correct extension
              const extension = mime.includes('png') ? 'png' : mime.includes('gif') ? 'gif' : 'jpg'
              const filename = `cropped-${Date.now()}.${extension}`
              
              const croppedFile = new File([u8arr], filename, { 
                type: mime,
                lastModified: Date.now()
              })
              
              console.log('Created file:', {
                name: croppedFile.name,
                size: croppedFile.size,
                type: croppedFile.type,
                isFile: croppedFile instanceof File
              })
              
              const newMedia = {
                file: croppedFile,
                preview: croppedImage,
                type: 'image',
              }
              setMediaFiles((prev) => {
                const updated = [...prev, newMedia]
                return updated.slice(0, MAX_IMAGES)
              })
              setCropperImage(null)
              toast.success('Image cropped and added successfully!')
            } catch (error) {
              console.error('Error processing cropped image:', error)
              toast.error('Failed to process cropped image: ' + error.message)
              setCropperImage(null)
            }
          }}
          onCancel={() => {
            setCropperImage(null)
          }}
          aspectRatio={1}
          title="Crop Your Image"
        />
      )}
      <PostCard>
        {}
        <PostHeader>
          <UserAvatar 
            src={
              user?.avatar?.startsWith('http') 
                ? user.avatar 
                : user?.avatar?.startsWith('/uploads')
                ? `${API_BASE}${user.avatar}`
                : 'https://via.placeholder.com/50'
            } 
            alt={user?.fullName} 
          />
          <UserInfo>
            <UserName>{user?.fullName}</UserName>
            <PostVisibility><Globe size={14} /> Public</PostVisibility>
          </UserInfo>
        </PostHeader>
        {}
        <TextArea
          ref={textAreaRef}
          placeholder="What's on your mind? Use #hashtags to reach more people..."
          value={postText}
          onChange={handleTextChange}
        />
        <CharacterCount $isOverLimit={isOverLimit}>
          {postText.length}/{MAX_CHARS}
        </CharacterCount>

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
        {}
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
        <CategorySection>
          <SectionLabel>Category</SectionLabel>
          <CategoryGrid>
            {categories.map((item) => (
              <CategoryButton
                key={item}
                type="button"
                $isSelected={category === item}
                onClick={() => setCategory(item)}
              >
                <CategoryIcon>{item.charAt(0)}</CategoryIcon>
                <CategoryName $isSelected={category === item}>{item}</CategoryName>
              </CategoryButton>
            ))}
          </CategoryGrid>
        </CategorySection>
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
        {}
        <SubmitSection>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={!canSubmit}>
            Post
          </SubmitButton>
        </SubmitSection>
      </PostCard>
      {}
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
                    ? `${API_BASE}${user.avatar}`
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
    {showProfileModal && <CompleteProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  )
}
export default CreatePost

