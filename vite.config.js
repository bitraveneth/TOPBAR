import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        timeout: 600000,
        proxyTimeout: 600000,
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq, req) => {
            const address = req.socket?.remoteAddress
            if (address) proxyReq.setHeader('x-forwarded-for', address)
          })
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'router'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor'
        },
      },
    },
  },
})
