import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';

const PORT = 4004;
const app = express();

// Start server with ViteExpress
const httpServer = ViteExpress.listen(app, PORT, () => {
  console.log(`App2 server running on http://localhost:${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, '../client/static')}`);
});

export default app;
