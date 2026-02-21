const API_URL = 'http://localhost:5000/api'

// Get User Profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile')
    }

    return data
  } catch (error) {
    throw error
  }
}

// Update User Profile
export const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile')
    }

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return data
  } catch (error) {
    throw error
  }
}
