import mongoose from 'mongoose'

const connectionSchema = new mongoose.Schema({
  // Relationship
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'followerModel',
    required: true
  },
  followerModel: {
    type: String,
    required: true,
    enum: ['User', 'Reviewer', 'Business']
  },
  
  following: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'followingModel',
    required: true
  },
  followingModel: {
    type: String,
    required: true,
    enum: ['User', 'Reviewer', 'Business']
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'blocked', 'muted'],
    default: 'active'
  },
  
  // Notifications
  notificationsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Compound index to prevent duplicate connections
connectionSchema.index({ follower: 1, following: 1 }, { unique: true })

const Connection = mongoose.model('Connection', connectionSchema)
export default Connection
