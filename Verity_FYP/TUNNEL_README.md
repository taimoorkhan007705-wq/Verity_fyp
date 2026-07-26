# 🌐 Tunnel Server

Simple HTTP proxy for testing Verity on mobile devices.

## Quick Start

```bash
npm run tunnel
```

Output:
```
🌐 TUNNEL SERVER STARTING
════════════════════════════════════════
📱 Access on mobile from ANY device:
   http://10.103.107.76:3000

💡 On same WiFi network? Use this IP!
════════════════════════════════════════

✅ Tunnel server running!
   PC: http://localhost:3000
   Mobile (WiFi): http://10.103.107.76:3000

📍 Routing:
   /api     → Backend (5000)
   /        → Frontend (5173)
```

## What It Does

Routes incoming requests:
- **`http://localhost:3000/api/*`** → Backend (`localhost:5000`)
- **`http://localhost:3000/*`** → Frontend (`localhost:5173`)

This allows mobile devices on your WiFi to access your development server.

## Requirements

- Node.js (built-in `http` module)
- Backend running on port 5000
- Frontend running on port 5173
- Both on local machine

## Full Setup

```bash
# Terminal 1: Start dev servers
npm run dev

# Terminal 2: Start tunnel
npm run tunnel

# Terminal 3 (optional): Monitor requests
# (just watch terminal 2 output)
```

## Testing

### PC Browser
```
http://localhost:3000
```

### Mobile on Same WiFi
```
http://10.103.107.76:3000
```

### Mobile on Different Network
Use Cloudflare Tunnel or SSH:
```bash
cloudflared tunnel --url http://localhost:3000
```

## Firewall

Windows might block port 3000. If mobile can't connect:

1. Open Windows Firewall
2. Allow Node.js for private networks
3. Or manually add inbound rule for port 3000

## No Hot Reload?

Hot reload through tunnel is not supported. Just refresh the page on mobile.

## Performance

Typical latency: 150-300ms (WiFi dependent)

---

For full guide, see `../MOBILE_TESTING_GUIDE.md`
