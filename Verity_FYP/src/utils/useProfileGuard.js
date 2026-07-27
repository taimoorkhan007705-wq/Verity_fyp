import { useState } from 'react'
import { getCurrentUser } from '../services/api'
import { isProfileComplete } from './profileCheck'

export default function useProfileGuard() {
  const [showModal, setShowModal] = useState(false)

  const guard = (action) => {
    const user = getCurrentUser()
    // Admin doesn't need to complete profile
    if (user?.role === 'Admin') {
      if (typeof action === 'function') action()
      return true
    }
    if (!isProfileComplete(user)) {
      setShowModal(true)
      return false
    }
    if (typeof action === 'function') action()
    return true
  }

  return { guard, showModal, closeModal: () => setShowModal(false) }
}
