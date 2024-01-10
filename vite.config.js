import { fileURLToPath, URL } from 'node:url'
import { splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Stoic Music',
        theme_color: '#374151',
        icons: [
          {
            src: 'assets/img/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/img/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'assets/img/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'assets/img/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: 'assets/img/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Stoic Music'
          },
          {
            src: 'assets/img/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Stoic Music'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg}'],
        dontCacheBustURLsMatching: /__WB_REVISION__/
      }
    }),
    splitVendorChunkPlugin(),
    // visualizer({ open: true })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('howler')) {
            return 'howler'
          }
          if (id.includes('vue-i18n')) {
            return 'vue-i18n'
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
