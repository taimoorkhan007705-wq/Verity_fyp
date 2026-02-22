import express from 'express'
import { protect } from '../../middleware/auth.js'
import { uploadProduct } from '../../middleware/upload.js'
import {
  createProduct,
  getAllProducts,
  getProductById,
  getBusinessProducts,
  updateProduct,
  deleteProduct,
  sendInquiry,
  likeProduct
} from './product.controller.js'
const router = express.Router()
router.get('/', getAllProducts)
router.get('/business/my-products', protect, getBusinessProducts)
router.get('/:id', protect, getProductById)
router.post('/', protect, uploadProduct, createProduct)
router.put('/:id', protect, uploadProduct, updateProduct)
router.delete('/:id', protect, deleteProduct)
router.post('/:id/inquiry', protect, sendInquiry)
router.post('/:id/like', protect, likeProduct)
export default router
