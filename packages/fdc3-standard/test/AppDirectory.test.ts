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

  it('should define fdc3Version as an optional npm-style version range field', () => {
    const baseApplicationSchema = (
      api as { components: { schemas: { BaseApplication: { properties: Record<string, unknown> } } } }
    ).components.schemas.BaseApplication;
    const fdc3Version = baseApplicationSchema.properties.fdc3Version as {
      type: string;
      format: string;
      description: string;
    };

    expect(fdc3Version).toBeDefined();
    expect(fdc3Version.type).toBe('string');
    expect(fdc3Version.format).toBe('semver-range');
    expect(fdc3Version.description).toContain('npm-style semantic version range');
    expect(fdc3Version.description).toContain('`2.2`');
    expect(fdc3Version.description).toContain('`<=2.3`');
    expect(fdc3Version.description).toContain('`^2.2`');
    expect(fdc3Version.description).toContain('`>=2.2`');
  });
});
