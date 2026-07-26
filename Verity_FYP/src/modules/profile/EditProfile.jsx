import { API_BASE, API_URL } from '../../config.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ArrowLeft } from 'lucide-react'
import { getCurrentUser, getProfile, updateProfile } from '../../services/api'
import ImageCropper from '../../components/ImageCropper/ImageCropper'
import { loadImageFile, validateImageDimensions } from '../../utils/imageUploadHandler'
import { useToast } from '../../contexts/ToastContext'
import {
  EditContainer,
  EditHeader,
  BackButton,
  EditTitle,
  EditForm,
  ProfileImageEdit,
  ProfileImageWrapper,
  ProfileImageLarge,
  ChangePhotoButton,
  FormGroup,
  Label,
  Input,
  TextArea,
  CharCount,
  SaveButton,
  CancelButton,
  ButtonGroup
} from './EditProfile.styled'
function EditProfile() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    website: '',
    avatar: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cropperImage, setCropperImage] = useState(null)
  const toast = useToast()
  useEffect(() => {
    loadProfile()
  }, [])
  const loadProfile = async () => {
    try {
      // ALWAYS use getCurrentUser() first (from localStorage)
      const user = getCurrentUser()
      if (!user) {
        throw new Error('No user logged in')
      }
      console.log('[EditProfile] Using current user from localStorage:', user)
      const nameParts = user.fullName?.split(' ') || []
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        bio: user.bio || '',
        website: user.website || '',
        avatar: user.avatar ? `${API_BASE}${user.avatar}` : 'https://via.placeholder.com/150'
      })
    } catch (error) {
      console.error('[EditProfile] Failed to load from localStorage:', error)
      // Fallback to API only if localStorage fails
      try {
        const response = await getProfile()
        const user = response.user
        console.log('[EditProfile] Loaded from API:', user)
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          bio: user.bio || '',
          website: user.website || '',
          avatar: user.avatar ? `${API_BASE}${user.avatar}` : 'https://via.placeholder.com/150'
        })
      } catch (apiError) {
        console.error('[EditProfile] API also failed:', apiError)
      }
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      loadImageFile(file)
        .then(async (base64) => {
          // Validate dimensions - profile pics should be at least 200x200
          await validateImageDimensions(base64, 200, 200)
          setCropperImage(base64)
        })
        .catch(error => {
          toast.error(error.message)
        })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('website', formData.website)
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }
      const response = await updateProfile(formDataToSend)
      alert('Profile updated successfully!')
      navigate('/profile')
    } catch (error) {
      alert(`Failed to update profile: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  return (
    <EditContainer>
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onCrop={(croppedImage) => {
            // Convert cropped base64 to file
            const arr = croppedImage.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            const croppedFile = new File([u8arr], 'avatar.jpg', { type: mime })
            setAvatarFile(croppedFile)
            setFormData(prev => ({
              ...prev,
              avatar: croppedImage
            }))
            setCropperImage(null)
            toast.success('Photo selected! Now save your changes.')
          }}
          onCancel={() => setCropperImage(null)}
          aspectRatio={1}
          title="Crop Your Profile Picture"
        />
      )}
      <EditHeader>
        <BackButton onClick={() => navigate('/profile')}>
          <ArrowLeft size={24} />
        </BackButton>
        <EditTitle>Edit Profile</EditTitle>
      </EditHeader>
      <EditForm onSubmit={handleSubmit}>
        <ProfileImageEdit>
          <ProfileImageWrapper>
            <ProfileImageLarge src={formData.avatar} alt="Profile" />
            <label htmlFor="avatar-upload">
              <ChangePhotoButton type="button" as="div">
                <Camera size={20} />
                Change Photo
              </ChangePhotoButton>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </ProfileImageWrapper>
        </ProfileImageEdit>
        <FormGroup>
          <Label>First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
        </FormGroup>
        <FormGroup>
          <Label>Bio</Label>
          <TextArea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            maxLength={150}
            rows={4}
          />
          <CharCount>{formData.bio.length}/150</CharCount>
        </FormGroup>
        <FormGroup>
          <Label>Website</Label>
          <Input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />
        </FormGroup>
        <ButtonGroup>
          <SaveButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </SaveButton>
          <CancelButton type="button" onClick={() => navigate('/profile')}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </EditForm>
    </EditContainer>
  )
}
export default EditProfile

