import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hash routing keeps every deep link (game detail, gameplay) reload-safe on
// static hosting, which is how the store is designed to be published.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
})
