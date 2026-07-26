import dotenv from 'dotenv'
import mongoose from 'mongoose'
import dns from 'dns'

dotenv.config({ path: './.env' })
const uri = process.env.MONGODB_URI
console.log('URI loaded:', uri ? uri.replace(/(mongodb\+srv:\/\/)(.*@)?([^\/]+)/, '$1$2<cluster>') : 'MISSING')
console.log('dns default servers before set:', dns.getServers())
dns.setServers(['1.1.1.1', '8.8.8.8', '9.9.9.9', '208.67.222.222'])
console.log('dns servers after set:', dns.getServers())
try {
  console.log('Resolving cluster SRV...')
  const parsed = new URL(uri)
  console.log('protocol', parsed.protocol)
  if (parsed.protocol === 'mongodb+srv:') {
    const host = parsed.hostname
    console.log('host', host)
    try {
      const records = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`)
      console.log('srv count', records.length)
      records.forEach(r => console.log(r))
    } catch (err) {
      console.error('dns resolveSrv failed:', err.message)
      try {
        const records = await dns.promises.resolve4(host)
        console.log('resolve4 count', records.length)
      } catch (err2) {
        console.error('resolve4 failed:', err2.message)
      }
    }
  }
  console.log('Attempting mongoose connect...')
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    family: 4
  })
  console.log('Connected OK')
  await mongoose.disconnect()
} catch (err) {
  console.error('CONNECT ERROR:', err)
  console.error('CONNECT ERROR MSG:', err.message)
  if (err.stack) console.error('STACK:', err.stack.split('\n').slice(0,5).join('\n'))
  process.exit(1)
}
