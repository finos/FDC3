/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Ajv } from 'ajv';
import addFormats from 'ajv-formats';
import type { PropsWorldLike } from '@robmoffat/standard-cucumber-steps';

const FDC3_SCHEMA_PACKAGE = '@finos/fdc3-schema';

/** Resolve this package's root from this module's location (works from test/, dist/, or node_modules). */
function resolveFdc3SchemaPackageRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { name?: string };
        if (pkg.name === FDC3_SCHEMA_PACKAGE) {
          return dir;
        }
      } catch {
        // ignore invalid package.json
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error(`${FDC3_SCHEMA_PACKAGE} package root not found (walked up from ${fileURLToPath(import.meta.url)})`);
}

function loadJsonSchemasFromDir(ajv: Ajv, dir: string): void {
  if (!fs.existsSync(dir)) {
    throw new Error(`Schema directory not found: ${dir}`);
  }
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.json')) {
      const contents = fs.readFileSync(path.join(dir, file), 'utf8');
      ajv.addSchema(JSON.parse(contents));
    }
  }
}

export function loadSchemasIntoWorld(world: PropsWorldLike): void {
  const ajv = new Ajv({ strict: false });
  (addFormats as unknown as (instance: Ajv) => Ajv)(ajv);

  const pkgRoot = resolveFdc3SchemaPackageRoot();
  loadJsonSchemasFromDir(ajv, path.join(pkgRoot, 'schemas', 'api'));

  const contextSchemaPath = path.join(pkgRoot, '..', 'fdc3-context', 'schemas', 'context', 'context.schema.json');
  if (!fs.existsSync(contextSchemaPath)) {
    throw new Error(`Context schema not found: ${contextSchemaPath}`);
  }
  const contextSchema = JSON.parse(fs.readFileSync(contextSchemaPath, 'utf8'));
  ajv.addSchema(contextSchema);

  world.props['ajv'] = ajv;
}
