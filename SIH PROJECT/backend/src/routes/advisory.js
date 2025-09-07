const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Advisory = require('../models/Advisory');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/advisory';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Mock AI service for text advisory
const processTextAdvisory = async (query, farmerLocation, cropInfo) => {
  // In a real implementation, this would call Hugging Face Transformers API
  // For demo purposes, we'll return mock responses based on keywords
  
  const responses = {
    'disease': {
      text: 'Based on your description, this appears to be a fungal disease. I recommend applying a copper-based fungicide and ensuring proper air circulation around your plants.',
      confidence: 0.85,
      recommendations: [
        'Apply copper-based fungicide every 7-10 days',
        'Improve air circulation by pruning dense foliage',
        'Water at the base of plants to avoid wetting leaves',
        'Remove and dispose of infected plant material'
      ],
      category: 'disease_detection'
    },
    'pest': {
      text: 'This looks like aphid damage. These small insects feed on plant sap and can spread diseases. Here are some effective control methods.',
      confidence: 0.90,
      recommendations: [
        'Spray with neem oil solution',
        'Introduce beneficial insects like ladybugs',
        'Use insecticidal soap',
        'Remove heavily infested plant parts'
      ],
      category: 'pest_identification'
    },
    'nutrient': {
      text: 'Your plants are showing signs of nutrient deficiency. Based on the symptoms, this appears to be a nitrogen deficiency.',
      confidence: 0.80,
      recommendations: [
        'Apply nitrogen-rich fertilizer',
        'Test soil pH and adjust if necessary',
        'Add organic matter like compost',
        'Consider crop rotation to improve soil health'
      ],
      category: 'nutrient_deficiency'
    },
    'weather': {
      text: 'Based on your location and current weather patterns, here are some recommendations for your farming activities.',
      confidence: 0.75,
      recommendations: [
        'Monitor soil moisture levels regularly',
        'Consider mulching to retain soil moisture',
        'Adjust irrigation schedule based on rainfall',
        'Protect young plants from extreme weather'
      ],
      category: 'weather_advice'
    }
  };

  // Simple keyword matching for demo
  const queryLower = query.toLowerCase();
  let response = responses['weather']; // default

  if (queryLower.includes('disease') || queryLower.includes('fungus') || queryLower.includes('mold')) {
    response = responses['disease'];
  } else if (queryLower.includes('pest') || queryLower.includes('insect') || queryLower.includes('bug')) {
    response = responses['pest'];
  } else if (queryLower.includes('nutrient') || queryLower.includes('deficiency') || queryLower.includes('yellow')) {
    response = responses['nutrient'];
  }

  return response;
};

// Mock AI service for image analysis
const processImageAdvisory = async (imagePath, query) => {
  // In a real implementation, this would use TensorFlow.js for image analysis
  // For demo purposes, we'll return mock responses
  
  const mockResponses = [
    {
      text: 'I can see signs of early blight on your tomato plants. The dark spots with concentric rings are characteristic of this fungal disease.',
      confidence: 0.88,
      recommendations: [
        'Remove affected leaves immediately',
        'Apply copper fungicide',
        'Improve air circulation',
        'Avoid overhead watering'
      ],
      category: 'disease_detection'
    },
    {
      text: 'Your corn plants appear healthy with good growth. The leaves show normal green coloration without signs of nutrient deficiency.',
      confidence: 0.92,
      recommendations: [
        'Continue current care routine',
        'Monitor for pest activity',
        'Ensure adequate spacing between plants',
        'Consider side-dressing with nitrogen fertilizer'
      ],
      category: 'general_question'
    }
  ];

  // Return random response for demo
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

// @route   POST /api/advisory/text
// @desc    Submit text-based advisory query
// @access  Private
router.post('/text', [
  auth,
  body('query').trim().isLength({ min: 10, max: 1000 }).withMessage('Query must be between 10 and 1000 characters'),
  body('cropInfo.cropType').optional().trim(),
  body('cropInfo.growthStage').optional().trim(),
  body('cropInfo.plantingDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { query, cropInfo } = req.body;
    const startTime = Date.now();

    // Create advisory record
    const advisory = new Advisory({
      farmerId: req.farmer._id,
      type: 'text',
      query,
      cropInfo,
      location: req.farmer.location,
      status: 'processing'
    });

    await advisory.save();

    try {
      // Process the query with AI
      const aiResponse = await processTextAdvisory(query, req.farmer.location, cropInfo);
      
      // Update advisory with response
      advisory.response = aiResponse;
      advisory.status = 'completed';
      advisory.processingTime = Date.now() - startTime;
      
      await advisory.save();

      res.json({
        message: 'Advisory query processed successfully',
        advisory: {
          id: advisory._id,
          query: advisory.query,
          response: advisory.response,
          status: advisory.status,
          processingTime: advisory.processingTime,
          createdAt: advisory.createdAt
        }
      });
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      advisory.status = 'failed';
      advisory.response = {
        text: 'Sorry, I encountered an error processing your query. Please try again later.',
        confidence: 0,
        recommendations: [],
        aiModel: 'error'
      };
      await advisory.save();

      res.status(500).json({
        message: 'Error processing advisory query',
        advisory: {
          id: advisory._id,
          status: advisory.status
        }
      });
    }
  } catch (error) {
    console.error('Advisory text error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/advisory/image
// @desc    Submit image-based advisory query
// @access  Private
router.post('/image', [
  auth,
  upload.single('image'),
  body('query').optional().trim().isLength({ max: 500 }).withMessage('Query cannot exceed 500 characters')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { query = '' } = req.body;
    const startTime = Date.now();

    // Create advisory record
    const advisory = new Advisory({
      farmerId: req.farmer._id,
      type: 'image',
      query,
      images: [{
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype
      }],
      location: req.farmer.location,
      status: 'processing'
    });

    await advisory.save();

    try {
      // Process the image with AI
      const aiResponse = await processImageAdvisory(req.file.path, query);
      
      // Update advisory with response
      advisory.response = aiResponse;
      advisory.status = 'completed';
      advisory.processingTime = Date.now() - startTime;
      
      await advisory.save();

      res.json({
        message: 'Image advisory query processed successfully',
        advisory: {
          id: advisory._id,
          query: advisory.query,
          response: advisory.response,
          status: advisory.status,
          processingTime: advisory.processingTime,
          imageUrl: `/uploads/advisory/${req.file.filename}`,
          createdAt: advisory.createdAt
        }
      });
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      advisory.status = 'failed';
      advisory.response = {
        text: 'Sorry, I encountered an error analyzing your image. Please try again with a clearer image.',
        confidence: 0,
        recommendations: [],
        aiModel: 'error'
      };
      await advisory.save();

      res.status(500).json({
        message: 'Error processing image advisory query',
        advisory: {
          id: advisory._id,
          status: advisory.status
        }
      });
    }
  } catch (error) {
    console.error('Advisory image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/advisory/history
// @desc    Get farmer's advisory history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const advisories = await Advisory.find({ farmerId: req.farmer._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-images.path'); // Exclude file paths for security

    const total = await Advisory.countDocuments({ farmerId: req.farmer._id });

    res.json({
      advisories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get advisory history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/advisory/:id
// @desc    Get specific advisory by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const advisory = await Advisory.findOne({
      _id: req.params.id,
      farmerId: req.farmer._id
    }).select('-images.path');

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    res.json({ advisory });
  } catch (error) {
    console.error('Get advisory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/advisory/:id/feedback
// @desc    Submit feedback for advisory
// @access  Private
router.post('/:id/feedback', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('helpful').isBoolean().withMessage('Helpful must be a boolean'),
  body('comments').optional().trim().isLength({ max: 500 }).withMessage('Comments cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, helpful, comments } = req.body;

    const advisory = await Advisory.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.farmer._id },
      {
        $set: {
          feedback: {
            rating,
            helpful,
            comments,
            submittedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
