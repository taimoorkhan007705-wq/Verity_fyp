import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const reviewerSchema = new mongoose.Schema({
  // Core Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    default: 'Reviewer'
  },
  
  // User Info
  user_info: {
    firstName: {
      type: String,
      trim: true,
      default: ''
    },
    lastName: {
      type: String,
      trim: true,
      default: ''
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    location: {
      type: String,
      default: ''
    }
  },
  
  // Profile Info
  profile_info: {
    avatar: {
      type: String,
      default: null
    },
    coverPhoto: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 150,
      default: ''
    },
    website: {
      type: String,
      default: ''
    }
  },
  
  // Social Stats
  social_stats: {
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    },
    postsCount: {
      type: Number,
      default: 0
    }
  },
  
  // Trust & Security
  trust_security: {
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  
  // Reviewer Performance
  reviewer_stats: {
    reviewsCompleted: {
      type: Number,
      default: 0
    },
    reviewsPending: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageReviewTime: {
      type: Number,
      default: 0
    },
    approvedCount: {
      type: Number,
      default: 0
    },
    rejectedCount: {
      type: Number,
      default: 0
    },
    flaggedCount: {
      type: Number,
      default: 0
    }
  },
  
  // Reviewer Specialization
  reviewer_profile: {
    specialization: {
      type: [String],
      default: ['General']
    },
    expertiseLevel: {
      type: String,
      enum: ['Junior', 'Senior', 'Expert'],
      default: 'Junior'
    }
  },
  
  // Activity Tracking
  activity_tracking: {
    lastReviewAt: {
      type: Date
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
reviewerSchema.pre('save', async function(next) {
  // Clean duplicate names
  if (this.isModified('user_info.fullName') && this.user_info.fullName) {
    const nameParts = this.user_info.fullName.trim().split(/\s+/)
    const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))]
    this.user_info.fullName = uniqueParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ')
  }

  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
reviewerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Reviewer = mongoose.model('Reviewer', reviewerSchema);

export default Reviewer;
