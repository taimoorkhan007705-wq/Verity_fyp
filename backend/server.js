import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import dns from 'dns'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'
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
import reviewerRoutes from './modules/reviewer/reviewer.routes.js'
import { seedAdmin } from './modules/admin/admin.controller.js'
import { syncAwaitingReviewAssignments } from './services/reviewerAssignment.js'
import './services/emailService.js'  // Initialize email service on startup

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.set('trust proxy', 1)

// security headers — relax CSP for frontend assets and disable crossOriginResourcePolicy
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false  // allow frontend JS/CSS to load
}))

// allow localhost dev + any ngrok public URL
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    // allow localhost
    if (origin.includes('localhost')) return callback(null, true)
    // allow any ngrok domain
    if (origin.includes('ngrok')) return callback(null, true)
    callback(new Error('Not allowed by CORS'), false)
  },
  credentials: true
}))

app.use(express.json())

// ngrok shows a browser warning page on first visit — this header skips it
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true')
  next()
})

// rate limit auth routes — max 15 attempts per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/auth', authLimiter)

// strip $ and . from API request body/query to block NoSQL injection (API routes only)
app.use('/api', mongoSanitize())

// Add CORS headers for static uploads (images/videos)
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  // Allow mixed content for images
  res.setHeader('Content-Security-Policy', "upgrade-insecure-requests")
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// try multiple DNS servers to work around network restrictions
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['1.1.1.1', '8.8.8.8', '9.9.9.9', '208.67.222.222'])
const execAsync = promisify(exec)

const parseSrvUri = (uri) => {
  try {
    const url = new URL(uri)
    if (url.protocol !== 'mongodb+srv:') return null
    return {
      username: url.username ? encodeURIComponent(url.username) : undefined,
      password: url.password ? encodeURIComponent(url.password) : undefined,
      host: url.hostname,
      pathname: url.pathname,
      search: url.search
    }
  } catch (err) {
    return null
  }
}

const buildStandardMongoUri = (srvUri, hosts) => {
  const parsed = parseSrvUri(srvUri)
  if (!parsed) return null

  const authPart = parsed.username
    ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@`
    : ''
  const hostPart = hosts.map(({ host, port }) => `${host}:${port}`).join(',')

  const searchParams = new URLSearchParams(parsed.search)
  if (!searchParams.has('tls') && !searchParams.has('ssl')) {
    searchParams.set('tls', 'true')
  }

  return `mongodb://${authPart}${hostPart}${parsed.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
}

const resolveSrvHosts = async (clusterHost) => {
  try {
    const records = await dns.promises.resolveSrv(`_mongodb._tcp.${clusterHost}`)
    return records.map(r => ({ host: r.name, port: r.port }))
  } catch (firstError) {
    try {
      const command = `nslookup -type=SRV _mongodb._tcp.${clusterHost}`
      const { stdout } = await execAsync(command, { timeout: 5000 })
      const lines = stdout.split(/\r?\n/)
      const hosts = []
      let current = {}

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('priority') || trimmed.startsWith('weight')) {
          continue
        }
        if (trimmed.startsWith('port')) {
          const portMatch = trimmed.match(/port\s*=\s*(\d+)/i)
          if (portMatch) current.port = parseInt(portMatch[1], 10)
        }
        if (trimmed.toLowerCase().includes('svr hostname')) {
          const hostMatch = trimmed.match(/svr hostname\s*=\s*(.+)$/i)
          if (hostMatch) current.host = hostMatch[1].trim()
        }
        if (current.host && current.port) {
          hosts.push(current)
          current = {}
        }
      }

      if (hosts.length > 0) return hosts
      throw firstError
    } catch (secondError) {
      throw firstError
    }
  }
}

// Global flag to track MongoDB status
let isMongoConnected = false
let mongoError = null

const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    isMongoConnected = false
    mongoError = 'MONGODB_URI is not configured. Please set the database connection string in backend/.env.'
    return
  }

  const uriMasked = uri.replace(/^(mongodb\+srv:\/\/)([^:@]+)(:[^@]+)?@/, '$1<user>$3@')
  console.log('Attempting MongoDB connection using URI:', uriMasked)

  const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,  // Reduced from default to 5 seconds
    connectTimeoutMS: 5000,           // Reduced from default to 5 seconds
    socketTimeoutMS: 5000,            // Reduced from default to 5 seconds
    family: 4  // force IPv4
  }

  const tryConnect = async (connectionUri) => {
    console.log('Connecting to MongoDB with connection URI:', connectionUri.replace(/^(mongodb\+srv:\/\/)([^:@]+)(:[^@]+)?@/, '$1<user>$3@'))
    await mongoose.connect(connectionUri, mongooseOptions)
    isMongoConnected = true
    mongoError = null
    await seedAdmin()
    try {
      const syncResults = await syncAwaitingReviewAssignments()
      console.log(`Reviewer assignment sync: ${syncResults.updatedPosts} of ${syncResults.totalPendingPosts} awaiting-review posts updated.`)
    } catch (syncError) {
      console.warn('Reviewer assignment sync failed:', syncError.message)
    }
  }

  const connectionUris = [uri]
  if (uri.startsWith('mongodb+srv://')) {
    try {
      const parsed = parseSrvUri(uri)
      if (parsed) {
        const hosts = await resolveSrvHosts(parsed.host)
        const fallbackUri = buildStandardMongoUri(uri, hosts)
        if (fallbackUri) {
          connectionUris.unshift(fallbackUri)
          console.log('Resolved fallback MongoDB URI, will try standard connection first.')
        }
      }
    } catch (fallbackError) {
      console.warn('Could not build fallback MongoDB URI from SRV records:', fallbackError.message)
    }
  }

  let lastError = null
  for (const connectionUri of connectionUris) {
    try {
      await tryConnect(connectionUri)
      return
    } catch (connectionError) {
      lastError = connectionError
      console.warn('MongoDB connection attempt failed for:', connectionUri.replace(/^(mongodb\+srv:\/\/)([^:@]+)(:[^@]+)?@/, '$1<user>$3@'))
      console.warn(connectionError.message)
    }
  }

  isMongoConnected = false
  mongoError = `Database connection unavailable: ${lastError?.message || 'unknown error'}. Check your internet connection, Atlas network access/IP whitelist, and backend/.env MONGODB_URI.`
  console.error('MongoDB connection error:', lastError)
}

connectMongoDB()

// Add MongoDB status check middleware for API routes
app.use('/api', (req, res, next) => {
  if (!isMongoConnected) {
    return res.status(503).json({
      success: false,
      message: mongoError || 'Database connection unavailable',
      instruction: 'Verify backend/.env MONGODB_URI, ensure network/DNS access, and restart the backend server.'
    })
  }
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reviewer', reviewerRoutes)

// serve built frontend static assets with correct MIME types
const frontendDist = path.join(__dirname, '../Verity_FYP/dist')
app.use(express.static(frontendDist, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js'))  res.setHeader('Content-Type', 'application/javascript')
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css')
  }
}))

// SPA fallback — send index.html for all non-API, non-asset routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDist, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.json({ message: 'Verity API Server Running' })
  }
})

// global error handler — never leak stack traces to client
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err)
    res.status(500).json({ success: false, message: 'Something went wrong' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})


