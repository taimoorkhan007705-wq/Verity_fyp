import mongoose from 'mongoose'

const reviewerRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    reviewedAt: Date,
    rejectionReason: String
  },
  { timestamps: true }
)

// Prevent duplicate pending requests
reviewerRequestSchema.index({ user: 1, status: 1 }, { unique: true, sparse: true })

export default mongoose.model('ReviewerRequest', reviewerRequestSchema)
