const API_URL = 'http://localhost:5000/api'

// Create Story
export const createStory = async (formData) => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create story')
    }

    return data
  } catch (error) {
    throw error
  }
}

// Get All Stories
export const getStories = async () => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/stories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stories')
    }

    return data
  } catch (error) {
    throw error
  }
}

// View Story
export const viewStory = async (storyId) => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/stories/${storyId}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to view story')
    }

    return data
  } catch (error) {
    throw error
  }
}

// Delete Story
export const deleteStory = async (storyId) => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/stories/${storyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete story')
    }

    return data
  } catch (error) {
    throw error
  }
}
