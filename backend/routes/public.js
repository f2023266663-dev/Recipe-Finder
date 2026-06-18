const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/public/recipes
// @desc    Get all public recipes from all users
// @access  Public
router.get('/recipes', async (req, res) => {
  try {
    // Find all users and get their public recipes
    const users = await User.find({});
    let publicRecipes = [];
    
    users.forEach(user => {
      if (user.myRecipes && user.myRecipes.length > 0) {
        const userPublicRecipes = user.myRecipes.filter(r => r.isPublic === true);
        userPublicRecipes.forEach(recipe => {
          publicRecipes.push({
            ...recipe.toObject ? recipe.toObject() : recipe,
            creatorName: user.name,
            creatorEmail: user.email
          });
        });
      }
    });

    // Sort by date created (newest first)
    publicRecipes.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

    res.json({
      success: true,
      count: publicRecipes.length,
      recipes: publicRecipes
    });
  } catch (error) {
    console.error('Get public recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public recipes'
    });
  }
});

// @route   GET /api/public/recipes/:id
// @desc    Get a specific public recipe by ID
// @access  Public
router.get('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const users = await User.find({});
    let foundRecipe = null;
    let creatorName = '';

    for (const user of users) {
      if (user.myRecipes && user.myRecipes.length > 0) {
        const recipe = user.myRecipes.find(r => 
          r.idMeal === id && r.isPublic === true
        );
        if (recipe) {
          foundRecipe = recipe;
          creatorName = user.name;
          break;
        }
      }
    }

    if (!foundRecipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      recipe: {
        ...foundRecipe.toObject ? foundRecipe.toObject() : foundRecipe,
        creatorName
      }
    });
  } catch (error) {
    console.error('Get public recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe'
    });
  }
});

module.exports = router;