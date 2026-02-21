import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviewer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verdict: {
    type: String,
    enum: ['verified', 'misleading', 'false', 'needs-context'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  sources: [{
    title: String,
    url: String
  }],
  tags: [String]
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)
export default Review
