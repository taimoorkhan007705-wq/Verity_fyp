const API_URL = 'http://localhost:5000/api'
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed')
    }
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  } catch (error) {
    throw error
  }
}
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  } catch (error) {
    throw error
  }
}
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}
