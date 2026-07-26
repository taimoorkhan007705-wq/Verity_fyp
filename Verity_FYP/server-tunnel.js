/**
 * Simple Tunnel Server for Local Mobile Testing
 * Forward traffic from mobile devices to your local dev servers
 * No external dependencies needed!
 */

import http from 'http'
import os from 'os'

// Get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

const LOCAL_IP = getLocalIP()
const TUNNEL_PORT = 3000
const VITE_PORT = 5173
const BACKEND_PORT = 5000

console.log('\n🌐 TUNNEL SERVER STARTING')
console.log('════════════════════════════════════════')
console.log('\n📱 Access on mobile from ANY device:')
console.log(`   http://${LOCAL_IP}:${TUNNEL_PORT}`)
console.log('\n💡 On same WiFi network? Use this IP!')
console.log('\n════════════════════════════════════════\n')

// Simple proxy function
function proxyRequest(req, res, target) {
  const url = new URL(req.url, target)
  
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: req.method,
    headers: {
      ...req.headers,
      'Host': url.host
    }
  }
  
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res)
  })
  
  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err)
    res.writeHead(502)
    res.end('Bad Gateway')
  })
  
  req.pipe(proxyReq)
}

// Create server
const server = http.createServer((req, res) => {
  // CORS headers for mobile
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  // Route /api to backend
  if (req.url.startsWith('/api')) {
    proxyRequest(req, res, `http://localhost:${BACKEND_PORT}`)
  } else {
    // Route everything else to Vite frontend
    proxyRequest(req, res, `http://localhost:${VITE_PORT}`)
  }
})

server.listen(TUNNEL_PORT, '0.0.0.0', () => {
  console.log(`✅ Tunnel server running!`)
  console.log(`   PC: http://localhost:${TUNNEL_PORT}`)
  console.log(`   Mobile (WiFi): http://${LOCAL_IP}:${TUNNEL_PORT}`)
  console.log(`\n📍 Routing:`)
  console.log(`   /api     → Backend (${BACKEND_PORT})`)
  console.log(`   /        → Frontend (${VITE_PORT})`)
})
