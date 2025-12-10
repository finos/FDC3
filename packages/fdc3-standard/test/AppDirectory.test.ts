import SwaggerParser from '@apidevtools/swagger-parser';
import { Validator } from 'jsonschema';
import { readFileSync } from 'fs';
import { join } from 'path';

// Get the directory path for loading schema and example files
const specificationDir = join(__dirname, '..', 'src', 'app-directory', 'specification');

describe('App Directory Schema Validation', () => {
  let api: unknown;
  let applicationSchema: unknown;
  let validator: Validator;

  beforeAll(async () => {
    // Parse and validate the OpenAPI schema
    api = await SwaggerParser.validate(join(specificationDir, 'appd.schema.json'));
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

    expect(result.valid).toBe(true);
    if (!result.valid) {
      console.error('Validation errors:', result.errors);
    }
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
