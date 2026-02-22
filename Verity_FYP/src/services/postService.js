const API_URL = 'http://localhost:5000/api'
export const createPost = async (formData) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post')
    }
    return data
  } catch (error) {
    throw error
  }
}
export const getFeed = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/posts/feed?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch feed')
    }
    return data
  } catch (error) {
    throw error
  }
}
