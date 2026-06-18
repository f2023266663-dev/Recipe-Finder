import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addUserRecipe } from '../api';

const CreateRecipeModal = ({ isOpen, onClose, onRecipeCreated }) => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    category: 'Breakfast',
    cuisine: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    servings: '',
    visibility: 'public'
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('stop-scrolling');
      setError('');
    } else {
      document.body.classList.remove('stop-scrolling');
    }
    return () => document.body.classList.remove('stop-scrolling');
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('recipe-', '');
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setError(''); // Clear error on change
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({ ...prev, visibility: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { name, image, category, cuisine, ingredients, instructions, prepTime, servings, visibility } = formData;
    
    // Validate required fields
    if (!name || !ingredients || !instructions) {
      setError('Please fill in all required fields (Name, Ingredients, Instructions)');
      setLoading(false);
      return;
    }
    
    try {
      // Get current user email
      const email = localStorage.getItem('recipeRunSession');
      if (!email) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      // Create recipe object
      const newRecipe = {
        idMeal: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        strMeal: name,
        strMealThumb: image || 'https://via.placeholder.com/400x300/2d3436/ffffff?text=My+Recipe',
        strCategory: category,
        strArea: cuisine || 'Homemade',
        strInstructions: instructions,
        strIngredients: ingredients.split('\n').filter(line => line.trim()),
        strPrepTime: prepTime || '30 mins',
        strServings: servings || '4 people',
        isPublic: visibility === 'public',
        isUserRecipe: true,
        dateCreated: new Date().toISOString(),
        strCreator: email
      };

      // === Save to localStorage ===
      const users = JSON.parse(localStorage.getItem('recipeRunUsers') || '{}');
      
      // Initialize user if not exists
      if (!users[email]) {
        users[email] = {
          name: email.split('@')[0],
          email: email,
          favorites: [],
          myRecipes: []
        };
      }
      
      // Initialize myRecipes if not exists
      if (!users[email].myRecipes) {
        users[email].myRecipes = [];
      }
      
      // Add new recipe
      users[email].myRecipes.push(newRecipe);
      
      // Save back to localStorage
      localStorage.setItem('recipeRunUsers', JSON.stringify(users));
      console.log('✅ Recipe saved to localStorage:', newRecipe);

      // === Try to save to backend (if available) ===
      try {
        const token = localStorage.getItem('recipeRunToken');
        if (token) {
          await addUserRecipe(token, newRecipe);
          console.log('✅ Recipe saved to backend');
        }
      } catch (apiError) {
        // Don't fail if backend is not available - recipe is already in localStorage
        console.warn('⚠️ Backend save failed, but recipe saved locally:', apiError);
      }

      // Reset form
      setFormData({
        name: '',
        image: '',
        category: 'Breakfast',
        cuisine: '',
        ingredients: '',
        instructions: '',
        prepTime: '',
        servings: '',
        visibility: 'public'
      });
      
      setLoading(false);
      onClose();
      
      // Refresh user data
      await refreshUser();
      onRecipeCreated();
      
      alert('✅ Recipe created successfully!');
    } catch (error) {
      console.error('❌ Error creating recipe:', error);
      setError(error.message || 'Failed to create recipe. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="create-recipe-modal" className="modal" style={{ display: 'flex' }}>
      <div className="modal-content create-recipe-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-color)' }}>
          <i className="fas fa-utensils" style={{ color: 'var(--primary-color)' }}></i> Create New Recipe
        </h2>
        
        {error && (
          <div style={{ 
            background: '#e74c3c', 
            color: 'white', 
            padding: '12px 16px', 
            borderRadius: '10px', 
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fas fa-tag"></i> Recipe Name *</label>
            <input 
              type="text" 
              id="recipe-name" 
              placeholder="e.g., Grandma's Spaghetti" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-image"></i> Image URL</label>
            <input 
              type="url" 
              id="recipe-image" 
              placeholder="https://example.com/image.jpg" 
              value={formData.image} 
              onChange={handleChange} 
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-tags"></i> Category *</label>
            <select 
              id="recipe-category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              disabled={loading}
            >
              <option value="Breakfast">🌅 Breakfast</option>
              <option value="Lunch">🥪 Lunch</option>
              <option value="Dinner">🌙 Dinner</option>
              <option value="Dessert">🍰 Dessert</option>
              <option value="Other">🍽️ Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-globe"></i> Cuisine</label>
            <input 
              type="text" 
              id="recipe-cuisine" 
              placeholder="e.g., Italian, Mexican, Asian" 
              value={formData.cuisine} 
              onChange={handleChange}
              disabled={loading} 
            />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-list-ul"></i> Ingredients *</label>
            <textarea 
              id="recipe-ingredients" 
              rows="4" 
              placeholder="List each ingredient on a new line&#10;e.g.,&#10;Pasta - 500g&#10;Tomato Sauce - 2 cups" 
              value={formData.ingredients} 
              onChange={handleChange} 
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-book"></i> Instructions *</label>
            <textarea 
              id="recipe-instructions" 
              rows="6" 
              placeholder="Write step-by-step instructions&#10;1. Boil water...&#10;2. Add pasta..." 
              value={formData.instructions} 
              onChange={handleChange} 
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-clock"></i> Prep Time</label>
            <input 
              type="text" 
              id="recipe-prepTime" 
              placeholder="e.g., 15 mins, 1 hour" 
              value={formData.prepTime} 
              onChange={handleChange}
              disabled={loading} 
            />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-users"></i> Servings</label>
            <input 
              type="text" 
              id="recipe-servings" 
              placeholder="e.g., 4 people" 
              value={formData.servings} 
              onChange={handleChange}
              disabled={loading} 
            />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-eye"></i> Visibility *</label>
            <div className="visibility-options">
              <label className="visibility-option">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="public" 
                  checked={formData.visibility === 'public'} 
                  onChange={handleRadioChange}
                  disabled={loading}
                />
                <i className="fas fa-globe"></i> Public (Everyone can see)
              </label>
              <label className="visibility-option">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="private" 
                  checked={formData.visibility === 'private'} 
                  onChange={handleRadioChange}
                  disabled={loading}
                />
                <i className="fas fa-lock"></i> Private (Only you can see)
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-btn" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? (
              <>⏳ Creating Recipe...</>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i> Create Recipe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal;