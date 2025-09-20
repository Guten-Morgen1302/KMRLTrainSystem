#!/usr/bin/env node

import express from 'express';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import routes from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT || '5000', 10);

async function createApp() {
  const app = express();
  const httpServer = createHttpServer(app);

  // Add JSON parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add API routes
  app.use(routes);

  if (!isProduction) {
    // Development mode: create Vite server with proper WebSocket handling
    const vite = await createServer({
      server: { 
        middlewareMode: true,
        hmr: { server: httpServer }
      },
      appType: 'spa',
      root: resolve(__dirname, '../client'),
    });
    
    app.use(vite.middlewares);
    
    // Note: WebSocket handling for HMR is automatically managed by Vite when using hmr.server option
  } else {
    // Production mode: serve static files
    app.use(express.static(resolve(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(resolve(__dirname, '../client/dist/index.html'));
    });
  }

  return { app, httpServer };
}

createApp().then(({ app, httpServer }) => {
  const server = httpServer.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Metro Yukthi server running at http://localhost:${port}`);
    console.log(`📊 API available at http://localhost:${port}/api`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  });
  
  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Trying port ${port + 1}...`);
      const fallbackPort = port + 1;
      const fallbackServer = httpServer.listen(fallbackPort, '0.0.0.0', () => {
        console.log(`🚀 Metro Yukthi server running at http://localhost:${fallbackPort} (fallback port)`);
        console.log(`📊 API available at http://localhost:${fallbackPort}/api`);
        console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
        console.log(`🌐 External access available via Replit's port mapping`);
      });
      
      fallbackServer.on('error', (fallbackError: any) => {
        console.error('Fallback server error:', fallbackError);
        process.exit(1);
      });
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });
}).catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});