import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',

      // Static assets you want to include in the cache
      includeAssets: ['favicon.ico', 'robots.txt', 'react.svg'],

      manifest: {
        name: 'Pocket Media Library',
        short_name: 'Pocket',
        description: 'Description Placeholder',
        theme_color: '#000000',
        background_color: '#1e1e1e',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/react.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ],
      },

      workbox: {
        // Automatically cache all relevant files in the dist folder
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],

        // ✅ Offline support for SPA routing
        navigateFallback: '/index.html',
      }
    })
  ],

  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/thumbnails': { target: 'http://localhost:3000', changeOrigin: true },
      '/videos': { target: 'http://localhost:3000', changeOrigin: true },
    }
  }
})
