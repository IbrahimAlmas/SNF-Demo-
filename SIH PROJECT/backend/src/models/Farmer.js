const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  location: {
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  farmDetails: {
    landSize: {
      type: Number,
      required: [true, 'Land size is required'],
      min: [0, 'Land size cannot be negative']
    },
    landSizeUnit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters'],
      default: 'acres'
    },
    crops: [{
      type: String,
      trim: true
    }],
    farmingExperience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      default: 0
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ar']
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      whatsapp: {
        type: Boolean,
        default: false
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
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

// Hash password before saving
farmerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt field before saving
farmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
farmerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
farmerSchema.methods.toJSON = function() {
  const farmer = this.toObject();
  delete farmer.password;
  return farmer;
};

module.exports = mongoose.model('Farmer', farmerSchema);
