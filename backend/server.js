import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import authRoutes from './modules/auth/auth.routes.js'
import postRoutes from './modules/post/post.routes.js'
import reviewRoutes from './modules/review/review.routes.js'
import userRoutes from './modules/user/user.routes.js'
import storyRoutes from './modules/story/story.routes.js'
import productRoutes from './modules/product/product.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import { seedAdmin } from './modules/admin/admin.controller.js'
dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

// security headers — disable crossOriginResourcePolicy so uploads are accessible from frontend
app.use(helmet({ crossOriginResourcePolicy: false }))

// lock CORS to frontend origin
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }))

app.use(express.json())

// strip $ and . from request body/query to block NoSQL injection
app.use(mongoSanitize())

// rate limit auth routes — max 15 attempts per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/auth', authLimiter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' MongoDB Connected')
    seedAdmin()
  })
  .catch((err) => console.error(' MongoDB Connection Error:', err))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.get('/', (req, res) => {
  res.json({ message: 'Verity API Server Running' })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`)
})

// global error handler — never leak stack traces to client
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Something went wrong' })
})
