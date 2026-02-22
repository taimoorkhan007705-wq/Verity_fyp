import Product from '../../models/Product.js'
import Business from '../../models/Business.js'
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, tags, stock } = req.body
    const businessId = req.user.id
    if (req.user.role !== 'Business') {
      return res.status(403).json({ success: false, message: 'Only businesses can create products' })
    }
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/users/${businessId}/products/${file.filename}`,
      thumbnail: `/uploads/users/${businessId}/products/${file.filename}`
    })) : []
    const product = await Product.create({
      business: businessId,
      name,
      description,
      price,
      category,
      tags: tags ? JSON.parse(tags) : [],
      stock: stock || 0,
      inStock: stock > 0,
      images
    })
    await product.populate('business', 'user_info.fullName profile_info.avatar business_details.businessType')
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message })
  }
}
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query
    const query = { isActive: true }
    if (category && category !== 'All') {
      query.category = category
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('business', 'user_info.fullName profile_info.avatar business_details.businessType')
    const count = await Product.countDocuments(query)
    res.json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message })
  }
}
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('business', 'user_info.fullName profile_info.avatar business_details.businessType contact_info')
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    const userId = req.user?.id
    const userRole = req.user?.role
    if (userId) {
      const alreadyViewed = product.viewedBy.some(v => v.user.toString() === userId)
      if (!alreadyViewed) {
        product.viewedBy.push({ user: userId, userModel: userRole })
        product.views += 1
        await product.save()
      }
    }
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message })
  }
}
export const getBusinessProducts = async (req, res) => {
  try {
    const businessId = req.user.id
    if (req.user.role !== 'Business') {
      return res.status(403).json({ success: false, message: 'Only businesses can access this' })
    }
    const products = await Product.find({ business: businessId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'inquiries.user',
        select: 'user_info.fullName profile_info.avatar email'
      })
    const totalViews = products.reduce((sum, p) => sum + p.views, 0)
    const totalInquiries = products.reduce((sum, p) => sum + p.inquiriesCount, 0)
    const totalLikes = products.reduce((sum, p) => sum + p.likesCount, 0)
    res.json({
      success: true,
      products,
      analytics: {
        totalProducts: products.length,
        totalViews,
        totalInquiries,
        totalLikes,
        activeProducts: products.filter(p => p.isActive).length
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message })
  }
}
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, tags, stock, isActive } = req.body
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    if (product.business.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    if (name) product.name = name
    if (description) product.description = description
    if (price) product.price = price
    if (category) product.category = category
    if (tags) product.tags = JSON.parse(tags)
    if (stock !== undefined) {
      product.stock = stock
      product.inStock = stock > 0
    }
    if (isActive !== undefined) product.isActive = isActive
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/users/${req.user.id}/products/${file.filename}`,
        thumbnail: `/uploads/users/${req.user.id}/products/${file.filename}`
      }))
      product.images = [...product.images, ...newImages]
    }
    await product.save()
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message })
  }
}
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    if (product.business.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    await product.deleteOne()
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message })
  }
}
export const sendInquiry = async (req, res) => {
  try {
    const { message } = req.body
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    product.inquiries.push({
      user: req.user.id,
      userModel: req.user.role,
      message
    })
    product.inquiriesCount += 1
    await product.save()
    res.json({ success: true, message: 'Inquiry sent successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send inquiry', error: error.message })
  }
}
export const likeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    const userId = req.user.id
    const likeIndex = product.likes.findIndex(like => like.user.toString() === userId)
    if (likeIndex > -1) {
      product.likes.splice(likeIndex, 1)
      product.likesCount -= 1
    } else {
      product.likes.push({ user: userId, userModel: req.user.role })
      product.likesCount += 1
    }
    await product.save()
    res.json({ success: true, likes: product.likesCount })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like product', error: error.message })
  }
}
