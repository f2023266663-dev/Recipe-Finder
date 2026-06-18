const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      favorites: [],
      myRecipes: []
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
        myRecipes: user.myRecipes
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
        myRecipes: user.myRecipes
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      myRecipes: user.myRecipes
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update favorites
router.put('/favorites', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const { favorites } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { favorites },
      { new: true }
    );

    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorites' });
  }
});

// Add recipe
router.post('/recipes', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const recipe = req.body;

    const user = await User.findById(decoded.userId);
    if (!user.myRecipes) user.myRecipes = [];
    user.myRecipes.push(recipe);
    await user.save();

    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ message: 'Error adding recipe' });
  }
});

// Delete recipe
router.delete('/recipes/:recipeId', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const { recipeId } = req.params;

    const user = await User.findById(decoded.userId);
    user.myRecipes = user.myRecipes.filter(r => r.idMeal !== recipeId);
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

module.exports = router;