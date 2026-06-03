import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/inscription': 'http://127.0.0.1:8000',
      '/connexion': 'http://127.0.0.1:8000',
      '/deconnexion': 'http://127.0.0.1:8000'
    }
  }
})
