import fs from 'fs';
import path from 'path';

/**
 * Microsoft Entra ID configuration (stored in `properties.json` next to this app).
 * Register `redirectUri` (and SPA redirect) in Azure for the same URL / port.
 */

export interface EntraConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  tenantId: string;
}

type PropertiesFile = {
  port?: number;
  entra?: Partial<EntraConfig>;
};

function resolveWithinRoot(root: string, ...segments: string[]): string {
  const normalizedRoot = path.resolve(root);
  const resolvedPath = path.resolve(normalizedRoot, ...segments);
  if (resolvedPath !== normalizedRoot && !resolvedPath.startsWith(`${normalizedRoot}${path.sep}`)) {
    throw new Error(`Resolved path escapes app root: ${resolvedPath}`);
  }
  return resolvedPath;
}

/** Server-only: read `properties.json` from the app root (same folder as `index.html`). */
export function loadEntraConfig(appRoot: string): EntraConfig {
  const propPath = resolveWithinRoot(appRoot, 'properties.json');
  const raw = fs.readFileSync(propPath, 'utf-8');
  const props = JSON.parse(raw) as PropertiesFile;
  const e = props.entra;
  if (!e?.clientId || !e.authority || !e.tenantId) {
    throw new Error(`properties.json must include "entra": { "clientId", "authority", "tenantId" } (${propPath})`);
  }
  const redirectUri = e.redirectUri ?? (props.port != null ? `http://localhost:${props.port}` : undefined);
  if (!redirectUri) {
    throw new Error(`properties.json: set "entra.redirectUri" or top-level "port" (${propPath})`);
  }
  return {
    clientId: e.clientId,
    authority: e.authority,
    tenantId: e.tenantId,
    redirectUri,
  };
}
