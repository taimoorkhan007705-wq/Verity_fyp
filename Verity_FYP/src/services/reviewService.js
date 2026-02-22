const API_URL = 'http://localhost:5000/api'
export const getPendingReviews = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/reviews/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pending reviews')
    }
    return data
  } catch (error) {
    throw error
  }
}
export const submitReview = async (reviewData) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit review')
    }
    return data
  } catch (error) {
    throw error
  }
}
export const getReviewerStats = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/reviews/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviewer stats')
    }
    return data
  } catch (error) {
    throw error
  }
}
