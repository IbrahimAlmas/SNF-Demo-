const express = require('express');
const { body, validationResult } = require('express-validator');
const Practice = require('../models/Practice');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/practices
// @desc    Get all sustainable practices with filtering and search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    if (req.query.cost) {
      filter.cost = req.query.cost;
    }
    
    if (req.query.crop) {
      filter.applicableCrops = { $in: [new RegExp(req.query.crop, 'i')] };
    }
    
    if (req.query.country) {
      filter['applicableRegions.country'] = new RegExp(req.query.country, 'i');
    }

    // Build search query
    let searchQuery = {};
    if (req.query.search) {
      searchQuery = {
        $text: { $search: req.query.search }
      };
    }

    // Combine filters
    const finalFilter = { ...filter, ...searchQuery };

    // Get practices
    const practices = await Practice.find(finalFilter)
      .sort(req.query.sortBy === 'rating' ? { 'adoptionStats.averageRating': -1 } : 
            req.query.sortBy === 'adoptions' ? { 'adoptionStats.totalAdoptions': -1 } :
            { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-detailedDescription -steps -videos -resources');

    const total = await Practice.countDocuments(finalFilter);

    res.json({
      practices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      filters: {
        categories: await Practice.distinct('category', { isActive: true }),
        difficulties: await Practice.distinct('difficulty', { isActive: true }),
        costs: await Practice.distinct('cost', { isActive: true })
      }
    });
  } catch (error) {
    console.error('Get practices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/practices/featured
// @desc    Get featured practices
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const practices = await Practice.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ 'adoptionStats.averageRating': -1 })
    .limit(6)
    .select('-detailedDescription -steps -videos -resources');

    res.json({ practices });
  } catch (error) {
    console.error('Get featured practices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/practices/:id
// @desc    Get specific practice by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const practice = await Practice.findById(req.params.id);
    
    if (!practice || !practice.isActive) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    res.json({ practice });
  } catch (error) {
    console.error('Get practice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/practices/:id/adopt
// @desc    Adopt a sustainable practice
// @access  Private
router.post('/:id/adopt', auth, async (req, res) => {
  try {
    const practice = await Practice.findById(req.params.id);
    
    if (!practice || !practice.isActive) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    // In a real implementation, you would create an adoption record
    // For demo purposes, we'll just increment the adoption count
    practice.adoptionStats.totalAdoptions += 1;
    await practice.save();

    // Trigger gamification action
    const gamification = require('./gamification');
    await gamification.checkAndAwardBadges(req.farmer._id, 'practice_adopted', 1);

    res.json({ 
      message: 'Practice adopted successfully',
      practice: {
        id: practice._id,
        title: practice.title,
        adoptionStats: practice.adoptionStats
      }
    });
  } catch (error) {
    console.error('Adopt practice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/practices/:id/rate
// @desc    Rate a sustainable practice
// @access  Private
router.post('/:id/rate', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, review } = req.body;
    const practice = await Practice.findById(req.params.id);
    
    if (!practice || !practice.isActive) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    // Update rating statistics
    const currentTotal = practice.adoptionStats.averageRating * practice.adoptionStats.totalRatings;
    practice.adoptionStats.totalRatings += 1;
    practice.adoptionStats.averageRating = (currentTotal + rating) / practice.adoptionStats.totalRatings;
    
    await practice.save();

    res.json({ 
      message: 'Rating submitted successfully',
      rating: {
        rating,
        review,
        averageRating: practice.adoptionStats.averageRating,
        totalRatings: practice.adoptionStats.totalRatings
      }
    });
  } catch (error) {
    console.error('Rate practice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/practices/categories
// @desc    Get all practice categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Practice.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        averageRating: { $avg: '$adoptionStats.averageRating' }
      }},
      { $sort: { count: -1 } }
    ]);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/practices/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Practice.aggregate([
      { $match: { 
        isActive: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
          { applicableCrops: { $regex: query, $options: 'i' } }
        ]
      }},
      { $project: { 
        title: 1, 
        category: 1, 
        tags: 1,
        applicableCrops: 1
      }},
      { $limit: 10 }
    ]);

    res.json({ suggestions });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/practices
// @desc    Create a new sustainable practice
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required and must be less than 500 characters'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  body('cost').isIn(['Low', 'Medium', 'High']).withMessage('Cost must be Low, Medium, or High'),
  body('environmentalImpact').isInt({ min: 0, max: 100 }).withMessage('Environmental impact must be between 0 and 100'),
  body('economicBenefit').isInt({ min: 0, max: 100 }).withMessage('Economic benefit must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const practiceData = {
      ...req.body,
      farmerId: req.farmer._id,
      isActive: true,
      isFeatured: false,
      adoptionStats: {
        totalAdoptions: 0,
        totalRatings: 0,
        averageRating: 0
      }
    };

    const practice = new Practice(practiceData);
    await practice.save();

    res.status(201).json({ 
      message: 'Practice created successfully',
      practice 
    });
  } catch (error) {
    console.error('Create practice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/practices/:id
// @desc    Update a sustainable practice
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be less than 500 characters'),
  body('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  body('cost').optional().isIn(['Low', 'Medium', 'High']).withMessage('Cost must be Low, Medium, or High'),
  body('environmentalImpact').optional().isInt({ min: 0, max: 100 }).withMessage('Environmental impact must be between 0 and 100'),
  body('economicBenefit').optional().isInt({ min: 0, max: 100 }).withMessage('Economic benefit must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const practice = await Practice.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.farmer._id },
      req.body,
      { new: true }
    );

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    res.json({ 
      message: 'Practice updated successfully',
      practice 
    });
  } catch (error) {
    console.error('Update practice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/practices/:id/implement
// @desc    Implement or un-implement a practice
// @access  Private
router.post('/:id/implement', [
  auth,
  body('isImplemented').isBoolean().withMessage('isImplemented must be a boolean'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { isImplemented, progress, notes } = req.body;
    
    const practice = await Practice.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.farmer._id },
      {
        isImplemented,
        implementationDate: isImplemented ? (req.body.implementationDate || new Date()) : null,
        progress: progress || 0,
        notes: notes || ''
      },
      { new: true }
    );

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    res.json({ 
      message: 'Practice implementation updated successfully',
      practice 
    });
  } catch (error) {
    console.error('Update practice implementation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/practices/:id
// @desc    Delete a sustainable practice
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const practice = await Practice.findOneAndDelete({ 
      _id: req.params.id, 
      farmerId: req.farmer._id 
    });

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    res.json({ message: 'Practice deleted successfully' });
  } catch (error) {
    console.error('Delete practice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/practices/my-practices
// @desc    Get farmer's own practices
// @access  Private
router.get('/my-practices', auth, async (req, res) => {
  try {
    const practices = await Practice.find({ farmerId: req.farmer._id })
      .sort({ createdAt: -1 });

    res.json({ practices });
  } catch (error) {
    console.error('Get my practices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
