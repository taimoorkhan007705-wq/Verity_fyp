import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: 1000
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  images: [{
    url: String,
    thumbnail: String
  }],
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics', 
      'Automotive',
      'Fashion & Clothing',
      'Home & Furniture',
      'Beauty & Personal Care',
      'Sports & Outdoors',
      'Books & Stationery',
      'Toys & Games',
      'Food & Beverages',
      'Health & Wellness',
      'Jewelry & Accessories',
      'Pet Supplies',
      'Garden & Tools',
      'Baby & Kids',
      'Art & Crafts',
      'Music & Instruments',
      'Real Estate',
      'Services',
      'Other'
    ]
  },
  tags: [String],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'viewedBy.userModel'
    },
    userModel: {
      type: String,
      enum: ['User', 'Reviewer', 'Business']
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
  inquiries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'inquiries.userModel'
    },
    userModel: {
      type: String,
      enum: ['User', 'Reviewer', 'Business']
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  inquiriesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
})
productSchema.index({ business: 1, createdAt: -1 })
productSchema.index({ category: 1 })
productSchema.index({ isActive: 1 })
const Product = mongoose.model('Product', productSchema)
export default Product
