import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './modules/auth/auth.routes.js'
import postRoutes from './modules/post/post.routes.js'
import reviewRoutes from './modules/review/review.routes.js'
import userRoutes from './modules/user/user.routes.js'
import storyRoutes from './modules/story/story.routes.js'
import productRoutes from './modules/product/product.routes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB Connected'))
  .catch((err) => console.error(' MongoDB Connection Error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)  // Changed from /api/user to /api/users
app.use('/api/stories', storyRoutes)
app.use('/api/products', productRoutes)

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Verity API Server Running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`)
})
