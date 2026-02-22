import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Mail, Lock, Eye, EyeOff, User, ChevronDown, UserCircle } from 'lucide-react'
import { signup } from '../../services/api'
import {
  PageContainer, OuterCard, InnerCard, AvatarContainer, LogoContainer, LogoBox,
  BrandName, Heading, Subheading, Form, InputWrapper, InputIcon, Input, 
  PasswordToggle, SignInButton,
  Footer, SignUpLink,
  RoleDropdownContainer, RoleButton, RoleIcon, RoleDropdownIcon, DropdownMenu, DropdownItem,
} from './Login.styled'
const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'User' })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const roles = ['User', 'Reviewer', 'Business']
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('') // Clear error when user types
  }
  const validateName = (name) => {
    if (/\d/.test(name)) {
      return 'Name cannot contain numbers'
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters'
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name can only contain letters and spaces'
    }
    return null
  }
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return 'Email is incorrect. Please enter a valid email (e.g., user@gmail.com)'
    }
    return null
  }
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const nameError = validateName(formData.fullName)
    if (nameError) {
      setError(nameError)
      return
    }
    const emailError = validateEmail(formData.email)
    if (emailError) {
      setError(emailError)
      return
    }
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...userData } = formData
      console.log('Signing up with role:', userData.role)
      const response = await signup(userData)
      console.log('Signup response:', response)
      alert(`Account created! Welcome ${response.user.fullName} as ${response.user.role}`)
      if (response.user.role === 'Business') {
        window.location.href = '/dashboard'
      } else if (response.user.role === 'Reviewer') {
        window.location.href = '/review-center'
      } else {
        window.location.href = '/feed'
      }
    } catch (error) {
      setError(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <PageContainer>
      <OuterCard>
        <InnerCard>
          <AvatarContainer>
            <UserCircle />
          </AvatarContainer>
          <LogoContainer>
            <LogoBox><Check size={16} /></LogoBox>
            <BrandName>Verity</BrandName>
          </LogoContainer>
          <Heading>Create Account</Heading>
          <Subheading>Join Verity and start sharing verified content</Subheading>
          {error && (
            <div style={{ 
              width: '100%',
              padding: '0.75rem', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '0.75rem', 
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <RoleDropdownContainer>
              <RoleButton 
                type="button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                disabled={loading}
              >
                <RoleIcon>
                  <User />
                </RoleIcon>
                Sign up as {formData.role}
                <RoleDropdownIcon $isOpen={isDropdownOpen}>
                  <ChevronDown />
                </RoleDropdownIcon>
              </RoleButton>
              <DropdownMenu $isOpen={isDropdownOpen}>
                {roles.map((role) => (
                  <DropdownItem 
                    key={role} 
                    type="button" 
                    $isSelected={formData.role === role} 
                    onClick={() => { 
                      console.log('Selected role:', role)
                      setFormData({ ...formData, role })
                      setIsDropdownOpen(false) 
                    }}
                  >
                    {role}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </RoleDropdownContainer>
            <InputWrapper>
              <InputIcon>
                <UserCircle />
              </InputIcon>
              <Input 
                type="text" 
                name="fullName" 
                placeholder="Full Name (letters only)" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
                disabled={loading}
                pattern="[a-zA-Z\s]+"
                title="Name can only contain letters and spaces"
              />
            </InputWrapper>
            <InputWrapper>
              <InputIcon>
                <Mail />
              </InputIcon>
              <Input 
                type="email" 
                name="email" 
                placeholder="Email Address (e.g., user@gmail.com)" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={loading}
                pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                title="Please enter a valid email address"
              />
            </InputWrapper>
            <InputWrapper>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input 
                type={showPassword ? "text" : "password"}
                name="password" 
                placeholder="Password (min 8 chars, atleast 1 uppercase)" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                minLength={8}
                disabled={loading}
                title="Password must be at least 8 characters with 1 uppercase letter and 1 number"
              />
              <PasswordToggle 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </PasswordToggle>
            </InputWrapper>
            <InputWrapper>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input 
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
                minLength={8}
                disabled={loading}
                title="Re-enter your password"
              />
              <PasswordToggle 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </PasswordToggle>
            </InputWrapper>
            <SignInButton type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </SignInButton>
          </Form>
          <Footer>
            Already have an account? <SignUpLink onClick={() => navigate('/')}>Sign in</SignUpLink>
          </Footer>
        </InnerCard>
      </OuterCard>
    </PageContainer>
  )
}
export default Signup
