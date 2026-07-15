/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { contextSchemas } from '../generated/context/ContextSchemas.js';

/**
 * A JSON Schema (draft-07) definition for a standardized FDC3 context type, as
 * published in the FDC3 Standard. Represented as a plain object so that it can
 * be handed directly to any JSON Schema validator (e.g. Ajv).
 */
export type ContextSchema = Record<string, unknown>;

/**
 * Lightweight, human- and machine-readable metadata describing a standardized
 * context type, extracted from its JSON Schema. Useful for building resolvers,
 * documentation, form UIs or agent tooling that needs to reason about the set
 * of available context types without parsing the full schema.
 */
export interface ContextSchemaMetadata {
  /** The context `type` identifier, e.g. `"fdc3.instrument"`. */
  type: string;
  /** The schema `title`, if present, e.g. `"Instrument"`. */
  title?: string;
  /** The schema `description`, if present. */
  description?: string;
  /** The canonical `$id` URL of the schema, if present. */
  id?: string;
  /** Example context objects declared by the schema (may be empty). */
  examples: unknown[];
}

/**
 * Returns the list of standardized FDC3 context type identifiers for which a
 * JSON Schema is published (e.g. `"fdc3.instrument"`, `"fdc3.contact"`),
 * sorted alphabetically.
 *
 * ```javascript
 * import { getContextTypes } from '@finos/fdc3-context';
 * const types = getContextTypes();
 * // ["fdc3.action", "fdc3.chart", "fdc3.contact", ...]
 * ```
 */
export function getContextTypes(): string[] {
  return Object.keys(contextSchemas).sort();
}

/**
 * Returns the JSON Schema for a standardized FDC3 context type, or `undefined`
 * if the type is not a standardized type. The returned object is a copy and may
 * be safely mutated by the caller.
 *
 * ```javascript
 * import { getContextSchema } from '@finos/fdc3-context';
 * const schema = getContextSchema('fdc3.instrument');
 * // pass to a JSON Schema validator to check a context object
 * ```
 */
export function getContextSchema(type: string): ContextSchema | undefined {
  const schema = contextSchemas[type];
  return schema ? structuredClone(schema) : undefined;
}

/**
 * Returns a map of every standardized FDC3 context type identifier to its JSON
 * Schema. The returned map and schemas are copies and may be safely mutated.
 */
export function getAllContextSchemas(): Record<string, ContextSchema> {
  return structuredClone(contextSchemas);
}

/**
 * Returns lightweight metadata (title, description, `$id` and examples) for a
 * standardized FDC3 context type, or `undefined` if the type is not
 * standardized.
 *
 * ```javascript
 * import { getContextSchemaMetadata } from '@finos/fdc3-context';
 * const meta = getContextSchemaMetadata('fdc3.instrument');
 * // { type: 'fdc3.instrument', title: 'Instrument', description: '...', examples: [...] }
 * ```
 */
export function getContextSchemaMetadata(type: string): ContextSchemaMetadata | undefined {
  const schema = contextSchemas[type];
  if (!schema) {
    return undefined;
  }
  const examples = Array.isArray(schema.examples)
    ? (schema.examples as unknown[])
    : schema.example !== undefined
      ? [schema.example]
      : [];
  return {
    type,
    ...(typeof schema.title === 'string' ? { title: schema.title } : {}),
    ...(typeof schema.description === 'string' ? { description: schema.description } : {}),
    ...(typeof schema.$id === 'string' ? { id: schema.$id } : {}),
    examples: structuredClone(examples),
  };
}

/**
 * Returns `true` if the supplied context `type` identifier corresponds to a
 * standardized FDC3 context type with a published JSON Schema.
 *
 * Note: `@finos/fdc3-standard` also exports an `isStandardContextType` type
 * guard; this package deliberately does not export one of the same name to
 * avoid an ambiguous re-export from the `@finos/fdc3` roll-up. Use
 * `getContextSchema(type) !== undefined` for a schema-backed check.
 */
export function hasContextSchema(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(contextSchemas, type);
}
