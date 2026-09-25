import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_GATEWAY_URL || 'http://127.0.0.1:3030',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
