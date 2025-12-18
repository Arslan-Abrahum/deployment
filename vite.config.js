import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://207.180.233.44:8001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})



