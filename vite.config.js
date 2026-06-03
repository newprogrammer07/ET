import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/nse-api': {
        target: 'https://www.nseindia.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nse-api/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.nseindia.com',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      },
      '/yf-api': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yf-api/, ''),
      }
    }
  }
})
