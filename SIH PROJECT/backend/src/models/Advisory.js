const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'general']
  },
  query: {
    type: String,
    required: [true, 'Query is required'],
    trim: true
  },
  images: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    }
  }],
  response: {
    text: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    recommendations: [{
      type: String,
      trim: true
    }],
    relatedPractices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Practice'
    }],
    aiModel: {
      type: String,
      default: 'huggingface-transformers'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: [
      'disease_detection',
      'pest_identification',
      'nutrient_deficiency',
      'soil_analysis',
      'crop_management',
      'weather_advice',
      'general_question'
    ]
  },
  location: {
    country: String,
    state: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  cropInfo: {
    cropType: String,
    growthStage: String,
    plantingDate: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: {
      type: Boolean
    },
    comments: {
      type: String,
      trim: true
    },
    submittedAt: {
      type: Date
    }
  },
  processingTime: {
    type: Number, // in milliseconds
    default: 0
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
advisorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Text search index
advisorySchema.index({
  query: 'text',
  'response.text': 'text'
});

// Compound indexes for efficient queries
advisorySchema.index({ farmerId: 1, createdAt: -1 });
advisorySchema.index({ status: 1, createdAt: -1 });
advisorySchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Advisory', advisorySchema);
