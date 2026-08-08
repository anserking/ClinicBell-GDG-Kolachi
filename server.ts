import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import healthRouter from './server/routes/health';
import geminiRouter from './server/routes/gemini';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Modular API Routes
  app.use('/api/health', healthRouter);
  app.use('/api/gemini', geminiRouter);

  // Vite Dev Middleware vs Production Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sehat Loop PWA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
