import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';

const app = express();
const PORT = 4005;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/static')));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'idp-app', port: PORT });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'IDP App Server Running',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Start server with ViteExpress
const httpServer = ViteExpress.listen(app, PORT, () => {
  console.log(`IDP App server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Serving static files from: ${path.join(__dirname, '../client/static')}`);
});

export default app;
