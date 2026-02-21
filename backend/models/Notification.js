import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  // Recipient
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: true
  },
  userModel: {
    type: String,
    required: true,
    enum: ['User', 'Reviewer', 'Business']
  },
  
  // Notification Details
  type: {
    type: String,
    required: true,
    enum: ['like', 'comment', 'follow', 'mention', 'review', 'message', 'post_approved', 'post_rejected']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
  // Related Data
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedUserModel'
  },
  relatedUserModel: {
    type: String,
    enum: ['User', 'Reviewer', 'Business']
  },
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId
  },
  
  // Action
  actionUrl: {
    type: String
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
})

// Index for performance
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
