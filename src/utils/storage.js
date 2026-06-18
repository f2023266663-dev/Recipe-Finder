export const USERS_KEY = 'recipeRunUsers';
export const SESSION_KEY = 'recipeRunSession';
export const PUBLIC_RECIPES_KEY = 'recipeRunPublicRecipes';

export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
};

export const saveAllUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUserEmail = () => {
  return localStorage.getItem(SESSION_KEY) || null;
};

export const getCurrentUser = () => {
  const email = getCurrentUserEmail();
  if (!email) return null;
  const users = getAllUsers();
  return users[email] || null;
};

export const getFavorites = () => {
  const user = getCurrentUser();
  return user ? user.favorites : [];
};

export const isLoggedIn = () => {
  return !!getCurrentUser();
};

export const getPublicRecipes = () => {
  return JSON.parse(localStorage.getItem(PUBLIC_RECIPES_KEY)) || [];
};

export const savePublicRecipes = (recipes) => {
  localStorage.setItem(PUBLIC_RECIPES_KEY, JSON.stringify(recipes));
};