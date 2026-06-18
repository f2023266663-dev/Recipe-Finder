const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔗 API_URL:', API_URL);  // ← ADD THIS to verify

// Helper for API calls
const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const url = `${API_URL}${endpoint}`;
  console.log(`📤 ${method} ${url}`);  // ← ADD THIS

  try {
    const response = await fetch(url, options);
    console.log(`📥 Response status:`, response.status);
    
    const result = await response.json();
    console.log(`📥 Response data:`, result);
    
    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }
    
    return result;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

// Auth APIs
export const loginUser = async (email, password) => {
  return apiRequest('/auth/login', 'POST', { email, password });
};

export const registerUser = async (name, email, password) => {
  return apiRequest('/auth/register', 'POST', { name, email, password });
};

export const getCurrentUser = async (token) => {
  return apiRequest('/auth/me', 'GET', null, token);
};

// Favorites APIs
export const updateFavorites = async (token, favorites) => {
  return apiRequest('/auth/favorites', 'PUT', { favorites }, token);
};

// Recipe APIs
export const addUserRecipe = async (token, recipe) => {
  return apiRequest('/auth/recipes', 'POST', recipe, token);
};

export const deleteUserRecipe = async (token, recipeId) => {
  return apiRequest(`/auth/recipes/${recipeId}`, 'DELETE', null, token);
};

export const updateUserRecipe = async (token, recipeId, updates) => {
  return apiRequest(`/auth/recipes/${recipeId}`, 'PUT', updates, token);
};

// Public APIs
export const getPublicRecipes = async () => {
  return apiRequest('/public/recipes', 'GET');
};

export const getPublicRecipe = async (id) => {
  return apiRequest(`/public/recipes/${id}`, 'GET');
};