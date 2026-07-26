import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { API_URL } from '../../config'
import {
  PageContainer, OuterCard, InnerCard, LogoContainer, LogoBox,
  BrandName, Heading, Subheading, Form, InputWrapper, InputIcon, Input, 
  PasswordToggle, SignInButton, Footer, SignUpLink
} from './Login.styled'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)

  useEffect(() => {
    // Get reset token from URL query params
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
    
    if (!tokenFromUrl) {
      setError('❌ Invalid or missing reset link. Please request a new password reset.')
      setTimeout(() => navigate('/forgot-password'), 3000)
      return
    }
    
    setResetToken(tokenFromUrl)
    setTokenValid(true)
  }, [navigate])

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
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

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken,
          newPassword,
          confirmPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
      }

      setSuccess(true)
      
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      setError(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <PageContainer>
        <OuterCard>
          <InnerCard>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#dc2626'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                Invalid Reset Link
              </h2>
              <p style={{ color: '#64748b' }}>
                The reset link is missing or invalid. Redirecting to password recovery...
              </p>
            </div>
          </InnerCard>
        </OuterCard>
      </PageContainer>
    )
  }

  if (success) {
    return (
      <PageContainer>
        <OuterCard>
          <InnerCard>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#14b8a6'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                Password Reset Successfully
              </h2>
              <p style={{ color: '#64748b' }}>
                Your password has been updated. Redirecting to login page...
              </p>
            </div>
          </InnerCard>
        </OuterCard>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <OuterCard>
        <InnerCard>
          <button
            onClick={() => navigate('/')}
            style={{
              alignSelf: 'flex-start',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#14b8a6',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

          <LogoContainer>
            <LogoBox><Check size={16} /></LogoBox>
            <BrandName>Verity</BrandName>
          </LogoContainer>
          <Heading>Reset Password</Heading>
          <Subheading>Enter your new password below</Subheading>

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
            <InputWrapper>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password (min 8 chars, 1 uppercase, 1 number)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            <InputWrapper>
              <InputIcon>
                <Lock />
              </InputIcon>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </PasswordToggle>
            </InputWrapper>

            <SignInButton type="submit" disabled={loading || !tokenValid}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </SignInButton>
          </Form>

          <Footer>
            Remember your password? <SignUpLink onClick={() => navigate('/')}>Sign In</SignUpLink>
          </Footer>
        </InnerCard>
      </OuterCard>
    </PageContainer>
  )
}

export default ResetPassword

