import express from 'express';
import path from 'path';

const app = express();
const PORT = 4003;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/static')));

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

// Start server
app.listen(PORT, () => {
  console.log(`App1 server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Serving static files from: ${path.join(__dirname, '../client/static')}`);
});

export default app;
