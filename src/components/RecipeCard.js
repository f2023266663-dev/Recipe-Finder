import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMealTag, getTagClass } from '../hooks/useRecipes';

const RecipeCard = ({ 
  meal, 
  isFavorite, 
  onToggleFavorite, 
  onViewDetails, 
  showDelete = false,
  onDelete 
}) => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const tag = getMealTag(meal);
  const tagClass = getTagClass(tag);
  const isOwner = meal.isUserRecipe && meal.strCreator === user?.email;
  const isPublic = meal.isPublic !== undefined ? meal.isPublic : true;

  useEffect(() => {
    // Add loaded class after mount to enable transitions
    const timer = setTimeout(() => setIsLoaded(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getIngredientCount = () => {
    if (meal.isUserRecipe && meal.strIngredients && Array.isArray(meal.strIngredients)) {
      return meal.strIngredients.length;
    }
    if (!meal.isUserRecipe) {
      let count = 0;
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() && ingredient.trim() !== '') {
          count++;
        }
      }
      return count;
    }
    if (meal.strIngredients && typeof meal.strIngredients === 'string') {
      return meal.strIngredients.split('\n').filter(line => line.trim()).length;
    }
    return 0;
  };

  const ingredientCount = getIngredientCount();

  return (
    <div className={`recipe-card ${isLoaded ? 'loaded' : ''}`}>
      <div className="recipe-img-wrap">
        <img 
          src={meal.strMealThumb} 
          alt={meal.strMeal} 
          onError={(e) => e.target.src = 'https://via.placeholder.com/400x300/2d3436/ffffff?text=Recipe'} 
        />
        <span className={`recipe-tag ${tagClass}`}>{tag}</span>
        {meal.isUserRecipe && (
          <span className="recipe-badge user-badge">
            {isPublic ? '🌍 Public' : '🔒 Private'}
          </span>
        )}
        {meal.isUserRecipe && (
          <span className="recipe-badge creator-badge">
            👨‍🍳 {meal.strCreatorName || 'User'}
          </span>
        )}
      </div>
      <div className="recipe-info">
        <button 
          className={`fav-btn ${isFavorite ? 'active' : ''}`} 
          onClick={() => onToggleFavorite(meal)}
        >
          <i className="fas fa-heart"></i>
        </button>
        <h3>{meal.strMeal}</h3>
        <div className="recipe-meta">
          🍽️ {ingredientCount} {ingredientCount === 1 ? 'ingredient' : 'ingredients'}
          {meal.strArea && ` • ${meal.strArea}`}
        </div>
        <button className="view-btn" onClick={() => onViewDetails(meal)}>
          View Recipe <i className="fas fa-arrow-right"></i>
        </button>
        {showDelete && isOwner && (
          <button className="delete-btn" onClick={() => onDelete(meal.idMeal)}>
            <i className="fas fa-trash"></i> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;