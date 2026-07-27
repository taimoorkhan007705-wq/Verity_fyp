import Cart from '../../models/Cart.js'
import Order from '../../models/Order.js'
import Product from '../../models/Product.js'
import Message from '../../models/Message.js'
import Notification from '../../models/Notification.js'

// ─── CART ──────────────────────────────────────────────────────

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images stock inStock business isActive')
    res.json({ success: true, cart: cart || { items: [] } })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body
    const product = await Product.findById(productId)
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Product not found' })
    if (product.stock < quantity)
      return res.status(400).json({ success: false, message: `Only ${product.stock} in stock` })

    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) cart = new Cart({ user: req.user.id, userModel: req.user.role, items: [] })

    const existing = cart.items.find(i => i.product.toString() === productId)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
    } else {
      cart.items.push({ product: productId, quantity, price: product.price })
    }
    await cart.save()
    await cart.populate('items.product', 'name price images stock inStock business isActive')
    res.json({ success: true, message: 'Added to cart', cart })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' })

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId)
    } else {
      const item = cart.items.find(i => i.product.toString() === productId)
      if (item) item.quantity = quantity
    }
    await cart.save()
    await cart.populate('items.product', 'name price images stock inStock business isActive')
    res.json({ success: true, cart })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' })
    cart.items = cart.items.filter(i => i.product.toString() !== productId)
    await cart.save()
    res.json({ success: true, message: 'Removed from cart' })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] })
    res.json({ success: true, message: 'Cart cleared' })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

// ─── ORDERS ────────────────────────────────────────────────────

export const placeOrder = async (req, res) => {
  try {
    const { items, paymentMethod, paymentNote, shippingAddress } = req.body
    if (!items?.length) return res.status(400).json({ success: false, message: 'No items in order' })
    if (!paymentMethod) return res.status(400).json({ success: false, message: 'Payment method required' })

    // Group by business
    const businessMap = {}
    for (const item of items) {
      const product = await Product.findById(item.productId).populate('business', '_id')
      if (!product) continue
      const bizId = product.business._id.toString()
      if (!businessMap[bizId]) businessMap[bizId] = []
      businessMap[bizId].push({
        product: product._id,
        productName: product.name,
        productImage: product.images?.[0]?.url || '',
        quantity: item.quantity,
        unitPrice: product.price,
        total: product.price * item.quantity
      })
    }

    const orders = []
    for (const [bizId, orderItems] of Object.entries(businessMap)) {
      const totalAmount = orderItems.reduce((s, i) => s + i.total, 0)
      const order = await Order.create({
        buyer: req.user.id,
        buyerModel: req.user.role,
        business: bizId,
        items: orderItems,
        totalAmount,
        paymentMethod,
        paymentNote: paymentNote || '',
        shippingAddress: shippingAddress || {},
        statusHistory: [{ status: 'pending', note: 'Order placed' }]
      })

      // Notify business via message system
      const conversationId = [req.user.id, bizId].sort().join('_')
      const itemsList = orderItems.map(i => `${i.productName} x${i.quantity}`).join(', ')
      await Message.create({
        conversationId,
        sender: req.user.id,
        senderModel: req.user.role,
        receiver: bizId,
        receiverModel: 'Business',
        message: `🛒 New Order #${order._id.toString().slice(-6).toUpperCase()}\nItems: ${itemsList}\nTotal: Rs. ${totalAmount}\nPayment: ${paymentMethod}${paymentNote ? `\nNote: ${paymentNote}` : ''}`
      })

      await Notification.create({
        user: bizId,
        userModel: 'Business',
        type: 'message',
        title: 'New Order Received!',
        message: `New order for ${itemsList} - Rs. ${totalAmount}`,
        relatedUser: req.user.id,
        relatedUserModel: req.user.role,
        actionUrl: `/dashboard`
      })

      orders.push(order)
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] })

    res.status(201).json({ success: true, message: 'Order placed successfully', orders })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('business', 'user_info.fullName profile_info.avatar')
    res.json({ success: true, orders })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const getBusinessOrders = async (req, res) => {
  try {
    if (req.user.role !== 'Business')
      return res.status(403).json({ success: false, message: 'Business only' })
    const { status } = req.query
    const query = { business: req.user.id }
    if (status && status !== 'all') query.status = status
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('buyer', 'user_info.fullName profile_info.avatar email')
    res.json({ success: true, orders })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body
    const order = await Order.findById(req.params.orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    if (order.business.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' })

    order.status = status
    order.statusHistory.push({ status, note: note || '' })
    if (note) order.businessNote = note
    await order.save()

    // Notify buyer
    const conversationId = [req.user.id, order.buyer.toString()].sort().join('_')
    await Message.create({
      conversationId,
      sender: req.user.id,
      senderModel: 'Business',
      receiver: order.buyer,
      receiverModel: order.buyerModel,
      message: `📦 Order #${order._id.toString().slice(-6).toUpperCase()} status updated to: ${status.toUpperCase()}${note ? `\nNote: ${note}` : ''}`
    })

    res.json({ success: true, message: 'Order updated', order })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('business', 'user_info.fullName profile_info.avatar contact_info')
      .populate('buyer', 'user_info.fullName profile_info.avatar email')
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    const isBuyer = order.buyer._id.toString() === req.user.id
    const isSeller = order.business._id.toString() === req.user.id
    if (!isBuyer && !isSeller)
      return res.status(403).json({ success: false, message: 'Not authorized' })
    res.json({ success: true, order })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}
