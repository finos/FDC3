import express from 'express';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const BASE_PORT = 4010;

/**
 * Discovery utility for both front-end and server apps.
 */
function discoverApps(baseDir: string) {
  if (!fs.existsSync(baseDir)) return [];
  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => {
      const appPath = path.join(baseDir, dirent.name);
      return (
        dirent.isDirectory() &&
        dirent.name !== 'node_modules' &&
        dirent.name !== 'dist' &&
        fs.existsSync(path.join(appPath, 'index.html'))
      );
    })
    .map(dirent => ({
      name: dirent.name,
      root: path.join(baseDir, dirent.name),
    }));
}

const frontEndAppsDir = path.resolve(process.cwd(), 'front-end-apps');
const serverAppsDir = path.resolve(process.cwd(), 'server-apps');

const allApps = [...discoverApps(frontEndAppsDir), ...discoverApps(serverAppsDir)].sort((a, b) =>
  a.name.localeCompare(b.name)
);

// Assign ports, respecting properties.json if present
const apps = allApps.map((a, index) => {
  let port = BASE_PORT + index;
  const propPath = path.join(a.root, 'properties.json');
  if (fs.existsSync(propPath)) {
    try {
      const props = JSON.parse(fs.readFileSync(propPath, 'utf-8'));
      if (props.port) {
        port = props.port;
      }
    } catch (e) {
      console.error(`Failed to read properties.json for ${a.name}`, e);
    }
  }
  return {
    ...a,
    port,
  };
});

async function startApp(appName: string, appRoot: string, port: number) {
  const app = express();
  app.use(express.json());

  // Load backend if exists (mostly used in server-apps)
  const backendPath = path.join(appRoot, 'src', 'backend.ts');
  if (fs.existsSync(backendPath)) {
    try {
      const backendUrl = `file://${backendPath}`;
      const { default: backend } = await import(backendUrl);
      if (typeof backend === 'function') {
        backend(app);
      }
    } catch (e) {
      console.error({ appName, error: e }, 'Failed to load backend extension');
    }
  }

  // Mount the app's static director at /static/appName to match the expected URL structure
  // and legacy patterns from the demo.
  const staticPath = path.join(appRoot, 'static');
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
  }

  // Each app gets its own isolated Vite server
  const vite = await createServer({
    root: appRoot,
    server: {
      middlewareMode: true,
      hmr: {
        port: port + 100, // Avoid HMR port conflicts
      },
    },
    appType: 'spa',
    plugins: [react()],
  });

  app.use(vite.middlewares);

  // Serve index.html for unknown routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    const indexPath = path.join(appRoot, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });

  app.listen(port, () => {
    console.info({ appName, port, url: `http://localhost:${port}` }, 'Application server online');
  });
}

(async () => {
  if (apps.length === 0) {
    console.warn('No apps found to start.');
    return;
  }
  console.log(`Starting ${apps.length} applications from ${frontEndAppsDir} and ${serverAppsDir}...`);
  for (const a of apps) {
    try {
      await startApp(a.name, a.root, a.port);
    } catch (err) {
      console.error({ appName: a.name, error: err }, 'Failed to start application server');
    }
  }
})();
