import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser as fetchCurrentUser } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('recipeRunToken');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Try to get user from API
      try {
        const userData = await fetchCurrentUser(token);
        if (userData && userData.id) {
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            favorites: userData.favorites || [],
            myRecipes: userData.myRecipes || []
          });
          setIsAuthenticated(true);
          setFavorites(userData.favorites || []);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, using localStorage:', apiError);
      }

      // Fallback: Get user from localStorage
      const users = JSON.parse(localStorage.getItem('recipeRunUsers') || '{}');
      const email = localStorage.getItem('recipeRunSession');
      
      if (email && users[email]) {
        const userData = users[email];
        setUser({
          id: email,
          name: userData.name,
          email: userData.email,
          favorites: userData.favorites || [],
          myRecipes: userData.myRecipes || []
        });
        setIsAuthenticated(true);
        setFavorites(userData.favorites || []);
      } else {
        localStorage.removeItem('recipeRunToken');
        localStorage.removeItem('recipeRunSession');
        setUser(null);
        setIsAuthenticated(false);
        setFavorites([]);
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setFavorites([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      favorites,
      loading,
      refreshUser,
      setFavorites
    }}>
      {children}
    </AuthContext.Provider>
  );
};