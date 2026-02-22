const API_URL = 'http://localhost:5000/api';
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.user && data.user.fullName) {
      const nameParts = data.user.fullName.trim().split(/\s+/);
      const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))];
      data.user.fullName = uniqueParts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
    }
    console.log('Login API - Full response:', data);
    console.log('Login API - User object:', data.user);
    console.log('Login API - Avatar field:', data.user?.avatar);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login API - Stored in localStorage:', JSON.parse(localStorage.getItem('user')));
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  if (user.fullName) {
    const nameParts = user.fullName.trim().split(/\s+/);
    const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))];
    user.fullName = uniqueParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
  }
  return user;
};
export const createPost = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData handles Content-Type automatically
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getFeed = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/posts/feed?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch feed');
    }
    console.log('Original API response:', JSON.stringify(data.posts[0]?.author, null, 2))
    if (data.posts) {
      data.posts = data.posts.map(post => {
        if (post.author && post.author.fullName) {
          const originalName = post.author.fullName
          const nameParts = post.author.fullName.trim().split(/\s+/);
          const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))];
          post.author.fullName = uniqueParts.map(part => 
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          ).join(' ');
          console.log(`Name cleaning: "${originalName}" -> "${post.author.fullName}"`)
        }
        return post;
      });
    }
    console.log('Cleaned data:', JSON.stringify(data.posts[0]?.author, null, 2))
    return data;
  } catch (error) {
    throw error;
  }
};
export const getPendingReviews = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pending reviews');
    }
    if (data.posts) {
      data.posts = data.posts.map(post => {
        if (post.author && post.author.fullName) {
          const nameParts = post.author.fullName.trim().split(/\s+/);
          const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))];
          post.author.fullName = uniqueParts.map(part => 
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          ).join(' ');
        }
        return post;
      });
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const submitReview = async (reviewData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit review');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getReviewerStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviewer stats');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData handles Content-Type automatically
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const createStory = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData handles Content-Type automatically
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create story');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getStories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stories');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getUserStories = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stories/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user stories');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const viewStory = async (storyId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stories/${storyId}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to view story');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const deleteStory = async (storyId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stories/${storyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete story');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
