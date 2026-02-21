import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  // Conversation
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  
  // Participants
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Reviewer', 'Business']
  },
  
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'receiverModel',
    required: true
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'Reviewer', 'Business']
  },
  
  // Content
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'file']
    },
    url: String,
    name: String,
    size: Number
  }],
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true
})

// Indexes for performance
messageSchema.index({ conversationId: 1, createdAt: -1 })
messageSchema.index({ receiver: 1, isRead: 1 })

const Message = mongoose.model('Message', messageSchema)
export default Message
