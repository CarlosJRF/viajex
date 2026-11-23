import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Proxy hacia el servidor GraphQL mock y entorno DOM para las pruebas
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { '/graphql': 'http://localhost:4000' },
  },
  test: { environment: 'jsdom' },
})
