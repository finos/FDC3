/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

// This test validates that all examples in each JSON schema in schemas/context are valid according to their schema.
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const sanitizeFilename = (filename: string) => filename.replace(/^(\.\.(\/|\\|$))+/, '');

describe('FDC3 Context Schema Example Validation', () => {
  const schemasDir = path.join(__dirname, '../schemas/context');
  const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));
  const ajv = new Ajv({ strict: false });
  addFormats(ajv);

  // Utility to recursively rewrite $ref values in a schema to use absolute $id URLs
  // This is necessary because many of the schema use relative paths like `../api/api.schema.json`
  // and we want to rewrite them to use the absolute $id URLs defined in the API schemas.
  function rewriteRefs(schema: any, refMap: Record<string, string>) {
    if (Array.isArray(schema)) {
      schema.forEach(item => rewriteRefs(item, refMap));
    } else if (typeof schema === 'object' && schema !== null) {
      for (const key of Object.keys(schema)) {
        if (key === '$ref' && typeof schema[key] === 'string') {
          const ref = schema[key];
          // Normalize path
          const normRef = ref.replace(/\\/g, '/');
          // Match ../api/api.schema.json or ..\\api\\api.schema.json
          const match = normRef.match(/^\.\.\/api\/(.+\.schema\.json)(#.*)?$/i);
          if (match) {
            const file = match[1];
            const fragment = match[2] || '';
            if (refMap[file]) {
              schema[key] = refMap[file] + fragment;
            }
          }
        } else {
          rewriteRefs(schema[key], refMap);
        }
      }
    }
  }

  // Load and map all API schemas
  // Use workspace root to resolve api schemas path
  const workspaceRoot = path.resolve(__dirname, '../../../');
  const apiSchemasDir = path.join(workspaceRoot, 'packages', 'fdc3-schema', 'schemas', 'api');
  let apiSchemas: { schemaFile: string; schema: any }[] = [];
  const refMap: Record<string, string> = {};
  if (fs.existsSync(apiSchemasDir)) {
    const apiSchemaFiles = fs.readdirSync(apiSchemasDir).filter(f => f.endsWith('.schema.json'));
    apiSchemas = apiSchemaFiles.map(schemaFile => {
      const schemaPath = path.join(apiSchemasDir, sanitizeFilename(schemaFile));
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      if (schema.$id) {
        refMap[schemaFile] = schema.$id;
      }
      return { schemaFile, schema };
    });
  }

  // Load and map all context schemas
  const schemas = schemaFiles.map(schemaFile => {
    const schemaPath = path.join(schemasDir, sanitizeFilename(schemaFile));
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    if (schema.$id) {
      refMap[schemaFile] = schema.$id;
    }
    return { schemaFile, schema };
  });

  // Rewrite $ref in all schemas to remove relative paths and use absolute $id URLs
  [...apiSchemas, ...schemas].forEach(({ schema }) => rewriteRefs(schema, refMap));

  // Register all schemas with Ajv
  [...apiSchemas, ...schemas].forEach(({ schemaFile, schema }) => {
    ajv.addSchema(schema, schema.$id || schemaFile);
  });

  schemas.forEach(({ schemaFile, schema }) => {
    const examples = schema.examples || (schema.example ? [schema.example] : []);
    // Use getSchema if $id is present, otherwise compile
    const validate = schema.$id ? ajv.getSchema(schema.$id) : ajv.compile(schema);

    if (examples.length === 0 && schemaFile !== 'context.schema.json') {
      // context.schema.json is the main schema and has no examples
      test(`${schemaFile} has no examples`, () => {
        fail(`${schemaFile} has no examples to validate.`);
      });
      return;
    }

    if (!validate) {
      test(`${schemaFile} validator could not be found`, () => {
        fail(`Validator for ${schemaFile} could not be found. Check if $id is set and schema was added to Ajv.`);
      });
      return;
    }

    examples.forEach((example: any, idx: number) => {
      test(`${schemaFile} example #${idx + 1} should be valid`, () => {
        const valid = validate(example);
        if (!valid) {
          console.error(validate.errors);
        }
        expect(valid).toBe(true);
      });
    });
  });
});
