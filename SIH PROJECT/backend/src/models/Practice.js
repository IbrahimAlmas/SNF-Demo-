const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Practice title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Practice description is required'],
    trim: true
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'soil_health',
      'water_management',
      'crop_rotation',
      'pest_management',
      'organic_farming',
      'energy_efficiency',
      'waste_management',
      'biodiversity',
      'climate_adaptation'
    ]
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedTime: {
    type: String,
    required: [true, 'Estimated time is required']
  },
  cost: {
    type: String,
    required: [true, 'Cost information is required'],
    enum: ['low', 'medium', 'high']
  },
  benefits: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  steps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  }],
  images: [{
    type: String
  }],
  videos: [{
    title: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    duration: {
      type: String
    }
  }],
  resources: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['article', 'video', 'document', 'website'],
      default: 'article'
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  applicableCrops: [{
    type: String,
    trim: true
  }],
  applicableRegions: [{
    country: String,
    state: String,
    climate: String
  }],
  environmentalImpact: {
    carbonReduction: {
      type: Number,
      min: 0,
      max: 100
    },
    waterConservation: {
      type: Number,
      min: 0,
      max: 100
    },
    soilHealth: {
      type: Number,
      min: 0,
      max: 100
    },
    biodiversity: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  adoptionStats: {
    totalAdoptions: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer'
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

// Update updatedAt field
practiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Text search index
practiceSchema.index({
  title: 'text',
  description: 'text',
  detailedDescription: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Practice', practiceSchema);
