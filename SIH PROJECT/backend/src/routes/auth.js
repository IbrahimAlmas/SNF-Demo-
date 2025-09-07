const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Farmer = require('../models/Farmer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new farmer
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('location.country').notEmpty().withMessage('Country is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('farmDetails.landSize').isNumeric().withMessage('Land size must be a number'),
  body('farmDetails.landSizeUnit').isIn(['acres', 'hectares', 'square_meters']).withMessage('Invalid land size unit')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, location, farmDetails, preferences } = req.body;

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farmer already exists with this email' });
    }

    // Create new farmer
    const farmer = new Farmer({
      name,
      email,
      password,
      phone,
      location,
      farmDetails,
      preferences: preferences || {}
    });

    await farmer.save();

    // Generate token
    const token = generateToken(farmer._id);

    res.status(201).json({
      message: 'Farmer registered successfully',
      token,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        location: farmer.location,
        farmDetails: farmer.farmDetails,
        preferences: farmer.preferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login farmer
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find farmer by email
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!farmer.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await farmer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    farmer.lastLogin = new Date();
    await farmer.save();

    // Generate token
    const token = generateToken(farmer._id);

    res.json({
      message: 'Login successful',
      token,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        location: farmer.location,
        farmDetails: farmer.farmDetails,
        preferences: farmer.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current farmer
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      farmer: {
        id: req.farmer._id,
        name: req.farmer.name,
        email: req.farmer.email,
        phone: req.farmer.phone,
        location: req.farmer.location,
        farmDetails: req.farmer.farmDetails,
        preferences: req.farmer.preferences,
        lastLogin: req.farmer.lastLogin,
        createdAt: req.farmer.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const token = generateToken(req.farmer._id);
    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
