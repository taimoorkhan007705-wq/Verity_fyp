import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const businessSchema = new mongoose.Schema({
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
    default: 'Business'
  },
  
  // User Info
  user_info: {
    businessName: {
      type: String,
      trim: true,
      default: ''
    },
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
      required: [true, 'Business name is required'],
      trim: true
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
  
  // Business Details
  business_details: {
    businessType: {
      type: String,
      default: 'General'
    },
    industry: {
      type: String,
      default: ''
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '200+', ''],
      default: ''
    },
    foundedYear: {
      type: Number
    }
  },
  
  // Contact Information
  contact_info: {
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    country: {
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
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  
  // Subscription
  subscription: {
    plan: {
      type: String,
      enum: ['Free', 'Basic', 'Premium', 'Enterprise'],
      default: 'Free'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  
  // Business Analytics
  business_analytics: {
    totalPosts: {
      type: Number,
      default: 0
    },
    totalReach: {
      type: Number,
      default: 0
    },
    totalEngagement: {
      type: Number,
      default: 0
    },
    monthlyViews: {
      type: Number,
      default: 0
    },
    monthlyClicks: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
businessSchema.pre('save', async function(next) {
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
businessSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Business = mongoose.model('Business', businessSchema);

export default Business;
