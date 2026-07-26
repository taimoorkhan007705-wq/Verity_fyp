import dns from 'dns'
console.log('default servers', dns.getServers())
dns.setServers(['8.8.8.8','1.1.1.1'])
console.log('new servers', dns.getServers())
try {
  const records = await dns.promises.resolveSrv('_mongodb._tcp.cluster0.cdtghag.mongodb.net')
  console.log('records', records)
} catch (err) {
  console.error('resolveSrv error', err.code, err.message)
}
