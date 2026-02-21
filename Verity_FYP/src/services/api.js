const API_URL = 'http://localhost:5000/api';

// Signup API
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

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Login API
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

    // Fix duplicate name bug before storing
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

    // Store token in localStorage
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

// Get User Profile
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

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  const user = JSON.parse(userStr);
  
  // Fix duplicate name bug - extract unique name
  if (user.fullName) {
    const nameParts = user.fullName.trim().split(/\s+/);
    // If name has duplicates like "taimoor taimoor", take unique parts
    const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))];
    // Capitalize first letter of each unique part
    user.fullName = uniqueParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
  }
  
  return user;
};

// Create Post API
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

// Get Feed API
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

    // Log original data
    console.log('Original API response:', JSON.stringify(data.posts[0]?.author, null, 2))

    // Fix duplicate names in posts
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

// Get Pending Reviews (for reviewers)
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

    // Fix duplicate names in pending posts
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

// Submit Review (for reviewers)
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


// Get Reviewer Stats (for reviewers)
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

// Get User Profile
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

// Update User Profile
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

    // Update localStorage with new user data
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Create Story API
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

// Get All Stories API
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

// Get User Stories API
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

// View Story API
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

// Delete Story API
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
