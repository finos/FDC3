import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { createRequire } from 'module';
import { ContextTypes } from '../src/context/ContextType.js';

const require = createRequire(import.meta.url);

/**
 * Extracts the fdc3 context type string from a schema file by finding
 * the "const" value of the "type" property.
 */
function extractContextType(schemaPath: string): string | null {
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  for (const entry of schema.allOf ?? []) {
    const typeConst = entry?.properties?.type?.const;
    if (typeof typeConst === 'string' && typeConst.startsWith('fdc3.')) {
      return typeConst;
    }
  }
  return null;
}

/**
 * Reads all context schemas from the fdc3-context package and returns
 * the set of fdc3.* type strings they define.
 */
function getSchemaContextTypes(): Set<string> {
  const fdc3ContextEntry = require.resolve('@finos/fdc3-context');
  const schemasDir = resolve(dirname(fdc3ContextEntry), '../schemas/context');
  const types = new Set<string>();

  for (const file of readdirSync(schemasDir)) {
    if (!file.endsWith('.schema.json')) continue;
    const contextType = extractContextType(resolve(schemasDir, file));
    if (contextType) types.add(contextType);
  }

  return types;
}

describe('Context type definitions stay in sync with fdc3-context schemas', () => {
  const schemaTypes = getSchemaContextTypes();
  const enumValues = new Set(Object.values(ContextTypes));

  it('should find context types in the schemas', () => {
    expect(schemaTypes.size).toBeGreaterThan(0);
  });

  it('ContextTypes enum should include every schema-defined context type', () => {
    const missingFromEnum = [...schemaTypes].filter(t => !enumValues.has(t)).sort();

    if (missingFromEnum.length > 0) {
      console.error(
        '\n❌ Context types defined in fdc3-context schemas but missing from ContextTypes enum:\n' +
          missingFromEnum.map(t => `  • ${t}`).join('\n')
      );
    }

    expect(missingFromEnum).toEqual([]);
  });
});
