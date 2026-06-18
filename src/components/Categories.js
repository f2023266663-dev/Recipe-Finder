import React from 'react';

const Categories = ({ activeCategory, onFilter }) => {
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts'];
  const icons = ['🍽️', '🌅', '🥪', '🌙', '🍰'];

  return (
    <section className="categories" id="category-filters">
      {categories.map((cat, index) => (
        <button
          key={cat}
          className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          data-category={cat}
          onClick={() => onFilter(cat)}
        >
          {icons[index]} {cat}
        </button>
      ))}
    </section>
  );
};

export default Categories;