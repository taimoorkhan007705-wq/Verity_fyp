/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import Toast from '../components/Toast/Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const removeToastRef = useRef(null)

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, isExiting: true } : toast
    ))

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 300)
  }, [])

  useEffect(() => {
    removeToastRef.current = removeToast
  }, [removeToast])

  const addToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, title, duration, isExiting: false }

    setToasts(prev => [...prev, newToast])

    if (duration) {
      setTimeout(() => {
        removeToastRef.current?.(id)
      }, duration)
    }

    return id
  }, [])

  const toast = {
    success: (message, title = '') => addToast(message, 'success', title),
    error: (message, title = '') => addToast(message, 'error', title),
    warning: (message, title = '') => addToast(message, 'warning', title),
    info: (message, title = '') => addToast(message, 'info', title),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

