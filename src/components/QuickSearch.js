import React, { useState, useEffect, useRef } from 'react';

const QuickSearch = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('stop-scrolling');
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      document.body.classList.remove('stop-scrolling');
      setSearchTerm('');
    }
    return () => document.body.classList.remove('stop-scrolling');
  }, [isOpen]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div id="quick-search-overlay" className="quick-search-overlay visible">
      <div className="quick-search-container">
        <button className="quick-search-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h2>Search for more recipes</h2>
        <div className="quick-search-input-wrap">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            id="quick-search-input" 
            placeholder="Search any dish..."
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;