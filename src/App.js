import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useRecipes } from './hooks/useRecipes';
import { updateFavorites, deleteUserRecipe } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Categories from './components/Categories';
import RecipeGrid from './components/RecipeGrid';
import RecipeModal from './components/RecipeModal';
import AuthModal from './components/AuthModal';
import CreateRecipeModal from './components/CreateRecipeModal';
import QuickSearch from './components/QuickSearch';
import Footer from './components/Footer';

const AppContent = () => {
  // ✅ All useState hooks are INSIDE the component
  const [currentView, setCurrentView] = useState('app');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDark, setIsDark] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isMyRecipesLoading, setIsMyRecipesLoading] = useState(false);

  const { user, isAuthenticated, favorites, refreshUser, setFavorites } = useAuth();
  const { recipes, loading, searchRecipes, filterByCategory, setRecipes } = useRecipes();

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      setFavorites(user.favorites || []);
    }
  }, [user, setFavorites]);

  // Handle toggling favorites
  const handleToggleFavorite = async (meal) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      setAuthTab('login');
      return;
    }

    try {
      const token = localStorage.getItem('recipeRunToken');
      const currentFavorites = [...favorites];
      const index = currentFavorites.findIndex(f => f.idMeal === meal.idMeal);

      if (index > -1) {
        currentFavorites.splice(index, 1);
      } else {
        currentFavorites.push({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory || 'Recipe'
        });
      }

      await updateFavorites(token, currentFavorites);
      setFavorites(currentFavorites);
      await refreshUser();
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites. Please try again.');
    }
  };

  // Handle deleting a recipe
  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const token = localStorage.getItem('recipeRunToken');
      await deleteUserRecipe(token, recipeId);
      await refreshUser();
      handleShowMyRecipes();
      alert('✅ Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('❌ Failed to delete recipe. Please try again.');
    }
  };

  // Handle viewing recipe details
  const handleViewDetails = async (meal) => {
    console.log('📋 Viewing details for:', meal);

    try {
      if (meal.isUserRecipe) {
        console.log('✅ User recipe, showing directly');
        setSelectedRecipe(meal);
        setIsModalOpen(true);
        return;
      }

      console.log('🔍 Fetching full recipe for ID:', meal.idMeal);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const data = await response.json();

      if (data.meals && data.meals[0]) {
        console.log('✅ Full recipe data fetched:', data.meals[0]);
        setSelectedRecipe(data.meals[0]);
        setIsModalOpen(true);
      } else {
        console.warn('⚠️ Full recipe not found, using summary data');
        setSelectedRecipe(meal);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('❌ Error fetching recipe details:', error);
      setSelectedRecipe(meal);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (query) => {
    setActiveCategory(null);
    searchRecipes(query);
  };

  const handleFilter = (category) => {
    setActiveCategory(category);
    filterByCategory(category);
  };

  const handleShowHome = () => {
    setCurrentView('app');
    setActiveCategory('All');
    filterByCategory('All');
  };

  const handleShowFavorites = () => {
    setCurrentView('app');
    setActiveCategory(null);
    if (!isAuthenticated) {
      setRecipes([]);
      return;
    }
    setRecipes(favorites);
  };

  // handleShowMyRecipes with loading state
  const handleShowMyRecipes = async () => {
    setCurrentView('app');
    setActiveCategory(null);
    setIsMyRecipesLoading(true);

    const email = localStorage.getItem('recipeRunSession');
    if (!email) {
      setRecipes([]);
      setIsMyRecipesLoading(false);
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('recipeRunUsers') || '{}');
      const currentUser = users[email];

      if (!currentUser) {
        setRecipes([]);
        setIsMyRecipesLoading(false);
        return;
      }

      const userRecipes = currentUser.myRecipes || [];
      console.log('📝 My Recipes found:', userRecipes.length);

      setTimeout(() => {
        setRecipes(userRecipes);
        setIsMyRecipesLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error loading my recipes:', error);
      setRecipes([]);
      setIsMyRecipesLoading(false);
    }
  };

  const handleShowAbout = () => {
    setCurrentView('about');
  };

  const handleRecipeCreated = () => {
    handleShowMyRecipes();
  };

  // Initial load
  useEffect(() => {
    filterByCategory('All');
  }, [filterByCategory]);

  // Check if we're showing user-specific content (My Recipes or Favorites)
  const isUserContent = activeCategory === null && !document.getElementById('user-input')?.value;

  return (
    <div className="App" data-theme={isDark ? 'dark' : ''}>
      <Navbar
        onShowHome={handleShowHome}
        onShowFavorites={handleShowFavorites}
        onShowMyRecipes={handleShowMyRecipes}
        onShowAbout={handleShowAbout}
        onOpenAuth={(tab) => { setIsAuthOpen(true); setAuthTab(tab); }}
        onToggleDarkMode={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      {currentView === 'about' ? (
        <About onBack={handleShowHome} />
      ) : (
        <>
          <Hero onSearch={handleSearch} onFilter={handleFilter} />

          <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
            <button className="create-recipe-btn" onClick={() => setIsCreateOpen(true)}>
              <i className="fas fa-plus-circle"></i> Create Your Own Recipe
            </button>
          </div>

          <Categories activeCategory={activeCategory} onFilter={handleFilter} />

          {loading || isMyRecipesLoading ? (
            <div className="recipe-container">
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
                <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>Loading...</p>
              </div>
            </div>
          ) : (
            <RecipeGrid
              recipes={recipes}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              showDelete={isUserContent}
              onDelete={handleDeleteRecipe}
              showMoreMessage={!!activeCategory}
              onQuickSearch={() => setIsQuickSearchOpen(true)}
              loading={false}
              emptyMessage={!isAuthenticated ? "🔒 Log in to see your recipes" : "📝 No recipes found. Create your first recipe!"}
            />
          )}
        </>
      )}

      <RecipeModal
        meal={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />

      <CreateRecipeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onRecipeCreated={handleRecipeCreated}
      />

      <QuickSearch
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        onSearch={handleSearch}
      />

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;