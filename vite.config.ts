import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

const previewRewritePlugin = (): Plugin => ({
  name: 'preview-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || '';
      
      // Rewrite для /p/... (локальная разработка)
      if (url.match(/^\/p\/.+/)) {
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