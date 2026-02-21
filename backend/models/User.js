import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Core Authentication (Always visible)
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
    enum: ['User', 'Reviewer', 'Business', 'Admin'],
    default: 'User'
  },
  
  // User Info (Collapsible in DB viewer)
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
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: ''
    },
    location: {
      type: String,
      default: ''
    }
  },
  
  // Profile Info (Collapsible in DB viewer)
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
  
  // Social Stats (Collapsible in DB viewer)
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
  
  // Trust & Security (Collapsible in DB viewer)
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
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    reportsReceived: {
      type: Number,
      default: 0
    },
    reportsSubmitted: {
      type: Number,
      default: 0
    }
  },
  
  // Activity Tracking (Collapsible in DB viewer)
  activity_tracking: {
    lastActive: {
      type: Date,
      default: Date.now
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loginCount: {
      type: Number,
      default: 0
    }
  },
  
  // Preferences (Collapsible in DB viewer)
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      follows: { type: Boolean, default: true }
    }
  },
  
  // OAuth (Collapsible in DB viewer)
  oauth: {
    googleId: {
      type: String
    },
    facebookId: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
