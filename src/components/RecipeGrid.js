import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeGrid = ({ 
  recipes, 
  favorites, 
  onToggleFavorite, 
  onViewDetails, 
  showDelete = false,
  onDelete,
  showMoreMessage = false,
  onQuickSearch,
  loading = false,
  emptyMessage = "No recipes found.",
  emptySubMessage = "Try a different search or category."
}) => {
  // Show loading state
  if (loading) {
    return (
      <main className="recipe-container" id="recipe-grid">
        <div style={{ 
          textAlign: 'center', 
          width: '100%', 
          gridColumn: '1/-1',
          padding: '60px 20px'
        }}>
          <div style={{ 
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid var(--border-color)',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>Loading your recipes...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </main>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <main className="recipe-container" id="recipe-grid">
        <div style={{ 
          textAlign: 'center', 
          width: '100%', 
          gridColumn: '1/-1',
          padding: '60px 20px'
        }}>
          <p style={{ fontSize: '4rem', marginBottom: '15px' }}>📝</p>
          <h3 style={{ marginBottom: '10px', color: 'var(--text-color)' }}>{emptyMessage}</h3>
          <p style={{ color: 'var(--text-muted)' }}>{emptySubMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="recipe-container" id="recipe-grid">
      {recipes.map((meal) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          isFavorite={favorites.some(f => f.idMeal === meal.idMeal)}
          onToggleFavorite={onToggleFavorite}
          onViewDetails={onViewDetails}
          showDelete={showDelete}
          onDelete={onDelete}
        />
      ))}
      
      {showMoreMessage && (
        <div className="more-recipes-msg">
          <div className="more-divider"></div>
          <button className="more-icon" onClick={onQuickSearch} aria-label="Search for more recipes">
            <i className="fas fa-utensils"></i>
          </button>
          <p>And much more — just search!</p>
        </div>
      )}
    </main>
  );
};

export default RecipeGrid;