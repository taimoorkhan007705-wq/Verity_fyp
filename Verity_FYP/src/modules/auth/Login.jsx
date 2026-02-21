import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Mail, Lock, Eye, EyeOff, User, ChevronDown } from 'lucide-react'
import { login } from '../../services/api'
import {
  PageContainer, OuterCard, InnerCard, AvatarContainer, LogoContainer, LogoBox,
  BrandName, Heading, Subheading, Form, InputWrapper, InputIcon, Input, 
  PasswordToggle, RememberMeContainer, Checkbox, RememberMeLabel, SignInButton,
  Footer, SignUpLink,
  RoleDropdownContainer, RoleButton, RoleIcon, RoleDropdownIcon, DropdownMenu, DropdownItem,
} from './Login.styled'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', role: 'User' })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const roles = ['User', 'Reviewer', 'Business']

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(formData)
      console.log('Login response:', response)
      alert(`Welcome back, ${response.user.fullName}!`)
      
      // Redirect based on role
      if (response.user.role === 'Business') {
        window.location.href = '/dashboard'
      } else if (response.user.role === 'Reviewer') {
        window.location.href = '/review-center'
      } else {
        window.location.href = '/feed'
      }
    } catch (error) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <OuterCard>
        <InnerCard>
          <AvatarContainer>
            <User />
          </AvatarContainer>

          <LogoContainer>
            <LogoBox><Check size={16} /></LogoBox>
            <BrandName>Verity</BrandName>
          </LogoContainer>

          <Heading>Welcome Back</Heading>
          <Subheading>Sign in to your account</Subheading>

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
                Login as {formData.role}
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
                      setFormData({ ...formData, role }); 
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
                <Mail />
              </InputIcon>
              <Input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={loading} 
              />
            </InputWrapper>

            <InputWrapper>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input 
                type={showPassword ? "text" : "password"}
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                disabled={loading} 
              />
              <PasswordToggle 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </PasswordToggle>
            </InputWrapper>

            <RememberMeContainer>
              <Checkbox 
                type="checkbox" 
                id="rememberMe" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <RememberMeLabel htmlFor="rememberMe">Remember me</RememberMeLabel>
            </RememberMeContainer>

            <SignInButton type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </SignInButton>
          </Form>

          <Footer>
            Don't have an account? <SignUpLink onClick={() => navigate('/signup')}>Sign up</SignUpLink>
          </Footer>
        </InnerCard>
      </OuterCard>
    </PageContainer>
  )
}

export default Login
