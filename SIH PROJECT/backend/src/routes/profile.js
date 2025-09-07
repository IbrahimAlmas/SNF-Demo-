const express = require('express');
const { body, validationResult } = require('express-validator');
const Farmer = require('../models/Farmer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get farmer profile
// @access  Private
router.get('/', auth, async (req, res) => {
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
        createdAt: req.farmer.createdAt,
        updatedAt: req.farmer.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile
// @desc    Update farmer profile
// @access  Private
router.put('/', [
  auth,
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('location.country').optional().notEmpty().withMessage('Country cannot be empty'),
  body('location.state').optional().notEmpty().withMessage('State cannot be empty'),
  body('location.city').optional().notEmpty().withMessage('City cannot be empty'),
  body('farmDetails.landSize').optional().isNumeric().withMessage('Land size must be a number'),
  body('farmDetails.landSizeUnit').optional().isIn(['acres', 'hectares', 'square_meters']).withMessage('Invalid land size unit'),
  body('preferences.language').optional().isIn(['en', 'hi', 'es', 'fr', 'de', 'zh', 'ar']).withMessage('Invalid language code')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updates = req.body;
    const allowedUpdates = [
      'name', 'phone', 'location', 'farmDetails', 'preferences'
    ];

    // Filter only allowed updates
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Update farmer
    const farmer = await Farmer.findByIdAndUpdate(
      req.farmer._id,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        location: farmer.location,
        farmDetails: farmer.farmDetails,
        preferences: farmer.preferences,
        updatedAt: farmer.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/password
// @desc    Update farmer password
// @access  Private
router.put('/password', [
  auth,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get farmer with password
    const farmer = await Farmer.findById(req.farmer._id).select('+password');
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Check current password
    const isMatch = await farmer.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    farmer.password = newPassword;
    await farmer.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/profile
// @desc    Deactivate farmer account
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Farmer.findByIdAndUpdate(
      req.farmer._id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
