import dns from 'dns'
import { exec } from 'child_process'
import { promisify } from 'util'

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
  } catch {
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
    console.error('resolveSrv failed:', firstError.message)
    try {
      const command = `nslookup -type=SRV _mongodb._tcp.${clusterHost}`
      const { stdout } = await execAsync(command, { timeout: 5000 })
      console.log(stdout)
      const lines = stdout.split(/\r?\n/)
      const hosts = []
      let current = {}
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('priority') || trimmed.startsWith('weight')) continue
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
      return hosts
    } catch (secondError) {
      console.error('nslookup fallback failed:', secondError.message)
      throw firstError
    }
  }
}

const uri = 'mongodb+srv://cluster0.cdtghag.mongodb.net/verity_fyp?retryWrites=true&w=majority&appName=Cluster0'
const parsed = parseSrvUri(uri)
console.log('parsed', parsed)
const hosts = await resolveSrvHosts(parsed.host)
console.log('hosts', hosts)
const fallbackUri = buildStandardMongoUri(uri, hosts)
console.log('fallback', fallbackUri)
