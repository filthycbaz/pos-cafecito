import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,       // puerto acordado por el equipo
    strictPort: true, // si 3000 está ocupado, falla en vez de cambiar de puerto
  },
})
