import React from 'react';

const About = ({ onBack }) => {
  return (
    <div id="about-page" style={{ display: 'block', padding: '60px 8%', background: 'var(--light-color)' }}>
      <div className="about-container">
        <h2 className="about-title">🍽️ About RecipeRun</h2>
        <div className="about-grid">
          <div className="about-card">
            <i className="fas fa-globe-americas"></i>
            <h3>Global Cuisine</h3>
            <p>Explore thousands of recipes from every corner of the world. From Italian pasta to Asian stir-fries, we bring the world's flavors to your kitchen.</p>
          </div>
          <div className="about-card">
            <i className="fas fa-users"></i>
            <h3>Community Driven</h3>
            <p>Share your family recipes, discover new favorites, and connect with food lovers worldwide. Every recipe tells a story!</p>
          </div>
          <div className="about-card">
            <i className="fas fa-heart"></i>
            <h3>Made with Love</h3>
            <p>Our mission is to make cooking accessible and enjoyable for everyone. Whether you're a beginner or a pro, there's always something new to try.</p>
          </div>
          <div className="about-card">
            <i className="fas fa-utensils"></i>
            <h3>Cultural Deliciousness</h3>
            <p>Celebrate the rich tapestry of culinary traditions. Each recipe is a journey through culture, history, and the universal language of good food.</p>
          </div>
        </div>
        <div className="about-mission">
          <h3>🌍 Our Mission</h3>
          <p>RecipeRun was built with a simple goal: to help you find your next great meal. We believe that cooking brings people together, and we're here to inspire your culinary adventures with delicious, tested, and loved recipes from around the globe.</p>
          <button className="back-home-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Back to Recipes
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;