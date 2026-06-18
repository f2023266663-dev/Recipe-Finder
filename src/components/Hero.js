import React, { useState } from 'react';

const Hero = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="hero" id="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">🥗 Recipe<span>Run</span></h1>
        <p className="hero-subtitle">Discover, Cook, and Share Amazing Recipes</p>
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            id="user-input"
            placeholder="Search for recipes... e.g., Chicken, Pasta, Dessert"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id="search-btn" onClick={handleSearch}>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        
      </div>
    </header>
  );
};

export default Hero;