import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';

const PORT = 4003;
const app = express();

app.get('/iframe', (_, res) => {
  res.send('Hello Vite + TypeScript!');
});

ViteExpress.listen(app, 4000, () => console.log('App1 is listening on port 4003'));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'app1', port: PORT });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'App1 Server Running',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Start server with ViteExpress
const httpServer = ViteExpress.listen(app, PORT, () => {
  console.log(`App1 server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Serving static files from: ${path.join(__dirname, '../client/static')}`);
});

export default app;
