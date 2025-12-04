import http from 'http';
import path from 'path';
import fs from 'fs/promises';
import WebSocket, { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { BuildConfig } from '../config/index.js';
import { log } from '../utils/logger.js';
import { PluginManager } from '../plugins/index.js';
import { PluginSandbox } from '../core/sandbox.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load Native Worker
const nativePath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../nextgen_native.node');
// Fallback for different environments if needed, but this should work for local dev
const { NativeWorker } = require(nativePath);

export async function startDevServer(cfg: BuildConfig) {
  const nativeWorker = new NativeWorker(4); // 4 threads
  const pluginManager = new PluginManager();
  if (cfg.plugins) {
    cfg.plugins.forEach(p => pluginManager.register(p));
  }

  // Initialize Sandbox
  const { PermissionManager } = await import('../core/permissions.js');
  const sandbox = new PluginSandbox(new PermissionManager());
  // await sandbox.start(); // Sandbox doesn't have start method anymore
  // pluginManager.register(new SandboxedPlugin(sandbox)); // SandboxedPlugin class removed

  // Auto-register Tailwind Plugin if config exists
  const tailwindConfigPath = path.join(cfg.root, 'tailwind.config.js');
  if (await fs.access(tailwindConfigPath).then(() => true).catch(() => false)) {
    const { TailwindPlugin } = await import('../plugins/css/tailwind.js');
    pluginManager.register(new TailwindPlugin(cfg.root));
  }

  // Auto-register CSS Preprocessor Plugins
  // In a real scenario, we might check for package.json dependencies or config files
  // For now, we'll register them and they will gracefully skip if deps are missing
  const { SassPlugin } = await import('../plugins/css/sass.js');
  pluginManager.register(new SassPlugin(cfg.root));

  const { LessPlugin } = await import('../plugins/css/less.js');
  pluginManager.register(new LessPlugin(cfg.root));

  const { StylusPlugin } = await import('../plugins/css/stylus.js');
  pluginManager.register(new StylusPlugin(cfg.root));

  const port = cfg.port || 5173;
  const server = http.createServer(async (req, res) => {
    const url = req.url || '/';
    if (url === '/') {
      const p = path.join(cfg.root, 'public', 'index.html');
      try {
        const data = await fs.readFile(p);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      } catch (e) {
        res.writeHead(404);
        res.end('index.html not found');
      }
      return;
    }

    if (url === '/@react-refresh') {
      const runtimePath = path.resolve(cfg.root, 'node_modules/react-refresh/cjs/react-refresh-runtime.development.js');
      try {
        const runtime = await fs.readFile(runtimePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(`
          const exports = {};
          ${runtime}
          export default exports;
        `);
      } catch (e) {
        res.writeHead(404);
        res.end('React Refresh runtime not found');
      }
      return;
    }

    // Try to serve from public first
    const publicPath = path.join(cfg.root, 'public', url);
    try {
      await fs.access(publicPath);
      const data = await fs.readFile(publicPath);
      // simple mime type guess
      const ext = path.extname(publicPath);
      const mime = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
      return;
    } catch (e) { }

    // Try to serve from root (src, node_modules, etc)
    // Remove query params
    const cleanUrl = url.split('?')[0];
    const filePath = path.join(cfg.root, cleanUrl);

    try {
      await fs.access(filePath);
      const ext = path.extname(filePath);

      if (ext === '.ts' || ext === '.tsx' || ext === '.jsx' || ext === '.js' || ext === '.mjs') {
        let raw = await fs.readFile(filePath, 'utf-8');

        // Native Transform (Caching + Graph)
        try {
          log.info(`[DevServer] Processing with NativeWorker: ${filePath}`);
          raw = nativeWorker.processFile(filePath);
          log.info(`[DevServer] NativeWorker success`);
        } catch (e) {
          log.error('NativeWorker error:', e);
          throw e;
        }

        // Plugin transform (JS plugins like Tailwind)
        raw = await pluginManager.transform(raw, filePath);

        // Use Babel for React Refresh
        if (ext === '.tsx' || ext === '.jsx') {
          const babel = await import('@babel/core');
          const result = await babel.transformAsync(raw, {
            filename: filePath,
            presets: [
              ['@babel/preset-react', { runtime: 'automatic', development: true }],
              '@babel/preset-typescript'
            ],
            plugins: ['react-refresh/babel']
          });

          if (result && result.code) {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(result.code);
            return;
          }
        }

        const { transform } = await import('esbuild');
        const result = await transform(raw, {
          loader: ext.slice(1) as any,
          sourcemap: 'inline',
          format: 'esm',
          target: 'es2020',
        });

        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(result.code);
        return;
      }

      if (ext === '.css' || ext === '.scss' || ext === '.sass' || ext === '.less' || ext === '.styl') {
        let raw = await fs.readFile(filePath, 'utf-8');
        raw = await pluginManager.transform(raw, filePath);
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(raw);
        return;
      }

      // Serve other files raw
      const data = await fs.readFile(filePath);
      res.writeHead(200);
      res.end(data);
    } catch (e: any) {
      log.error('DevServer request error:', e);
      res.writeHead(404);
      res.end('Not found');
    }
  });

  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws: WebSocket) => {
    log.info('HMR client connected');
  });

  const watcher = chokidar.watch(cfg.root, { ignored: /node_modules|\.git/ });
  watcher.on('change', (file: string) => {
    log.info('File changed:', file);

    // Native Invalidation & Rebuild
    nativeWorker.invalidate(file);
    const affected = nativeWorker.rebuild(file);

    log.info(`Rebuild affected ${affected.length} files`);

    affected.forEach((affectedFile: string) => {
      // Determine message type
      let type = 'reload';
      if (affectedFile.endsWith('.css')) {
        type = 'update-css';
      }

      // Normalize path for client (relative to root)
      const rel = '/' + path.relative(cfg.root, affectedFile);
      const msg = JSON.stringify({ type, path: rel });
      wss.clients.forEach((c: WebSocket) => c.send(msg));
    });
  });

  server.listen(port, () => log.success('Dev server listening on', port));
}
