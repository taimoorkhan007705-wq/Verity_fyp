import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Mail, ArrowLeft } from 'lucide-react'
import { API_URL } from '../../config'
import {
  PageContainer, OuterCard, InnerCard, LogoContainer, LogoBox,
  BrandName, Heading, Subheading, Form, InputWrapper, InputIcon, Input, 
  SignInButton, Footer, SignUpLink
} from './Login.styled'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process request')
      }

      setSuccess(true)
      // Token will be in the email link, user doesn't need to do anything here
      // Auto-redirect back to login page after 5 seconds
      setTimeout(() => {
        navigate('/')
      }, 5000)
    } catch (error) {
      setError(error.message || 'Failed to process forgot password request')
    } finally {
      setLoading(false)
    }
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
                Check Your Email
              </h2>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                Click the link in the email to reset your password.
              </p>
              <p style={{ fontSize: '0.875rem', color: '#999' }}>
                Returning to login page in 5 seconds...
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
          <Heading>Forgot Password?</Heading>
          <Subheading>Enter your email to reset your password</Subheading>

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
                <Mail />
              </InputIcon>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </InputWrapper>

            <SignInButton type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword

