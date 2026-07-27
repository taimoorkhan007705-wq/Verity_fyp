const isDev = import.meta.env.DEV
const apiUrlEnv = import.meta.env.VITE_API_URL
const apiBaseEnv = import.meta.env.VITE_API_BASE

const getApiUrl = () => {
  // If explicitly set in .env and NOT a localhost value, use it (for ngrok and other remote access)
  if (apiUrlEnv && !apiUrlEnv.includes('localhost')) {
    return apiUrlEnv
  }
  
  // If accessing through ngrok, use the ngrok origin + /api
  if (typeof window !== 'undefined' && window.location.origin.includes('ngrok')) {
    return `${window.location.origin}/api`
  }
  
  // In development, use relative proxy path
  if (isDev) {
    return '/api'
  }
  
  // In production, use origin
  return `${window.location.origin}/api`
}

const getApiBase = () => {
  // If explicitly set in .env and NOT a localhost value, use it
  if (apiBaseEnv && !apiBaseEnv.includes('localhost')) {
    return apiBaseEnv
  }
  
  // Default to current origin (works for both localhost and ngrok)
  return window.location.origin
}

export const API_BASE = getApiBase()
export const API_URL = getApiUrl()

export const mediaUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) {
    // If it's already HTTP, convert to HTTPS if on ngrok
    if (path.includes('localhost:5173')) {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : API_BASE
      return path.replace('http://localhost:5173', currentOrigin)
    }
    return path
  }
  
  // Always use the current origin dynamically
  let currentOrigin = typeof window !== 'undefined' ? window.location.origin : API_BASE
  
  // Ensure HTTPS when on ngrok
  if (currentOrigin.includes('ngrok')) {
    currentOrigin = currentOrigin.replace('http://', 'https://')
  }
  
  // Construct absolute URL
  if (path.startsWith('/uploads')) {
    const absoluteUrl = `${currentOrigin}${path}`
    console.log('[mediaUrl] Image URL:', { original: path, absolute: absoluteUrl })
    return absoluteUrl
  }
  
  // If it's just a filename or partial path, prepend /uploads/
  if (!path.startsWith('/')) {
    return `${currentOrigin}/uploads/${path}`
  }
  
  return `${currentOrigin}${path}`
}
