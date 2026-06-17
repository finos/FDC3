// @vitest-environment node
import SwaggerParser from '@apidevtools/swagger-parser';
import { Validator } from 'jsonschema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { beforeAll, expect, it, describe } from 'vitest';

const schemasDir = join(__dirname, '..', '..', 'fdc3-schema', 'schemas');
const contextSchemaPath = join(__dirname, '..', '..', 'fdc3-context', 'schemas', 'context', 'context.schema.json');

/** api.schema.json references context types outside fdc3-schema. */
const schemaParserOptions = {
  resolve: {
    file: {
      canRead: true,
      read(file: { url: string }) {
        if (file.url.endsWith('context/context.schema.json')) {
          return readFileSync(contextSchemaPath, 'utf-8');
        }
        return readFileSync(file.url, 'utf-8');
      },
    },
  },
};

describe('App Directory Schema Validation', () => {
  let api: unknown;
  let applicationSchema: unknown;
  let validator: Validator;

  beforeAll(async () => {
    const schemaPath = join(schemasDir, 'appd.schema.json');
    api = await SwaggerParser.validate(schemaPath, schemaParserOptions);
    const dereferenced = await SwaggerParser.dereference(schemaPath, schemaParserOptions);
    applicationSchema = (dereferenced as { components: { schemas: { Application: unknown } } }).components.schemas
      .Application;
    validator = new Validator();
  });

  it('should have valid API name and version', () => {
    const apiInfo = (api as { info: { title: string; version: string } }).info;
    expect(apiInfo.title).toBeDefined();
    expect(apiInfo.version).toBeDefined();
  });

  it('should validate myApplication.json example against the Application schema', () => {
    const examplePath = join(schemasDir, 'appDirectory', 'examples', 'application', 'myApplication.json');
    const exampleApplication = JSON.parse(readFileSync(examplePath, 'utf-8'));

    const result = validator.validate(exampleApplication, applicationSchema);

    if (!result.valid) {
      throw new Error(`Validation errors: ${JSON.stringify(result.errors, null, 2)}`);
    }
    expect(result.valid).toBe(true);
  });

  it('should validate fdc3-workbench.json example against the Application schema', () => {
    const examplePath = join(schemasDir, 'appDirectory', 'examples', 'application', 'fdc3-workbench.json');
    const exampleApplication = JSON.parse(readFileSync(examplePath, 'utf-8'));

    const result = validator.validate(exampleApplication, applicationSchema);

    expect(result.valid).toBe(true);
    if (!result.valid) {
      console.error('Validation errors:', result.errors);
    }
  });
});
