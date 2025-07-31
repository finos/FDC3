import express from 'express';
import path from 'path';

const app = express();
const PORT = 4005;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../../static')));

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

// Start server
app.listen(PORT, () => {
  console.log(`IDP App server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
