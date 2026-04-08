import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Generate gzip (.gz) compressed versions of all JS/CSS assets
    compression({ algorithm: 'gzip', ext: '.gz' }),
    // Generate brotli (.br) compressed versions — better compression than gzip
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  build: {
    // Use esbuild for fastest, smallest minification
    minify: 'esbuild',
    // Inline assets smaller than 4KB as base64 to save HTTP requests
    assetsInlineLimit: 4096,
    // Split CSS per chunk for better caching
    cssCodeSplit: true,
    // Warn only above 600KB (Vite default is 500KB)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor libs into a separate cached chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Deterministic asset names for long-term CDN caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
