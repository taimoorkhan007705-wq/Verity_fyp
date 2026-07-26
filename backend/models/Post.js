import mongoose from 'mongoose'
const postSchema = new mongoose.Schema({
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
  content: {
    type: String,
    maxlength: 500,
    default: '',
    validate: [
      {
        validator: function(v) {
          // Content is required only if there's no media
          if (this.media && this.media.length > 0) {
            return true // Media exists, content can be empty
          }
          // No media - content is required and must have some text
          return v && v.trim().length > 0
        },
        message: 'Post must have either content or media'
      }
    ]
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
  hashtags: [String],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'mentions.userModel'
  }],
  location: String,
  category: {
    type: String,
    enum: ['Sports', 'News', 'Trending', 'Entertainment', 'Food', 'Other'],
    default: 'Other'
  },
  categoryConfidence: {
    type: Number,
    default: 0
  },
  categoryReasoning: {
    type: String,
    default: ''
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'connections'],
    default: 'public'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'ai_rejected', 'awaiting_review'],
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
  // AI Detection Results
  aiDetectionScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  aiDetectionVerdict: {
    type: String,
    enum: ['safe', 'suspicious', 'fake', 'ai_generated'],
    default: 'safe'
  },
  aiRejectionReason: {
    type: String,
    default: ''
  },
  // text extracted from image/video via OCR (shown to reviewers for context)
  extractedText: {
    type: String,
    default: ''
  },
  // reason why AI flagged this post (shown to reviewers)
  pendingReason: {
    type: String,
    default: ''
  },
  // Reviewer Voting System
  reviewerVotes: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviewer',
      required: true
    },
    vote: {
      type: String,
      enum: ['approve', 'reject'],
      required: true
    },
    votedAt: {
      type: Date,
      default: Date.now
    },
    reasoning: {
      type: String,
      default: ''
    }
  }],
  assignedReviewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviewer'
  }],
  votingSummary: {
    approveCount: {
      type: Number,
      default: 0
    },
    rejectCount: {
      type: Number,
      default: 0
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    finalDecision: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    decidedAt: Date
  },
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

