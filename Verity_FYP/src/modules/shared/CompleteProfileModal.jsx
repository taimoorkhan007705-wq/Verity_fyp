import { useNavigate } from 'react-router-dom'
import { UserCircle, X, ArrowRight } from 'lucide-react'

export default function CompleteProfileModal({ onClose }) {
  const navigate = useNavigate()

  const handleClose = () => {
    onClose()
    navigate(-1)
  }

  const handleGoToProfile = () => {
    onClose()
    navigate('/profile/edit')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'white', borderRadius: 24, padding: '2rem',
          maxWidth: 380, width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative'
        }}
      >
        <button onClick={handleClose} style={{
          position: 'absolute', top: 14, right: 14, background: '#f1f5f9',
          border: 'none', borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={16} color="#64748b" />
        </button>

        <div style={{
          width: 72, height: 72, borderRadius: '50%', backgroundColor: '#f0fdfa',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <UserCircle size={40} color="#14b8a6" />
        </div>

        <h3 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          Complete Your Profile First
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Add a profile photo and bio before you can like, comment, share, or connect with others.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleClose} style={{
            flex: 1, padding: '10px 0', borderRadius: 12, border: '1px solid #e2e8f0',
            backgroundColor: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
          }}>
            Later
          </button>
          <button onClick={handleGoToProfile} style={{
            flex: 1, padding: '10px 0', borderRadius: 12, border: 'none',
            backgroundColor: '#14b8a6', color: 'white', fontWeight: 700, cursor: 'pointer',
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            Set Up Profile <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

