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

// Wrap multer so upload errors return a proper JSON response instead of crashing
const handleProductUpload = (req, res, next) => {
  uploadProduct(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload failed' })
    }
    next()
  })
}

router.get('/', getAllProducts)
router.get('/business/my-products', protect, getBusinessProducts)
router.get('/:id', protect, getProductById)
router.post('/', protect, handleProductUpload, createProduct)
router.put('/:id', protect, handleProductUpload, updateProduct)
router.delete('/:id', protect, deleteProduct)
router.post('/:id/inquiry', protect, sendInquiry)
router.post('/:id/like', protect, likeProduct)
export default router


