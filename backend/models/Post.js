import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  // Author Information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'authorModel',
    required: true
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['User', 'Reviewer', 'Business']
  },
  
  // Content
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video']
    },
    url: String,
    thumbnail: String,
    width: Number,
    height: Number,
    size: Number,
    duration: Number
  }],
  
  // Categorization
  hashtags: [String],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'mentions.userModel'
  }],
  location: String,
  
  // Visibility & Privacy
  visibility: {
    type: String,
    enum: ['public', 'private', 'connections'],
    default: 'public'
  },
  
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviewer'
  },
  reviewedAt: Date,
  reviewNotes: String,
  
  // Engagement
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'likes.userModel'
    },
    userModel: {
      type: String,
      enum: ['User', 'Reviewer', 'Business']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'comments.userModel'
    },
    userModel: {
      type: String,
      enum: ['User', 'Reviewer', 'Business']
    },
    text: {
      type: String,
      maxlength: 200
    },
    likes: [mongoose.Schema.Types.ObjectId],
    likesCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'shares.userModel'
    },
    userModel: {
      type: String,
      enum: ['User', 'Reviewer', 'Business']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  sharesCount: {
    type: Number,
    default: 0
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  reach: {
    type: Number,
    default: 0
  },
  engagement: {
    type: Number,
    default: 0
  },
  
  // Flags & Reports
  reports: [{
    reportedBy: mongoose.Schema.Types.ObjectId,
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'false-info', 'harassment', 'other']
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reportsCount: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, { 
  timestamps: true 
})

const Post = mongoose.model('Post', postSchema)
export default Post
