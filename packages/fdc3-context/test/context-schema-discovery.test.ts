/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

// Validates the programmatic context-schema discovery API exposed by the
// package: that every standardized context schema on disk is discoverable, that
// accessors return correct data, and that returned objects are defensive copies.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from 'vitest';
import {
  getContextTypes,
  getContextSchema,
  getAllContextSchemas,
  getContextSchemaMetadata,
  hasContextSchema,
} from '../src/contextSchemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemasDir = path.join(__dirname, '../schemas/context');

// The set of context type ids we expect to be discoverable, derived directly
// from the schema files (the single source of truth), excluding the abstract
// base context schema which has no `type` const.
function expectedTypeIds(): string[] {
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));
  const ids: string[] = [];
  for (const file of files) {
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf-8'));
    const found = findTypeConst(schema);
    if (found) ids.push(found);
  }
  return ids.sort();
}

function findTypeConst(node: unknown): string | undefined {
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findTypeConst(item);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, any>;
    const c = obj.properties?.type?.const;
    if (typeof c === 'string') return c;
    for (const key of Object.keys(obj)) {
      const found = findTypeConst(obj[key]);
      if (found) return found;
    }
  }
  return undefined;
}

describe('FDC3 Context Schema Discovery', () => {
  test('getContextTypes returns every standardized context type from disk', () => {
    expect(getContextTypes()).toEqual(expectedTypeIds());
  });

  test('the abstract base context type is not exposed as a standardized type', () => {
    expect(hasContextSchema('fdc3.context')).toBe(false);
    expect(getContextSchema('fdc3.context')).toBeUndefined();
  });

  test('known context types are discoverable', () => {
    expect(hasContextSchema('fdc3.instrument')).toBe(true);
    expect(hasContextSchema('fdc3.contact')).toBe(true);
    expect(hasContextSchema('made.up.type')).toBe(false);
  });

  test('getContextSchema returns the JSON Schema with the expected $id and type const', () => {
    const schema = getContextSchema('fdc3.instrument');
    expect(schema).toBeDefined();
    expect(schema?.$id).toBe('https://fdc3.finos.org/schemas/next/context/instrument.schema.json');
    expect(findTypeConst(schema)).toBe('fdc3.instrument');
  });

  test('getContextSchema returns undefined for unknown types', () => {
    expect(getContextSchema('made.up.type')).toBeUndefined();
  });

  test('every published schema is a well-formed object whose type const matches its registry key', () => {
    for (const type of getContextTypes()) {
      const schema = getContextSchema(type)!;
      expect(typeof schema, `${type} schema should be an object`).toBe('object');
      expect(schema.$id, `${type} schema should declare a $id`).toBeTypeOf('string');
      expect(schema.$schema, `${type} schema should declare a $schema`).toBeTypeOf('string');
      // The context `type` const embedded in the schema must equal the key it is
      // registered under, guaranteeing the registry is self-consistent.
      expect(findTypeConst(schema), `${type} schema type const should match its key`).toBe(type);
    }
  });

  test('getContextSchemaMetadata returns title, description and examples', () => {
    const meta = getContextSchemaMetadata('fdc3.instrument');
    expect(meta).toMatchObject({
      type: 'fdc3.instrument',
      title: 'Instrument',
      id: 'https://fdc3.finos.org/schemas/next/context/instrument.schema.json',
    });
    expect(typeof meta?.description).toBe('string');
    expect(Array.isArray(meta?.examples)).toBe(true);
    expect(meta!.examples.length).toBeGreaterThan(0);
  });

  test('getContextSchemaMetadata returns undefined for unknown types', () => {
    expect(getContextSchemaMetadata('made.up.type')).toBeUndefined();
  });

  test('accessors return defensive copies (mutations do not leak)', () => {
    const first = getContextSchema('fdc3.instrument')!;
    (first as Record<string, unknown>).$id = 'mutated';
    const second = getContextSchema('fdc3.instrument')!;
    expect(second.$id).toBe('https://fdc3.finos.org/schemas/next/context/instrument.schema.json');

    const all = getAllContextSchemas();
    delete all['fdc3.instrument'];
    expect(hasContextSchema('fdc3.instrument')).toBe(true);
  });

  test('getAllContextSchemas is consistent with getContextTypes', () => {
    expect(Object.keys(getAllContextSchemas()).sort()).toEqual(getContextTypes());
  });
});
