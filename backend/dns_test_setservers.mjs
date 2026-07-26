import dns from "dns"
import { promisify } from "util"
const resolveSrv = dns.promises.resolveSrv
console.log('set servers');
dns.setServers(['1.1.1.1','8.8.8.8','9.9.9.9','208.67.222.222'])
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))
let done = false
resolveSrv('_mongodb._tcp.cluster0.cdtghag.mongodb.net')
  .then(res => { done = true; console.log('resolved', res); })
  .catch(err => { done = true; console.error('resolve err', err.code, err.message) })
await timeout(30000)
console.log('done wait', done)
