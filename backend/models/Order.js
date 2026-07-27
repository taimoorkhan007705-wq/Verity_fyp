import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  productImage: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
})

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'buyerModel',
    required: true
  },
  buyerModel: {
    type: String,
    enum: ['User', 'Reviewer'],
    default: 'User'
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['easypaisa', 'jazzcash', 'bankTransfer', 'creditCard', 'cashOnDelivery'],
    required: true
  },
  paymentNote: { type: String, default: '' }, // buyer's note e.g. "Sent on Easypaisa, ref #123"
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String
  },
  statusHistory: [{
    status: String,
    note: String,
    changedAt: { type: Date, default: Date.now }
  }],
  businessNote: { type: String, default: '' } // business can leave a note for buyer
}, { timestamps: true })

orderSchema.index({ buyer: 1, createdAt: -1 })
orderSchema.index({ business: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

export default mongoose.model('Order', orderSchema)
