import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Serve the app from root for React Router (BrowserRouter).
  base: '/',

  build: {
    // Target modern browsers — reduces polyfill bloat.
    target: 'es2020',
    // Chunk size warning at 250 KB (aligned with the performance budget).
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        // Split vendor chunks to improve long-term caching.
        manualChunks: {
          react:       ['react', 'react-dom'],
          router:      ['react-router-dom'],
          motion:      ['framer-motion'],
          i18n:        ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },

  server: {
    // Explicitly set port for dev consistency.
    port: 5173,
    strictPort: false,
  },
});
