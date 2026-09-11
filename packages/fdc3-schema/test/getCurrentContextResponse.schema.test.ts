/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { describe, expect, test } from 'vitest';

const dirname = path.dirname(fileURLToPath(import.meta.url));

function addSchemasFrom(ajv: Ajv, directory: string): void {
  for (const filename of fs.readdirSync(directory).filter(file => file.endsWith('.schema.json'))) {
    const schema = JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8'));
    ajv.addSchema(schema, schema.$id ?? filename);
  }
}

describe('getCurrentContextResponse success payload', () => {
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  addSchemasFrom(ajv, path.resolve(dirname, '../schemas/api'));
  addSchemasFrom(ajv, path.resolve(dirname, '../../fdc3-context/schemas/context'));

  const validate = ajv.getSchema(
    'https://fdc3.finos.org/schemas/next/api/getCurrentContextResponse.schema.json#/$defs/GetCurrentContextSuccessResponsePayload'
  );
  const context = { type: 'fdc3.instrument', name: 'Apple', id: { ticker: 'AAPL' } };
  const metadata = {
    source: { appId: 'test-app', instanceId: 'test-instance' },
    timestamp: new Date().toISOString(),
    traceId: 'test-trace-id',
  };

  test.each([
    ['context with complete metadata', { context, metadata }, true],
    ['null context with null metadata', { context: null, metadata: null }, true],
    ['context with null metadata', { context, metadata: null }, false],
    ['context with omitted metadata', { context }, false],
    ['null context with object metadata', { context: null, metadata }, false],
    ['null context with omitted metadata', { context: null }, false],
    ['omitted context', { metadata }, false],
  ])('%s is %s', (_name, payload, expected) => {
    expect(validate, 'schema validator should be registered').toBeDefined();
    expect(validate!(payload), JSON.stringify(validate!.errors)).toBe(expected);
  });
});
