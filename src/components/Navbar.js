import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onShowHome, onShowFavorites, onShowMyRecipes, onShowAbout, onOpenAuth, onToggleDarkMode, isDark }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();

 const handleLogout = () => {
  console.log('🔴 Logout clicked!'); // ← ADD THIS
  localStorage.removeItem('recipeRunToken');
  localStorage.removeItem('recipeRunSession');
  refreshUser();
  onShowHome();
};

  return (
    <nav>
      <div className="logo" onClick={onShowAbout} style={{ cursor: 'pointer' }}>🥗 Recipe<span>Run</span></div>
      <ul className="nav-links">
        <li>
          <button onClick={onShowHome} className="nav-link" style={{ background: 'none', border: 'none' }}>
            <i className="fas fa-home"></i> Home
          </button>
        </li>
        <li>
          <button onClick={onShowFavorites} className="nav-link" style={{ background: 'none', border: 'none' }}>
            <i className="fas fa-heart"></i> Favorites
          </button>
        </li>
        <li>
          <button onClick={onShowMyRecipes} className="nav-link" style={{ background: 'none', border: 'none' }}>
            <i className="fas fa-utensils"></i> My Recipes
          </button>
        </li>
        
        {!isAuthenticated ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="auth-btn login-btn" onClick={() => onOpenAuth('login')}>Log In</button>
            <button className="auth-btn signup-btn" onClick={() => onOpenAuth('signup')}>Sign Up</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <span style={{ fontWeight: 500, color: 'var(--text-color)' }}>{user?.name}</span>
            <button onClick={handleLogout} className="auth-btn logout-btn">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        )}
        
        <button id="dark-mode-toggle" onClick={onToggleDarkMode}>
          <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;