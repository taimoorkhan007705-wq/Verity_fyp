import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create user-specific directory structure
const createUserDirectory = (userId) => {
  const userDir = path.join('uploads', 'users', userId)
  const postsDir = path.join(userDir, 'posts')
  const profileDir = path.join(userDir, 'profile')
  const storiesDir = path.join(userDir, 'stories')

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true })
  }
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true })
  }
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true })
  }
  if (!fs.existsSync(storiesDir)) {
    fs.mkdirSync(storiesDir, { recursive: true })
  }

  return { userDir, postsDir, profileDir, storiesDir }
}

// Storage configuration for posts
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id
    const { postsDir } = createUserDirectory(userId)
    cb(null, postsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// Storage configuration for profile images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id
    const { profileDir } = createUserDirectory(userId)
    cb(null, profileDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only images and videos are allowed'))
  }
}

// Upload middleware for posts (multiple files)
export const uploadPost = multer({
  storage: postStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
})

// Upload middleware for profile image (single file)
export const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
})

// Storage configuration for stories
const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id
    const { storiesDir } = createUserDirectory(userId)
    cb(null, storiesDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'story-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// Upload middleware for stories (single file)
export const uploadStory = multer({
  storage: storyStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
})

// Storage configuration for products
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id
    const userDir = path.join('uploads', 'users', userId)
    const productsDir = path.join(userDir, 'products')

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true })
    }

    cb(null, productsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// Upload middleware for products (multiple files)
export const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per image
  fileFilter: fileFilter
}).array('images', 5) // Max 5 images per product
