/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Generates a runtime-accessible registry of the standardized FDC3 context
 * JSON Schemas. The JSON Schema files in `schemas/context` are the single
 * source of truth for context definitions, but historically they were only
 * available at build time (to generate `ContextTypes.ts`) and were not shipped
 * in the published package. This script inlines each schema into a generated
 * TypeScript module so that applications and tooling can discover the set of
 * standardized context types and retrieve their schemas programmatically.
 *
 * Usage: node generateContextSchemas.cjs <schemasDir> <outputFile>
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const schemasDir = args[0] || path.join('schemas', 'context');
const outputFile = args[1] || path.join('generated', 'context', 'ContextSchemas.ts');

/**
 * Recursively locate the `type` const that identifies a context type, e.g.
 * `{ properties: { type: { const: 'fdc3.instrument' } } }`. Standardized
 * context schemas declare this inside an `allOf` entry. The abstract base
 * (`context.schema.json`) declares `type` as a plain string with no const and
 * is therefore intentionally excluded from the registry.
 */
function findContextTypeId(node) {
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findContextTypeId(item);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object') {
    const typeConst = node.properties && node.properties.type && node.properties.type.const;
    if (typeof typeConst === 'string') {
      return typeConst;
    }
    for (const key of Object.keys(node)) {
      const found = findContextTypeId(node[key]);
      if (found) return found;
    }
  }
  return undefined;
}

const files = fs
  .readdirSync(schemasDir)
  .filter(f => f.endsWith('.schema.json'))
  .sort();

/** @type {Record<string, unknown>} */
const registry = {};
const skipped = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(schemasDir, file), 'utf-8');
  const schema = JSON.parse(raw);
  const typeId = findContextTypeId(schema);
  if (!typeId) {
    skipped.push(file);
    continue;
  }
  if (registry[typeId]) {
    throw new Error(`Duplicate context type id "${typeId}" found in ${file}`);
  }
  registry[typeId] = schema;
}

const orderedIds = Object.keys(registry).sort();
const ordered = {};
for (const id of orderedIds) {
  ordered[id] = registry[id];
}

const header = `/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/* eslint-disable */
// THIS IS A GENERATED FILE - DO NOT EDIT.
// Regenerate with \`npm run generate\` (see generateContextSchemas.cjs).
// Source of truth: packages/fdc3-context/schemas/context/*.schema.json

/**
 * The JSON Schema definitions for every standardized FDC3 context type, keyed
 * by their context \`type\` identifier (e.g. \`"fdc3.instrument"\`). Prefer the
 * accessor helpers exported from the package root (\`getContextSchema\`,
 * \`getContextTypes\`, etc.) over reading this object directly.
 */
`;

const body = `export const contextSchemas: Record<string, Record<string, unknown>> = ${JSON.stringify(
  ordered,
  null,
  2
)};\n`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, header + body, 'utf-8');

console.log(
  `Wrote ${orderedIds.length} context schemas to ${outputFile}` +
    (skipped.length ? ` (skipped non-typed schemas: ${skipped.join(', ')})` : '')
);
