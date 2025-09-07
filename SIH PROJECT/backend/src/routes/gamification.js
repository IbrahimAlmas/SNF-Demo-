const express = require('express');
const Gamification = require('../models/Gamification');
const Advisory = require('../models/Advisory');
const Practice = require('../models/Practice');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Badge definitions
const BADGES = {
  FIRST_QUERY: {
    badgeId: 'first_query',
    name: 'First Question',
    description: 'Asked your first advisory question',
    icon: 'help_outline',
    category: 'knowledge'
  },
  CURIOUS_FARMER: {
    badgeId: 'curious_farmer',
    name: 'Curious Farmer',
    description: 'Asked 10 advisory questions',
    icon: 'quiz',
    category: 'knowledge'
  },
  EXPERT_ADVISOR: {
    badgeId: 'expert_advisor',
    name: 'Expert Advisor',
    description: 'Asked 50 advisory questions',
    icon: 'school',
    category: 'knowledge'
  },
  FIRST_PRACTICE: {
    badgeId: 'first_practice',
    name: 'Sustainable Starter',
    description: 'Adopted your first sustainable practice',
    icon: 'eco',
    category: 'sustainability'
  },
  GREEN_THUMB: {
    badgeId: 'green_thumb',
    name: 'Green Thumb',
    description: 'Adopted 5 sustainable practices',
    icon: 'park',
    category: 'sustainability'
  },
  SUSTAINABILITY_CHAMPION: {
    badgeId: 'sustainability_champion',
    name: 'Sustainability Champion',
    description: 'Adopted 20 sustainable practices',
    icon: 'nature',
    category: 'sustainability'
  },
  ACTIVE_MEMBER: {
    badgeId: 'active_member',
    name: 'Active Member',
    description: 'Used the platform for 7 consecutive days',
    icon: 'schedule',
    category: 'achievement'
  },
  DEDICATED_FARMER: {
    badgeId: 'dedicated_farmer',
    name: 'Dedicated Farmer',
    description: 'Used the platform for 30 consecutive days',
    icon: 'calendar_today',
    category: 'achievement'
  }
};

// Check and award badges
const checkAndAwardBadges = async (farmerId, action, count) => {
  try {
    let gamification = await Gamification.findOne({ farmerId });
    
    if (!gamification) {
      gamification = new Gamification({ farmerId });
      await gamification.save();
    }

    const badgesToAward = [];

    switch (action) {
      case 'advisory_query':
        if (count === 1 && gamification.canEarnBadge('first_query')) {
          badgesToAward.push(BADGES.FIRST_QUERY);
        }
        if (count === 10 && gamification.canEarnBadge('curious_farmer')) {
          badgesToAward.push(BADGES.CURIOUS_FARMER);
        }
        if (count === 50 && gamification.canEarnBadge('expert_advisor')) {
          badgesToAward.push(BADGES.EXPERT_ADVISOR);
        }
        break;
      
      case 'practice_adopted':
        if (count === 1 && gamification.canEarnBadge('first_practice')) {
          badgesToAward.push(BADGES.FIRST_PRACTICE);
        }
        if (count === 5 && gamification.canEarnBadge('green_thumb')) {
          badgesToAward.push(BADGES.GREEN_THUMB);
        }
        if (count === 20 && gamification.canEarnBadge('sustainability_champion')) {
          badgesToAward.push(BADGES.SUSTAINABILITY_CHAMPION);
        }
        break;
      
      case 'daily_active':
        if (count === 7 && gamification.canEarnBadge('active_member')) {
          badgesToAward.push(BADGES.ACTIVE_MEMBER);
        }
        if (count === 30 && gamification.canEarnBadge('dedicated_farmer')) {
          badgesToAward.push(BADGES.DEDICATED_FARMER);
        }
        break;
    }

    // Award badges and add XP
    let totalXPGained = 0;
    for (const badge of badgesToAward) {
      if (gamification.addBadge(badge)) {
        totalXPGained += 50; // 50 XP per badge
      }
    }

    // Add XP for the action
    let actionXP = 0;
    switch (action) {
      case 'advisory_query':
        actionXP = 10;
        break;
      case 'practice_adopted':
        actionXP = 25;
        break;
      case 'daily_active':
        actionXP = 5;
        break;
    }

    const xpResult = gamification.addXP(actionXP + totalXPGained, action);
    
    // Update stats
    gamification.stats.advisoryQueries = count;
    gamification.lastActivity = new Date();
    
    await gamification.save();

    return {
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      xpGained: xpResult.xpAdded,
      badgesEarned: badgesToAward
    };
  } catch (error) {
    console.error('Badge checking error:', error);
    return null;
  }
};

// @route   GET /api/gamification
// @desc    Get farmer's gamification data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let gamification = await Gamification.findOne({ farmerId: req.farmer._id });
    
    if (!gamification) {
      gamification = new Gamification({ farmerId: req.farmer._id });
      await gamification.save();
    }

    // Calculate XP needed for next level
    const currentLevelXP = Math.pow(gamification.level - 1, 2) * 100;
    const nextLevelXP = Math.pow(gamification.level, 2) * 100;
    const xpNeeded = nextLevelXP - gamification.xp;
    const xpProgress = ((gamification.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    res.json({
      gamification: {
        xp: gamification.xp,
        level: gamification.level,
        badges: gamification.badges,
        achievements: gamification.achievements,
        stats: gamification.stats,
        xpNeeded,
        xpProgress: Math.round(xpProgress),
        lastActivity: gamification.lastActivity
      }
    });
  } catch (error) {
    console.error('Get gamification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/gamification/action
// @desc    Record a gamification action
// @access  Private
router.post('/action', auth, async (req, res) => {
  try {
    const { action, metadata } = req.body;

    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }

    let count = 0;
    let result = null;

    switch (action) {
      case 'advisory_query':
        count = await Advisory.countDocuments({ farmerId: req.farmer._id });
        result = await checkAndAwardBadges(req.farmer._id, 'advisory_query', count);
        break;
      
      case 'practice_adopted':
        // This would be called when a practice is adopted
        // For now, we'll simulate it
        count = 1; // This should come from the practice adoption endpoint
        result = await checkAndAwardBadges(req.farmer._id, 'practice_adopted', count);
        break;
      
      case 'daily_active':
        // This would be called daily to check for consecutive days
        count = 1; // This should be calculated based on actual usage
        result = await checkAndAwardBadges(req.farmer._id, 'daily_active', count);
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    res.json({
      message: 'Action recorded successfully',
      result: result || { leveledUp: false, newLevel: 0, xpGained: 0, badgesEarned: [] }
    });
  } catch (error) {
    console.error('Record action error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gamification/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'xp'; // xp, level, badges

    let sortCriteria = {};
    switch (sortBy) {
      case 'xp':
        sortCriteria = { xp: -1 };
        break;
      case 'level':
        sortCriteria = { level: -1, xp: -1 };
        break;
      case 'badges':
        sortCriteria = { 'badges': -1, xp: -1 };
        break;
      default:
        sortCriteria = { xp: -1 };
    }

    const leaderboard = await Gamification.find()
      .populate('farmerId', 'name location')
      .sort(sortCriteria)
      .limit(limit)
      .select('farmerId xp level badges stats');

    res.json({
      leaderboard: leaderboard.map((item, index) => ({
        rank: index + 1,
        farmer: {
          name: item.farmerId.name,
          location: item.farmerId.location
        },
        xp: item.xp,
        level: item.level,
        badgeCount: item.badges.length,
        stats: item.stats
      })),
      sortBy
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gamification/badges
// @desc    Get all available badges
// @access  Public
router.get('/badges', async (req, res) => {
  try {
    const badges = Object.values(BADGES);
    res.json({ badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
