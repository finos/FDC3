#!/usr/bin/env node
/**
 * SPDX-License-Identifier: Apache-2.0
 * Serve the built conformance site shipped in this package.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = path.join(packageRoot, 'dist');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`PORT must be an integer from 1 to 65535 (received ${process.env.PORT}).`);
  process.exit(1);
}

if (!existsSync(siteRoot)) {
  console.error(`Conformance site not found at ${siteRoot}. Run npm run build in toolbox/fdc3-conformance first.`);
  process.exit(1);
}

/**
 * @param {string | undefined} rawUrl
 * @returns {{ pathname: string, resolved: string } | null}
 */
function locate(rawUrl) {
  let pathname;
  try {
    pathname = new URL(rawUrl ?? '/', 'http://localhost').pathname;
  } catch {
    return null;
  }
  const relative = decodeURIComponent(pathname).replace(/^[/\\]+/, '');
  const resolved = path.resolve(siteRoot, relative);
  if (resolved !== siteRoot && !resolved.startsWith(siteRoot + path.sep)) {
    return null;
  }
  return { pathname, resolved };
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    res.end();
    return;
  }

  const located = locate(req.url);
  if (!located) {
    res.writeHead(400);
    res.end();
    return;
  }

  let filePath = located.resolved;
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    if (!located.pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${located.pathname}/` });
      res.end();
      return;
    }
    filePath = path.join(filePath, 'index.html');
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const contentType = mimeTypes[path.extname(filePath)] ?? 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  const origin = `http://localhost:${port}`;
  console.log(`FDC3 conformance apps: ${origin}/apps/app/`);
  console.log(`Local App Directory: ${origin}/directories/localhost-conformance.json`);
});
