import SwaggerParser from '@apidevtools/swagger-parser';
import { Validator } from 'jsonschema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { beforeAll, expect, it, describe } from 'vitest';

// Get the directory path for loading schema and example files
const specificationDir = join(__dirname, '..', 'src', 'app-directory', 'specification');

describe('App Directory Schema Validation', () => {
  let api: unknown;
  let applicationSchema: unknown;
  let validator: Validator;

  beforeAll(async () => {
    // Parse and validate the OpenAPI schema
    const schemaPath = join(specificationDir, 'appd.schema.json');
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    api = await SwaggerParser.validate(schema);
    applicationSchema = (api as { components: { schemas: { Application: unknown } } }).components.schemas.Application;
    validator = new Validator();
  });

  it('should have valid API name and version', () => {
    const apiInfo = (api as { info: { title: string; version: string } }).info;
    expect(apiInfo.title).toBeDefined();
    expect(apiInfo.version).toBeDefined();
  });

  it('should only expose v2 routes and schemas', () => {
    const currentApi = api as {
      paths: Record<string, unknown>;
      components: { schemas: Record<string, unknown> };
    };

    expect(currentApi.paths['/v2/apps']).toBeDefined();
    expect(currentApi.paths['/v2/apps/{appId}']).toBeDefined();
    expect(Object.keys(currentApi.paths).filter(path => path.startsWith('/v1/'))).toEqual([]);
    expect(Object.keys(currentApi.components.schemas).filter(schema => schema.endsWith('V1'))).toEqual([]);
  });

  it('should validate myApplication.json example against the Application schema', () => {
    const examplePath = join(specificationDir, 'examples', 'application', 'myApplication.json');
    const exampleApplication = JSON.parse(readFileSync(examplePath, 'utf-8'));

    const result = validator.validate(exampleApplication, applicationSchema);

    if (!result.valid) {
      throw new Error(`Validation errors: ${JSON.stringify(result.errors, null, 2)}`);
    }
    expect(result.valid).toBe(true);
  });

  it('should validate fdc3-workbench.json example against the Application schema', () => {
    const examplePath = join(specificationDir, 'examples', 'application', 'fdc3-workbench.json');
    const exampleApplication = JSON.parse(readFileSync(examplePath, 'utf-8'));

    const result = validator.validate(exampleApplication, applicationSchema);

    expect(result.valid).toBe(true);
    if (!result.valid) {
      console.error('Validation errors:', result.errors);
    }
  });
});
