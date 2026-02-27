import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// 🔥 Создаём плагин для красивых URL (решает проблему с TypeScript)
const previewRewritePlugin = (): Plugin => ({
  name: 'preview-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || '';
      
      // Если запрос вида /preview/.../view — отдаём viewer.html
      // Пример: /preview/navbar/navbar-01/view → /preview/viewer.html
      if (url.match(/^\/preview\/.+\/view\/?$/)) {
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