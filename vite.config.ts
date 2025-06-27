import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'popup.html',
        background: 'src/background/background.ts',
      },
      output: {
        entryFileNames: (chunkInfo: any) => {
          return chunkInfo.name === 'background' ? 'background.js' : '[name].js'
        },
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020'
  },
  define: {
    global: 'globalThis',
  }
}) 