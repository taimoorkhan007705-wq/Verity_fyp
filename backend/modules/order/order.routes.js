import express from 'express'
import { protect } from '../../middleware/auth.js'
import {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
  placeOrder, getMyOrders, getBusinessOrders, updateOrderStatus, getOrderById
} from './order.controller.js'

const router = express.Router()

// Cart — buyer only
router.get('/cart', protect, getCart)
router.post('/cart', protect, addToCart)
router.put('/cart', protect, updateCartItem)
router.delete('/cart/:productId', protect, removeFromCart)
router.delete('/cart', protect, clearCart)

// Orders
router.post('/orders', protect, placeOrder)
router.get('/orders/my', protect, getMyOrders)
router.get('/orders/business', protect, getBusinessOrders)
router.get('/orders/:orderId', protect, getOrderById)
router.put('/orders/:orderId/status', protect, updateOrderStatus)

export default router
