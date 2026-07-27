import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  price: { type: Number, required: true }, // snapshot price at time of adding
  addedAt: { type: Date, default: Date.now }
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: true,
    unique: true
  },
  userModel: {
    type: String,
    enum: ['User', 'Reviewer'],
    default: 'User'
  },
  items: [cartItemSchema]
}, { timestamps: true })

export default mongoose.model('Cart', cartSchema)
