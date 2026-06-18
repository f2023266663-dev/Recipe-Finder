import React, { useEffect } from 'react';
import { getMealTag, getTagClass } from '../hooks/useRecipes';
import { formatInstructions } from '../utils/formatInstructions';

const RecipeModal = ({ meal, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('stop-scrolling');
    } else {
      document.body.classList.remove('stop-scrolling');
    }
    return () => document.body.classList.remove('stop-scrolling');
  }, [isOpen]);

  if (!isOpen || !meal) {
    return null;
  }

  const tag = getMealTag(meal);
  const tagClass = getTagClass(tag);

  // ============================================================
  // FIXED: Get ingredients from ANY format
  // ============================================================
  const getIngredients = () => {
    // Case 1: User recipe with array of ingredients
    if (meal.isUserRecipe && meal.strIngredients && Array.isArray(meal.strIngredients)) {
      return meal.strIngredients.map((ing, index) => (
        <li key={index}>
          <span className="ingredient-name">{ing}</span>
        </li>
      ));
    }

    // Case 2: API recipe with strIngredient1, strIngredient2, etc.
    const ingredients = [];
    if (!meal.isUserRecipe) {
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() && ingredient.trim() !== '') {
          ingredients.push({
            name: ingredient.trim(),
            measure: measure ? measure.trim() : ''
          });
        }
      }
      
      if (ingredients.length > 0) {
        return ingredients.map((item, index) => (
          <li key={index}>
            <span className="ingredient-name">{item.name}</span>
            {item.measure && <span className="ingredient-measure">{item.measure}</span>}
          </li>
        ));
      }
    }

    // Case 3: If meal has ingredients as a string (some user recipes)
    if (meal.strIngredients && typeof meal.strIngredients === 'string') {
      const parsed = meal.strIngredients.split('\n').filter(line => line.trim());
      return parsed.map((ing, index) => (
        <li key={index}>
          <span className="ingredient-name">{ing}</span>
        </li>
      ));
    }

    // No ingredients found
    return <li>No ingredients listed</li>;
  };

  // ============================================================
  // FIXED: Get instructions as bullet points (no "Step X" labels)
  // ============================================================
  const getInstructions = () => {
  let instructions = meal.strInstructions || meal.instructions || '';

  if (!instructions || instructions.trim() === '') {
    return <p>No instructions available.</p>;
  }

  // Use the smart formatter
  const steps = formatInstructions(instructions);

  if (steps.length === 0 || (steps.length === 1 && steps[0] === 'No instructions available.')) {
    return <p>No instructions available.</p>;
  }

  // Return as bullet points
  return (
    <ul className="instructions-bullets">
      {steps.map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ul>
  );
};
const testInstructions = [
  "Step 1: Preheat oven to 200°C. Step 2: Slice vegetables. Step 3: Bake for 20 minutes.",
  "1. Preheat oven. 2. Mix ingredients. 3. Bake.",
  "Preheat oven to 200°C.\nSlice vegetables into thin rounds.\nBake for 20 minutes until golden.",
  "Directions: Preheat oven. Slice vegetables. Bake until done.",
];

testInstructions.forEach((text, i) => {
  console.log(`Test ${i + 1}:`, formatInstructions(text));
});
  return (
    <div id="recipe-modal" className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div id="modal-body">
          <div className="modal-header">
            <h2>{meal.strMeal || 'Recipe'}</h2>
            <span className={`recipe-tag ${tagClass}`} style={{ position: 'static', display: 'inline-block', marginTop: '5px' }}>
              {tag}
            </span>
          </div>
          
          <div className="modal-image-wrap">
            <img 
              src={meal.strMealThumb || 'https://via.placeholder.com/800x400/2d3436/ffffff?text=Recipe'} 
              alt={meal.strMeal || 'Recipe'} 
              onError={(e) => e.target.src = 'https://via.placeholder.com/800x400/2d3436/ffffff?text=Recipe'} 
            />
            {meal.strArea && (
              <span className="modal-origin">
                <i className="fas fa-map-marker-alt"></i> {meal.strArea} Cuisine
              </span>
            )}
            {meal.isUserRecipe && (
              <span className="modal-origin" style={{ left: 'auto', right: '15px', background: 'var(--primary-color)' }}>
                {meal.isPublic ? '🌍 Public' : '🔒 Private'}
              </span>
            )}
          </div>
          
          {meal.isUserRecipe && meal.strPrepTime && (
            <div className="modal-meta">
              <span><i className="fas fa-clock"></i> {meal.strPrepTime}</span>
              <span><i className="fas fa-users"></i> {meal.strServings}</span>
              <span><i className="fas fa-user"></i> {meal.strCreatorName || 'Anonymous'}</span>
            </div>
          )}
          
          {/* INGREDIENTS SECTION */}
          <div className="modal-ingredients">
            <h3><i className="fas fa-list-ul"></i> Ingredients</h3>
            <ul>{getIngredients()}</ul>
          </div>
          
          {/* INSTRUCTIONS SECTION - NOW WITH BULLET POINTS */}
          <div className="modal-instructions">
            <h3><i className="fas fa-book"></i> Instructions</h3>
            <div className="instructions-text">
              {getInstructions()}
            </div>
          </div>
          
          {meal.strYoutube && (
            <div className="modal-video">
              <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="watch-video-btn">
                <i className="fab fa-youtube"></i> Watch Video Tutorial
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;