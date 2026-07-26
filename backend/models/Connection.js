import mongoose from 'mongoose'
const connectionSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['pending', 'active', 'blocked', 'muted'],
    default: 'pending'
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})
connectionSchema.index({ follower: 1, following: 1 }, { unique: true })
const Connection = mongoose.model('Connection', connectionSchema)
export default Connection

