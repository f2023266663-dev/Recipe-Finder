const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: [{
    idMeal: String,
    strMeal: String,
    strMealThumb: String,
    strCategory: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  myRecipes: [{
    idMeal: String,
    strMeal: String,
    strMealThumb: String,
    strCategory: String,
    strArea: String,
    strInstructions: String,
    strIngredients: [String],
    strPrepTime: String,
    strServings: String,
    isPublic: Boolean,
    isUserRecipe: Boolean,
    dateCreated: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);