/**
 * Smart EDU Server Entry Point (AI Studio & Node.js Production)
 * - Cổng 3000
 * - Tích hợp Vite middlewares trong môi trường dev
 * - Mount /api qua Express Adapter kết nối Server Core
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createExpressApiRouter } from './server/adapters/express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount API router
  app.use('/api', createExpressApiRouter());

  if (!isProd) {
    // Development mode: Sử dụng Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Phục vụ static files từ thư mục dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart EDU Server] Sẵn sàng tại http://0.0.0.0:${PORT} (Chế độ: ${isProd ? 'Production' : 'Development'})`);
  });
}

startServer().catch(err => {
  console.error('[Smart EDU Server] Lỗi khởi động:', err);
  process.exit(1);
});
