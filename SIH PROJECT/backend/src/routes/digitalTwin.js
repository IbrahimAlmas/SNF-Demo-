const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock digital twin simulation logic
const runDigitalTwinSimulation = async (simulationData) => {
  // In a real implementation, this would use advanced agricultural models
  // For demo purposes, we'll return mock simulation results
  
  const {
    landSize,
    landSizeUnit,
    cropType,
    soilType,
    climateZone,
    waterAvailability,
    budget,
    sustainabilityGoals
  } = simulationData;

  // Convert land size to hectares for calculations
  let landSizeHectares = landSize;
  if (landSizeUnit === 'acres') {
    landSizeHectares = landSize * 0.404686;
  } else if (landSizeUnit === 'square_meters') {
    landSizeHectares = landSize / 10000;
  }

  // Mock simulation results based on inputs
  const baseYield = {
    'wheat': 3.5, // tons per hectare
    'rice': 4.2,
    'corn': 8.5,
    'soybean': 2.8,
    'tomato': 45.0,
    'potato': 20.0
  };

  const baseYieldPerHectare = baseYield[cropType.toLowerCase()] || 3.0;
  const estimatedYield = baseYieldPerHectare * landSizeHectares;

  // Calculate sustainability metrics
  const sustainabilityScore = Math.min(95, Math.max(60, 
    70 + (sustainabilityGoals.length * 5) + 
    (waterAvailability === 'high' ? 10 : waterAvailability === 'medium' ? 5 : 0) +
    (soilType === 'loamy' ? 10 : soilType === 'clay' ? 5 : 0)
  ));

  const carbonFootprint = Math.max(0.5, 2.0 - (sustainabilityGoals.length * 0.2));
  const waterUsage = Math.max(2000, 5000 - (waterAvailability === 'high' ? 1000 : 0));
  const soilHealth = Math.min(100, 60 + (sustainabilityGoals.includes('soil_health') ? 20 : 0));

  // Generate recommendations
  const recommendations = [];
  
  if (sustainabilityScore < 80) {
    recommendations.push({
      category: 'sustainability',
      priority: 'high',
      title: 'Improve Sustainability Practices',
      description: 'Implement crop rotation and organic farming methods to improve sustainability score',
      impact: 'Increase sustainability score by 15-20 points',
      cost: 'medium',
      timeline: '3-6 months'
    });
  }

  if (waterUsage > 4000) {
    recommendations.push({
      category: 'water_management',
      priority: 'high',
      title: 'Optimize Water Usage',
      description: 'Implement drip irrigation and water conservation techniques',
      impact: 'Reduce water usage by 30-40%',
      cost: 'high',
      timeline: '2-4 months'
    });
  }

  if (soilHealth < 70) {
    recommendations.push({
      category: 'soil_health',
      priority: 'medium',
      title: 'Improve Soil Health',
      description: 'Add organic matter, implement cover cropping, and reduce tillage',
      impact: 'Improve soil health by 20-25 points',
      cost: 'low',
      timeline: '6-12 months'
    });
  }

  // Calculate financial projections
  const pricePerTon = {
    'wheat': 200,
    'rice': 300,
    'corn': 180,
    'soybean': 400,
    'tomato': 500,
    'potato': 150
  };

  const cropPrice = pricePerTon[cropType.toLowerCase()] || 250;
  const estimatedRevenue = estimatedYield * cropPrice;
  const estimatedCosts = landSizeHectares * 800; // $800 per hectare
  const estimatedProfit = estimatedRevenue - estimatedCosts;

  return {
    simulationId: `sim_${Date.now()}`,
    timestamp: new Date().toISOString(),
    inputs: simulationData,
    results: {
      estimatedYield: Math.round(estimatedYield * 100) / 100,
      estimatedRevenue: Math.round(estimatedRevenue),
      estimatedCosts: Math.round(estimatedCosts),
      estimatedProfit: Math.round(estimatedProfit),
      sustainabilityScore: Math.round(sustainabilityScore),
      carbonFootprint: Math.round(carbonFootprint * 100) / 100,
      waterUsage: Math.round(waterUsage),
      soilHealth: Math.round(soilHealth)
    },
    recommendations,
    riskAssessment: {
      weatherRisk: waterAvailability === 'low' ? 'high' : 'medium',
      marketRisk: 'medium',
      pestRisk: 'low',
      overallRisk: 'medium'
    },
    timeline: {
      plantingSeason: 'March-April',
      harvestSeason: 'August-September',
      totalDuration: '6 months'
    }
  };
};

// @route   POST /api/digital-twin/simulate
// @desc    Run digital twin simulation
// @access  Private
router.post('/simulate', [
  auth,
  body('landSize').isNumeric().withMessage('Land size must be a number'),
  body('landSizeUnit').isIn(['acres', 'hectares', 'square_meters']).withMessage('Invalid land size unit'),
  body('cropType').notEmpty().withMessage('Crop type is required'),
  body('soilType').isIn(['sandy', 'clay', 'loamy', 'silty']).withMessage('Invalid soil type'),
  body('climateZone').isIn(['tropical', 'subtropical', 'temperate', 'continental', 'arid']).withMessage('Invalid climate zone'),
  body('waterAvailability').isIn(['low', 'medium', 'high']).withMessage('Invalid water availability'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('sustainabilityGoals').isArray().withMessage('Sustainability goals must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const simulationData = {
      ...req.body,
      farmerId: req.farmer._id,
      farmerLocation: req.farmer.location
    };

    // Run simulation
    const simulationResult = await runDigitalTwinSimulation(simulationData);

    // In a real implementation, you would save the simulation result to database
    // For demo purposes, we'll just return the result

    res.json({
      message: 'Simulation completed successfully',
      simulation: simulationResult
    });
  } catch (error) {
    console.error('Digital twin simulation error:', error);
    res.status(500).json({ message: 'Server error during simulation' });
  }
});

// @route   GET /api/digital-twin/templates
// @desc    Get simulation templates for different scenarios
// @access  Public
router.get('/templates', async (req, res) => {
  try {
    const templates = [
      {
        id: 'beginner_farmer',
        name: 'Beginner Farmer',
        description: 'Template for new farmers with basic setup',
        landSize: 1,
        landSizeUnit: 'hectares',
        cropType: 'wheat',
        soilType: 'loamy',
        climateZone: 'temperate',
        waterAvailability: 'medium',
        budget: 5000,
        sustainabilityGoals: ['soil_health', 'water_management']
      },
      {
        id: 'sustainable_farming',
        name: 'Sustainable Farming',
        description: 'Template focused on sustainable practices',
        landSize: 5,
        landSizeUnit: 'hectares',
        cropType: 'corn',
        soilType: 'loamy',
        climateZone: 'temperate',
        waterAvailability: 'high',
        budget: 25000,
        sustainabilityGoals: ['soil_health', 'water_management', 'biodiversity', 'organic_farming']
      },
      {
        id: 'commercial_farming',
        name: 'Commercial Farming',
        description: 'Template for large-scale commercial operations',
        landSize: 50,
        landSizeUnit: 'hectares',
        cropType: 'soybean',
        soilType: 'clay',
        climateZone: 'continental',
        waterAvailability: 'high',
        budget: 200000,
        sustainabilityGoals: ['efficiency', 'profitability', 'soil_health']
      },
      {
        id: 'organic_farming',
        name: 'Organic Farming',
        description: 'Template for organic farming practices',
        landSize: 3,
        landSizeUnit: 'hectares',
        cropType: 'tomato',
        soilType: 'loamy',
        climateZone: 'subtropical',
        waterAvailability: 'medium',
        budget: 15000,
        sustainabilityGoals: ['organic_farming', 'biodiversity', 'soil_health', 'pest_management']
      }
    ];

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/digital-twin/crops
// @desc    Get supported crops and their characteristics
// @access  Public
router.get('/crops', async (req, res) => {
  try {
    const crops = [
      {
        name: 'Wheat',
        scientificName: 'Triticum aestivum',
        growingSeason: 'Winter/Spring',
        waterRequirement: 'Medium',
        soilType: 'Loamy, Clay',
        climateZone: 'Temperate',
        averageYield: '3.5 tons/hectare',
        marketPrice: '$200/ton',
        sustainabilityScore: 75
      },
      {
        name: 'Rice',
        scientificName: 'Oryza sativa',
        growingSeason: 'Summer',
        waterRequirement: 'High',
        soilType: 'Clay, Loamy',
        climateZone: 'Tropical, Subtropical',
        averageYield: '4.2 tons/hectare',
        marketPrice: '$300/ton',
        sustainabilityScore: 70
      },
      {
        name: 'Corn',
        scientificName: 'Zea mays',
        growingSeason: 'Summer',
        waterRequirement: 'Medium-High',
        soilType: 'Loamy, Sandy',
        climateZone: 'Temperate, Subtropical',
        averageYield: '8.5 tons/hectare',
        marketPrice: '$180/ton',
        sustainabilityScore: 80
      },
      {
        name: 'Soybean',
        scientificName: 'Glycine max',
        growingSeason: 'Summer',
        waterRequirement: 'Medium',
        soilType: 'Loamy, Clay',
        climateZone: 'Temperate, Continental',
        averageYield: '2.8 tons/hectare',
        marketPrice: '$400/ton',
        sustainabilityScore: 85
      },
      {
        name: 'Tomato',
        scientificName: 'Solanum lycopersicum',
        growingSeason: 'Spring/Summer',
        waterRequirement: 'Medium',
        soilType: 'Loamy, Sandy',
        climateZone: 'Temperate, Subtropical',
        averageYield: '45 tons/hectare',
        marketPrice: '$500/ton',
        sustainabilityScore: 65
      },
      {
        name: 'Potato',
        scientificName: 'Solanum tuberosum',
        growingSeason: 'Spring/Summer',
        waterRequirement: 'Medium',
        soilType: 'Sandy, Loamy',
        climateZone: 'Temperate, Continental',
        averageYield: '20 tons/hectare',
        marketPrice: '$150/ton',
        sustainabilityScore: 70
      }
    ];

    res.json({ crops });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
