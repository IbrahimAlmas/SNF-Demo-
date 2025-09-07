const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    unique: true
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  badges: [{
    badgeId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['sustainability', 'knowledge', 'community', 'achievement'],
      required: true
    }
  }],
  achievements: [{
    achievementId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    xpReward: {
      type: Number,
      default: 0
    }
  }],
  stats: {
    advisoryQueries: {
      type: Number,
      default: 0
    },
    practicesAdopted: {
      type: Number,
      default: 0
    },
    daysActive: {
      type: Number,
      default: 0
    },
    communityContributions: {
      type: Number,
      default: 0
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate level based on XP
gamificationSchema.methods.calculateLevel = function() {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(this.xp / 100)) + 1;
};

// Add XP and update level
gamificationSchema.methods.addXP = function(amount, reason = '') {
  this.xp += amount;
  const newLevel = this.calculateLevel();
  const leveledUp = newLevel > this.level;
  this.level = newLevel;
  this.updatedAt = Date.now();
  return { leveledUp, newLevel, xpAdded: amount };
};

// Check if badge can be earned
gamificationSchema.methods.canEarnBadge = function(badgeId) {
  return !this.badges.some(badge => badge.badgeId === badgeId);
};

// Add badge
gamificationSchema.methods.addBadge = function(badge) {
  if (this.canEarnBadge(badge.badgeId)) {
    this.badges.push({
      ...badge,
      earnedAt: new Date()
    });
    return true;
  }
  return false;
};

// Update updatedAt field
gamificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Gamification', gamificationSchema);
