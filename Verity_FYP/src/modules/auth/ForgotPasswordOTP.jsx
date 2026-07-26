import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, Loader } from 'lucide-react'
import { API_URL } from '../../config'
import { saveAuthSession } from '../../services/roleSession'

function ForgotPasswordOTP() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email → otp → password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[ForgotPasswordOTP] ===== REQUESTING OTP =====')
      console.log('[ForgotPasswordOTP] Email:', email)
      console.log('[ForgotPasswordOTP] API URL:', `${API_URL}/auth/forgot-password-otp`)
      
      const response = await fetch(`${API_URL}/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email })
      })

      console.log('[ForgotPasswordOTP] Response Status:', response.status)
      const data = await response.json()
      console.log('[ForgotPasswordOTP] Response Data:', data)

      if (!response.ok) {
        console.error('[ForgotPasswordOTP] API Error:', data)
        throw new Error(data.message || `Failed to send OTP (${response.status})`)
      }

      console.log('[ForgotPasswordOTP] ✅ OTP requested successfully')
      setStep('otp')
      setCountdown(600) // 10 minutes
      
      // Countdown timer
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            setError('OTP expired. Please request a new one.')
            setStep('email')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      console.error('[ForgotPasswordOTP] ❌ ERROR:', err)
      console.error('[ForgotPasswordOTP] Error Message:', err.message)
      setError(err.message || 'Failed to send OTP. Check console (F12) for details.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (otp.length !== 6) {
        throw new Error('OTP must be 6 digits')
      }

      console.log('[ForgotPasswordOTP] Verifying OTP')
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const data = await response.json()
      console.log('[ForgotPasswordOTP] Verification response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP')
      }

      setResetToken(data.resetToken)
      setStep('password')
    } catch (err) {
      console.error('[ForgotPasswordOTP] Verification error:', err)
      setError(err.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!newPassword || !confirmPassword) {
        throw new Error('Please fill in all fields')
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters')
      }

      console.log('[ForgotPasswordOTP] Resetting password')
      const response = await fetch(`${API_URL}/auth/reset-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword,
          confirmPassword
        })
      })

      const data = await response.json()
      console.log('[ForgotPasswordOTP] Reset response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
      }

      // Auto-login if token is provided
      if (data.autoLogin && data.token) {
        console.log('[ForgotPasswordOTP] ✅ Auto-logging in user...')
        console.log('[ForgotPasswordOTP] Token:', data.token)
        console.log('[ForgotPasswordOTP] User:', data.user)
        console.log('[ForgotPasswordOTP] User Role:', data.user.role)
        
        // Use saveAuthSession to properly store auth data with role-scoped keys
        saveAuthSession(data.user.role, data.token, data.user)
        
        setResetSuccess(true)

        // Redirect to home after 2 seconds using React Router
        setTimeout(() => {
          navigate('/?passwordResetSuccess=true', { replace: true })
        }, 2000)
      } else {
        // If no token, redirect to login
        navigate('/login', { replace: true })
      }
    } catch (err) {
      console.error('[ForgotPasswordOTP] Reset error:', err)
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px',
        padding: '3rem 2rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Lock size={48} color="#14b8a6" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: '#1f2937',
            margin: '0 0 0.5rem'
          }}>
            Reset Password
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '0.95rem'
          }}>
            {step === 'email' && 'Enter your email to receive an OTP'}
            {step === 'otp' && 'Enter the 6-digit code sent to your email'}
            {step === 'password' && 'Create your new password'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#dc2626',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleRequestOTP}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#cbd5e1' : '#14b8a6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onHover={!loading ? (e) => e.currentTarget.style.backgroundColor = '#0d9488' : null}
            >
              {loading && <Loader size={18} />}
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  OTP Code
                </label>
                <span style={{
                  fontSize: '0.85rem',
                  color: countdown > 300 ? '#10b981' : countdown > 60 ? '#f59e0b' : '#ef4444',
                  fontWeight: '600'
                }}>
                  {formatTime(countdown)} remaining
                </span>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem',
                  textAlign: 'center',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: (loading || otp.length !== 6) ? '#cbd5e1' : '#14b8a6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              {loading && <Loader size={18} />}
              Verify OTP
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              ← Change Email
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && !resetSuccess && (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '0.75rem' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '0.75rem' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#6b7280'
            }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ cursor: 'pointer', width: '1rem', height: '1rem' }}
              />
              Show passwords
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#cbd5e1' : '#14b8a6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading && <Loader size={18} />}
              Reset Password
            </button>
          </form>
        )}

        {/* Success Screen */}
        {resetSuccess && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-in' }}>
            <div style={{
              fontSize: '5rem',
              marginBottom: '1.5rem',
              animation: 'scaleIn 0.6s ease-out'
            }}>
              ✅
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '900',
              color: '#10b981',
              margin: '0 0 1rem',
            }}>
              Password Reset Successful!
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              Your password has been changed successfully. You are now logged in and will be redirected to your dashboard.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#14b8a6',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Redirecting...
            </div>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes scaleIn {
                from { 
                  opacity: 0;
                  transform: scale(0.5);
                }
                to { 
                  opacity: 1;
                  transform: scale(1);
                }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Back to Login */}
        {!resetSuccess && (
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#14b8a6',
              cursor: 'pointer',
              fontWeight: '600',
              width: '100%',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0d9488'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#14b8a6'}
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordOTP
