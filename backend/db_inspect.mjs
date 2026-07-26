import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import User from './models/User.js'
import Post from './models/Post.js'
import Reviewer from './models/Reviewer.js'
import Business from './models/Business.js'
import dns from 'dns'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const parseSrvUri = (uri) => {
  try { const url = new URL(uri); if (url.protocol !== 'mongodb+srv:') return null; return { username: url.username ? encodeURIComponent(url.username) : undefined, password: url.password ? encodeURIComponent(url.password) : undefined, host: url.hostname, pathname: url.pathname, search: url.search } } catch { return null }
}
const resolveSrvHosts = async (clusterHost) => {
  try { const records = await dns.promises.resolveSrv(`_mongodb._tcp.${clusterHost}`); return records.map(r => ({ host: r.name, port: r.port })) } catch (firstError) {
    const command = `nslookup -type=SRV _mongodb._tcp.${clusterHost}`
    const { stdout } = await execAsync(command, { timeout: 5000 })
    const lines = stdout.split(/\r?\n/)
    const hosts = []
    let current = {}
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('priority') || trimmed.startsWith('weight')) continue
      if (trimmed.startsWith('port')) { const portMatch = trimmed.match(/port\s*=\s*(\d+)/i); if (portMatch) current.port = parseInt(portMatch[1], 10) }
      if (trimmed.toLowerCase().includes('svr hostname')) { const hostMatch = trimmed.match(/svr hostname\s*=\s*(.+)$/i); if (hostMatch) current.host = hostMatch[1].trim() }
      if (current.host && current.port) { hosts.push(current); current = {} }
    }
    return hosts
  }
}
const buildStandardMongoUri = (srvUri, hosts) => {
  const parsed = parseSrvUri(srvUri)
  if (!parsed) return null
  const authPart = parsed.username ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@` : ''
  const hostPart = hosts.map(({ host, port }) => `${host}:${port}`).join(',')
  const searchParams = new URLSearchParams(parsed.search)
  if (!searchParams.has('tls') && !searchParams.has('ssl')) searchParams.set('tls', 'true')
  return `mongodb://${authPart}${hostPart}${parsed.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
}

async function connect(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, socketTimeoutMS: 10000, family: 4 })
  console.log('Connected with', uri.startsWith('mongodb+srv://') ? 'SRV URI' : 'standard URI')
}

const uri = process.env.MONGODB_URI
console.log('env uri raw', uri?.slice(0, 40))
try {
  await connect(uri)
} catch (e) {
  console.error('SRV failure', e.message)
  const parsed = parseSrvUri(uri)
  const hosts = await resolveSrvHosts(parsed.host)
  console.log('resolved hosts', hosts)
  const fallback = buildStandardMongoUri(uri, hosts)
  console.log('fallback uri', fallback?.slice(0, 80))
  await connect(fallback)
}
console.log('Counts:')
console.log('Users', await User.countDocuments())
console.log('Reviewers', await Reviewer.countDocuments())
console.log('Business', await Business.countDocuments())
console.log('Posts total', await Post.countDocuments())
console.log('Posts approved', await Post.countDocuments({ verificationStatus: 'approved' }))
const onePost = await Post.findOne({ verificationStatus: 'approved' }).lean().exec()
console.log('One approved post', onePost ? { id: onePost._id.toString(), media: onePost.media?.slice(0,2), author: onePost.author } : 'none')
await mongoose.disconnect()
