import { API_BASE, API_URL } from '../config.js'
import { clearAuthSession, saveAuthSession, getActiveToken, getActiveUser } from './roleSession.js'

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
      saveAuthSession(data.user?.role || userData.role || 'User', data.token, data.user);
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const login = async (credentials) => {
  try {
    clearAuthSession()
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    // Check if response is empty
    if (!response.body) {
      throw new Error('Empty response from server');
    }
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('[API] JSON Parse Error:', parseError);
      console.error('[API] Response status:', response.status);
      console.error('[API] Response statusText:', response.statusText);
      throw new Error(`Failed to parse response: ${parseError.message}`);
    }
    
    if (!response.ok) {
      throw new Error(data.message || `Login failed (${response.status})`);
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
      saveAuthSession(data.user?.role || credentials.role || 'User', data.token, data.user);
      console.log('Login API - Stored in scoped localStorage:', JSON.parse(localStorage.getItem('verity_' + (data.user?.role || credentials.role || 'user').toLowerCase() + '_user')));
    }
    return data;
  } catch (error) {
    console.error('[API] Login error:', error);
    throw error;
  }
};
export const getUserProfile = async () => {
  try {
    const token = getActiveToken();
    const response = await fetch(`${API_URL}/users/profiles`, {
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
  clearAuthSession();
};
export const isAuthenticated = () => {
  return !!getActiveToken();
};
export const getCurrentUser = () => {
  const user = getActiveUser();
  if (!user) return null;
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
export const getFeed = async (page = 1, limit = 10, category = 'All') => {
  try {
    const categoryParam = category && category !== 'All' ? `&category=${category}` : '';
    const response = await fetch(`${API_URL}/posts/feed?page=${page}&limit=${limit}${categoryParam}`, {
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

/**
 * NEW: Vote on a post using the 2-vote majority system
 * Requires 2 votes (out of 3) to make a decision
 */
export const voteOnPost = async (postId, vote, reasoning = '') => {
  try {
    const token = localStorage.getItem('token');
    
    console.log('[VoteOnPost] Attempting to vote:', {
      postId,
      vote,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NO TOKEN',
      apiUrl: `${API_URL}/reviewer/posts/${postId}/vote`
    });

    if (!token) {
      console.error('[VoteOnPost] ❌ NO TOKEN FOUND - User not logged in!');
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${API_URL}/reviewer/posts/${postId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        vote, // 'approve' or 'reject'
        reasoning
      }),
    });

    console.log('[VoteOnPost] Response status:', response.status);
    
    const data = await response.json();
    
    console.log('[VoteOnPost] Response data:', {
      success: data.success,
      message: data.message,
      error: data.error,
      statusCode: response.status
    });

    if (!response.ok) {
      console.error('[VoteOnPost] ❌ Vote failed:', {
        status: response.status,
        message: data.message,
        error: data.error
      });
      throw new Error(data.message || `Vote failed (HTTP ${response.status}): ${data.error || 'Unknown error'}`);
    }
    
    console.log('[VoteOnPost] ✅ Vote successful');
    return data;
  } catch (error) {
    console.error('[VoteOnPost] 🔥 Critical error:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Get reviewer's queue - posts awaiting their vote
 */
const fetchReviewerQueueFromLegacyEndpoint = async (token) => {
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
  return data;
};

export const getReviewerQueue = async () => {
  try {
    const token = getActiveToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_URL}/reviewer/queue`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 404) {
        return await fetchReviewerQueueFromLegacyEndpoint(token);
      }
      throw new Error(data.message || 'Failed to fetch reviewer queue');
    }

    if (!Array.isArray(data.posts) && Array.isArray(data.data)) {
      data.posts = data.data;
    }
    if (!Array.isArray(data.posts) && Array.isArray(data.queue)) {
      data.posts = data.queue;
    }
    return data;
  } catch (error) {
    try {
      const token = getActiveToken();
      if (token) {
        return await fetchReviewerQueueFromLegacyEndpoint(token);
      }
    } catch (fallbackError) {
      // ignore fallback error, throw original
    }
    throw error;
  }
};

/**
 * Get reviewer leaderboard - all reviewers sorted by trust score
 */
export const getReviewerLeaderboard = async () => {
  try {
    const url = `${API_URL}/admin/reviewers/leaderboard`
    console.log('[API] Fetching leaderboard from:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    console.log('[API] Response status:', response.status)
    console.log('[API] Response ok:', response.ok)
    console.log('[API] Response headers:', {
      'content-type': response.headers.get('content-type'),
    })
    
    const data = await response.json();
    console.log('[API] Parsed data:', data)
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: Failed to fetch leaderboard`);
    }
    return data;
  } catch (error) {
    console.error('[GetReviewerLeaderboard] Error:', error);
    console.error('[GetReviewerLeaderboard] Error type:', error.constructor.name);
    console.error('[GetReviewerLeaderboard] Error message:', error.message);
    throw error;
  }
};

/**
 * Get a specific post for review with voting details
 */
export const getPostForReview = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviewer/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch post');
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
const refreshStoredUser = (user) => {
  if (!user) return;
  const token = getActiveToken();
  const currentRole = user.role || getActiveUser()?.role || 'User';
  if (token) {
    saveAuthSession(currentRole, token, user);
  } else {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    if (data.user) {
      refreshStoredUser(data.user);
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profiles`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData handles Content-Type automatically
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    if (data.user) {
      refreshStoredUser(data.user);
    } else {
      const refreshed = await getProfile();
      if (refreshed.user) {
        refreshStoredUser(refreshed.user);
      }
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
