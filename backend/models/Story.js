import mongoose from 'mongoose'
const storySchema = new mongoose.Schema({
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
  mediaUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  caption: {
    type: String,
    maxlength: 200
  },
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
storySchema.pre('save', function(next) {
  if (this.isNew) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
  next()
})
const Story = mongoose.model('Story', storySchema)
export default Story
