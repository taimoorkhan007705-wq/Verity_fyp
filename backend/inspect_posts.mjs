import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import Post from './models/Post.js'
import Reviewer from './models/Reviewer.js'
import User from './models/User.js'

const uri = process.env.MONGODB_URI
const url = new URL(uri)
const username = encodeURIComponent(url.username)
const password = encodeURIComponent(url.password)
const auth = username ? `${username}:${password}@` : ''
const hosts = ['ac-plohefn-shard-00-00.cdtghag.mongodb.net:27017','ac-plohefn-shard-00-02.cdtghag.mongodb.net:27017','ac-plohefn-shard-00-01.cdtghag.mongodb.net:27017']
const fallback = `mongodb://${auth}${hosts.join(',')}${url.pathname}${url.search || '?appName=Cluster0&tls=true'}`
console.log('Fallback URI:', fallback.replace(/^(mongodb:\/\/)([^:@]+)(:[^@]+)?@/, '$1<user>$3@'))
await mongoose.connect(fallback, { serverSelectionTimeoutMS:10000, connectTimeoutMS:10000, socketTimeoutMS:10000, family:4 })
const counts = {
  total: await Post.countDocuments(),
  pending: await Post.countDocuments({ verificationStatus: 'pending' }),
  awaiting_review: await Post.countDocuments({ verificationStatus: 'awaiting_review' }),
  approved: await Post.countDocuments({ verificationStatus: 'approved' }),
  rejected: await Post.countDocuments({ verificationStatus: 'rejected' }),
  ai_rejected: await Post.countDocuments({ verificationStatus: 'ai_rejected' })
}
const posts = await Post.find().lean().limit(50)
const reviewers = await Reviewer.find().lean().limit(50)
const users = await User.find().lean().limit(50)
console.log(JSON.stringify({ counts, posts: posts.map(p => ({ id: p._id.toString(), author: p.author?.toString(), status: p.verificationStatus, media: p.media?.map(m => m.url), pendingReason: p.pendingReason, createdAt: p.createdAt, visibility: p.visibility })), reviewers: reviewers.map(r => ({ email: r.email, role: r.role, trustScore: r.trust_security?.trustScore })), users: users.map(u => ({ email: u.email, role: u.role })) }, null, 2))
await mongoose.disconnect()
