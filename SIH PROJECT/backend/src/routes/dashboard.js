const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Farmer = require('../models/Farmer');
const Advisory = require('../models/Advisory');
const Practice = require('../models/Practice');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Get farmer's data
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Count total farmers (for demo purposes, you might want to limit this)
    const totalFarmers = await Farmer.countDocuments();

    // Count farmer's active practices
    const activePractices = await Practice.countDocuments({
      farmerId: farmerId,
      isImplemented: true
    });

    // Count farmer's advisory queries
    const advisoryQueries = await Advisory.countDocuments({
      farmerId: farmerId
    });

    // Calculate sustainability score based on implemented practices
    const implementedPractices = await Practice.find({
      farmerId: farmerId,
      isImplemented: true
    });

    let sustainabilityScore = 0;
    if (implementedPractices.length > 0) {
      const totalImpact = implementedPractices.reduce((sum, practice) => 
        sum + (practice.environmentalImpact || 0), 0
      );
      sustainabilityScore = Math.round(totalImpact / implementedPractices.length);
    }

    res.json({
      totalFarmers,
      activePractices,
      advisoryQueries,
      sustainabilityScore
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activities
router.get('/activities', auth, async (req, res) => {
  try {
    const farmerId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent advisory queries
    const recentAdvisories = await Advisory.find({ farmerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('query response createdAt');

    // Get recent practice implementations
    const recentPractices = await Practice.find({ 
      farmerId, 
      isImplemented: true 
    })
      .sort({ implementationDate: -1 })
      .limit(limit)
      .select('title implementationDate');

    // Combine and format activities
    const activities = [
      ...recentAdvisories.map(advisory => ({
        id: advisory._id,
        type: 'advisory',
        message: `AI recommendation: ${advisory.query.substring(0, 50)}...`,
        time: getTimeAgo(advisory.createdAt),
        icon: 'Science',
        color: '#4caf50'
      })),
      ...recentPractices.map(practice => ({
        id: practice._id,
        type: 'practice',
        message: `Implemented: ${practice.title}`,
        time: getTimeAgo(practice.implementationDate),
        icon: 'Eco',
        color: '#2e7d32'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, limit);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weather data (mock implementation)
router.get('/weather', auth, async (req, res) => {
  try {
    // In a real application, you would integrate with a weather API
    // For now, we'll return mock data
    const weatherData = {
      temperature: Math.round(Math.random() * 20 + 15), // 15-35°C
      humidity: Math.round(Math.random() * 30 + 40), // 40-70%
      rainfall: Math.round(Math.random() * 20), // 0-20mm
      windSpeed: Math.round(Math.random() * 15 + 5), // 5-20 km/h
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      location: 'Farm Location'
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

module.exports = router;
