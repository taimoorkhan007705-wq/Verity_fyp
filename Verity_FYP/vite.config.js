import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'tiny-guidable-multitask.ngrok-free.dev',
      '.ngrok-free.dev',
      'all'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
