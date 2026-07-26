import { API_BASE, API_URL } from '../config.js'
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
export const getFeed = async (page = 1, limit = 10, category = null) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (category && category !== 'All') {
      params.append('category', category)
    }
    
    const response = await fetch(`${API_URL}/posts/feed?${params}`, {
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
