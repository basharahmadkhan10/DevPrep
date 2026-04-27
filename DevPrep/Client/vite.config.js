import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'copy-redirects',
      closeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'public/_redirects'),
            resolve(__dirname, 'dist/_redirects')
          )
          console.log('✅ _redirects file copied to dist folder')
        } catch (error) {
          console.log('⚠️ No _redirects file found, skipping...')
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === '_redirects') return '_redirects'
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
