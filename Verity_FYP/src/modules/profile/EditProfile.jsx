import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ArrowLeft } from 'lucide-react'
import { getCurrentUser, getProfile, updateProfile } from '../../services/api'
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
  useEffect(() => {
    loadProfile()
  }, [])
  const loadProfile = async () => {
    try {
      const response = await getProfile()
      const user = response.user
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        website: user.website || '',
        avatar: user.avatar ? `http://localhost:5000${user.avatar}` : 'https://via.placeholder.com/150'
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
      const user = getCurrentUser()
      if (user) {
        const nameParts = user.fullName?.split(' ') || []
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          bio: user.bio || '',
          website: user.website || '',
          avatar: user.avatar ? `http://localhost:5000${user.avatar}` : 'https://via.placeholder.com/150'
        })
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
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
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
