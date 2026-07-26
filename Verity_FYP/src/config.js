const isDev = import.meta.env.DEV
const apiUrlEnv = import.meta.env.VITE_API_URL
const apiBaseEnv = import.meta.env.VITE_API_BASE

const getApiUrl = () => {
  // If explicitly set in .env, use it (for ngrok and other remote access)
  if (apiUrlEnv) {
    return apiUrlEnv
  }
  
  // In development, use relative proxy path
  if (isDev) {
    return '/api'
  }
  
  // In production, use origin
  return `${window.location.origin}/api`
}

const getApiBase = () => {
  // If explicitly set in .env, use it (for ngrok and other remote access)
  if (apiBaseEnv) {
    return apiBaseEnv
  }
  
  // Default to current origin
  return window.location.origin
}

export const API_BASE = getApiBase()
export const API_URL = getApiUrl()

export const mediaUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}
