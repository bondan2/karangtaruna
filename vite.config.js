import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Menambah limit peringatan ke 2MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Memisahkan library besar menjadi chunk terpisah
            if (id.includes('xlsx') || id.includes('jspdf')) {
              return 'vendor-export';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('supabase')) {
              return 'vendor-db';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor'; // Sisa node_modules
          }
        }
      }
    }
  }
})
