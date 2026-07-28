import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
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
    isBlocked: {
      type: Boolean,
      default: false
    },
    blockedAt: {
      type: Date,
      default: null
    },
    blockedReason: {
      type: String,
      default: ''
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
userSchema.add({
  resetToken: {
    type: String,
    default: undefined
  },
  resetTokenExpiry: {
    type: Date,
    default: undefined
  },
  // OTP & Password Reset Fields
  passwordReset: {
    otp: {
      type: String,
      default: null
    },
    otpCreatedAt: {
      type: Date,
      default: null
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    isOTPVerified: {
      type: Boolean,
      default: false
    }
  },
  // 2FA - Authenticator App
  twoFactor: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    secret: {
      type: String,
      default: null
    },
    backupCodes: [{
      code: String,
      used: { type: Boolean, default: false }
    }],
    enabledAt: {
      type: Date,
      default: null
    }
  },
  // Email Configuration - for sending OTP from user's own email
  emailConfig: {
    email: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null
    },
    configuredAt: {
      type: Date,
      default: null
    }
  }
});
userSchema.pre('save', async function(next) {
  if (this.isModified('user_info.fullName') && this.user_info.fullName) {
    const nameParts = this.user_info.fullName.trim().split(/\s+/)
    const uniqueParts = [...new Set(nameParts.map(part => part.toLowerCase()))]
    this.user_info.fullName = uniqueParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ')
  }
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.password; return ret }
});

// Add indexes for faster queries
userSchema.index({ email: 1 })
userSchema.index({ isBlocked: 1 })
userSchema.index({ createdAt: -1 })

const User = mongoose.model('User', userSchema);
export default User;

