import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// This component redirects to the new OTP-based password reset
const ForgotPassword = () => {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('[ForgotPassword] Redirecting to /forgot-password-otp')
    navigate('/forgot-password-otp', { replace: true })
  }, [navigate])

  return null
}

export default ForgotPassword

