import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const rootDir = path.dirname(fileURLToPath(import.meta.url));

type GeneratePreviewBody = {
  sourceUrl?: string;
  previewUrl?: string;
};

const readRequestBody = async (req: import('node:http').IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

const sendJson = (
  res: import('node:http').ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>
) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const normalizePreviewUrlToPublicDir = (previewUrl: string) => {
  const trimmed = previewUrl.trim();
  if (!trimmed) {
    throw new Error('Preview URL is required.');
  }

  let previewPath = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    const parsed = new URL(trimmed);
    previewPath = parsed.pathname;
  }

  previewPath = previewPath.replace(/\/+$/, '');
  if (!previewPath.startsWith('/preview/')) {
    throw new Error('Preview URL must start with /preview/.');
  }

  const relativePath = previewPath
    .replace(/^\/preview\/+/, '')
    .split('/')
    .filter(Boolean)
    .join('/');

  if (!relativePath || relativePath.includes('..')) {
    throw new Error('Preview URL path is not safe.');
  }

  return {
    previewPath,
    targetDir: path.join(rootDir, 'public', 'preview', relativePath),
  };
};

const getPreviewAssetUrl = (previewPath: string, assetName: string) => {
  const trimmed = previewPath.trim().replace(/\/+$/, '');
  return `${trimmed}/${assetName}`;
};

const generatePreviewPlugin = (): Plugin => ({
  name: 'generate-component-preview',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.method !== 'POST' || req.url !== '/api/generate-component-preview') {
        next();
        return;
      }

      try {
        const rawBody = await readRequestBody(req);
        const body = JSON.parse(rawBody || '{}') as GeneratePreviewBody;
        const sourceUrl = body.sourceUrl?.trim();
        const previewUrl = body.previewUrl?.trim();

        if (!sourceUrl) {
          sendJson(res, 400, { error: 'Source Framer URL is required.' });
          return;
        }

        if (!previewUrl) {
          sendJson(res, 400, { error: 'Preview URL is required.' });
          return;
        }

        const { previewPath, targetDir } = normalizePreviewUrlToPublicDir(previewUrl);
        fs.mkdirSync(targetDir, { recursive: true });

        const extractorPath = path.join(rootDir, 'scripts', 'framer-extractor.js');
        await execFileAsync(
          process.execPath,
          [extractorPath, sourceUrl, '--output', targetDir, '--html-name', 'index.html'],
          {
            cwd: rootDir,
            timeout: 180000,
            maxBuffer: 1024 * 1024 * 20,
          }
        );

        sendJson(res, 200, {
          ok: true,
          previewUrl: previewPath,
          previewPath,
          imageUrl: getPreviewAssetUrl(previewPath, 'preview.png'),
          files: ['index.html', 'result.css', 'preview.png', 'meta.json'],
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate preview.';
        console.error('Preview generation failed:', message);
        sendJson(res, 500, { error: message });
      }
    });
  },
});

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
  plugins: [react(), generatePreviewPlugin(), previewRewritePlugin()],
  server: {
    port: 4173,
    strictPort: false,
  },
  build: {
    chunkSizeWarningLimit: 1000, // Увеличиваем лимит до 1000 KB
  },
});
