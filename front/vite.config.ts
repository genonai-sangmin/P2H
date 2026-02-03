import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },

  // server: {
  //   host: '0.0.0.0',
  //   port: 2000,
  //   proxy: {
  //     '/show_files': {
  //       target: 'http://localhost:1999',
  //       changeOrigin: true,
  //     },
  //     '/files': {
  //       target: 'http://localhost:1999',
  //       changeOrigin: true,
  //     },
  //   },
  // },
 server: {
   host: '0.0.0.0',
   port: 2000,
   proxy: {
     '/show_files': {
       target: 'http://backend:1999',
       changeOrigin: true,
     },
     '/files': {
       target: 'http://backend:1999',
       changeOrigin: true,
     },
   },
 },
  optimizeDeps: {
    include: ['react-router-dom'],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
