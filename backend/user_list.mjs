import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import User from './models/User.js'
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
async function main(){
  const uri = process.env.MONGODB_URI
  const parsed = parseSrvUri(uri)
  let connUri = uri
  try { await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, socketTimeoutMS: 10000, family: 4 }); console.log('connected srv') } catch (e) {
    const hosts = await resolveSrvHosts(parsed.host)
    const fallback = buildStandardMongoUri(uri, hosts)
    await mongoose.connect(fallback, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, socketTimeoutMS: 10000, family: 4 });
    console.log('connected fallback')
  }
  const users = await User.find({}).lean().exec()
  console.log('users', users.map(u => ({ email: u.email, role: u.role, fullName: u.user_info?.fullName || u.fullName })))
  await mongoose.disconnect()
}
main()
