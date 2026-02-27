import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// Плагин для локального rewrite (чтобы работало на localhost)
const previewRewritePlugin = (): Plugin => ({
  name: 'preview-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || '';
      
      // Если запрос начинается с /preview/... (но не viewer.html, css и т.д.)
      if (url.match(/^\/preview\/(?!viewer\.html|viewer\.css).+/)) {
        console.log('🔧 REWRITE:', url, '→ /preview/viewer.html');
        req.url = '/preview/viewer.html';
      }
      
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), previewRewritePlugin()],
});