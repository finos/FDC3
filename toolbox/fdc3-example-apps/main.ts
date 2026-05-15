import express, { type Request } from 'express';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

/** This package (`packages/fdc3-example-apps`), not `process.cwd()` (workspace runs may use repo root). */
const packageRoot = __dirname;
const frontEndAppsDir = path.join(packageRoot, 'front-end-apps');
const serverAppsDir = path.join(packageRoot, 'server-apps');
/** Shared browser + Node demo utilities (Vite may import outside each app `root`). */
const securityDemoDir = path.join(packageRoot, 'common', 'src', 'security-demo');
const generatedAppdPath = path.join(packageRoot, 'directory', 'static/generated', 'fdc3-example-apps.json');

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

type AppWithPort = { name: string; root: string; port: number };

function buildCombinedAppDirectory(appsList: AppWithPort[]) {
  const combined = {
    applications: [] as any[],
    message: 'OK',
  };

  for (const a of appsList) {
    const appdPath = path.join(a.root, 'static', 'appd.v2.json');
    if (fs.existsSync(appdPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(appdPath, 'utf-8'));
        if (Array.isArray(content.applications)) {
          combined.applications.push(...content.applications);
        }
      } catch (e) {
        console.error(`Failed to read appd.v2.json for ${a.name}`, e);
      }
    }
  }

  return combined;
}

function writeGeneratedAppDirectory(combined: { applications: any[]; message: string }) {
  const dir = path.dirname(generatedAppdPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(generatedAppdPath, `${JSON.stringify(combined, null, 4)}\n`, 'utf-8');
  console.info({ path: generatedAppdPath }, 'Wrote generated app directory');
}

async function startApp(appName: string, appRoot: string, port: number) {
  const app = express();
  app.use(express.json());

  // Load backend if exists (mostly used in server-apps). Receives the shared HTTP server
  // so WebSocket + JWKS can bind to the same port as Express + Vite.
  const backendPath = path.join(appRoot, 'src', 'backend.ts');
  const server = http.createServer(app);
  if (fs.existsSync(backendPath)) {
    try {
      const backendUrl = `file://${backendPath}`;
      const { default: backend } = await import(backendUrl);
      if (typeof backend === 'function') {
        const result = backend(app, server, { port, appRoot });
        if (result != null && typeof (result as Promise<void>).then === 'function') {
          await result;
        }
      }
    } catch (e) {
      console.error({ appName, error: e }, 'Failed to load backend extension');
    }
  }

  // Mount the app's static directory at /static/appName to match the expected URL structure
  // and legacy patterns from the demo.
  const staticPath = path.join(appRoot, 'static');
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
  }

  // Each app gets its own isolated Vite server
  const vite = await createServer({
    root: appRoot,
    cacheDir: path.join(appRoot, '.vite'),
    server: {
      middlewareMode: true,
      fs: {
        allow: [appRoot, securityDemoDir, packageRoot],
      },
      hmr: {
        port: port + 100, // Avoid HMR port conflicts
      },
    },
    appType: 'spa',
    plugins: [react()],
  });

  app.use(vite.middlewares);

  const spaIndexLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => req.path.startsWith('/api'),
  });

  // Serve index.html for unknown routes
  app.get('*', spaIndexLimiter, (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    const indexPath = path.join(appRoot, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });

  server.listen(port, () => {
    console.info(`Application ${appName} online`, `http://localhost:${port}`);
  });
}

(async () => {
  if (apps.length === 0) {
    console.warn('No apps found to start.');
    return;
  }

  const combinedAppd = buildCombinedAppDirectory(apps);
  writeGeneratedAppDirectory(combinedAppd);

  // Start the apps
  for (const a of apps) {
    try {
      await startApp(a.name, a.root, a.port);
    } catch (err) {
      console.error({ appName: a.name, error: err }, 'Failed to start application server');
    }
  }

  // host the directory files
  const propPath = path.join('directory', 'properties.json');
  const props = JSON.parse(fs.readFileSync(propPath, 'utf-8'));
  await startApp('directory', path.join(packageRoot, 'directory'), props.port);
})();
