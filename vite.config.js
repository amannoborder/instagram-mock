import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Phone-mock pane (controls panel comes later). Plain React SPA.
export default defineConfig({
  plugins: [react()],
  server: { port: 8731, open: true },
})
