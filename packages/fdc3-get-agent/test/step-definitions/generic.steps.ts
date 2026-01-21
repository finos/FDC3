import { Given, When, Then } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { handleResolve, matchData, doesRowMatch } from '@finos/testing';
import { DataTable } from '@cucumber/cucumber';
import { expect } from 'vitest';
import Ajv2019 from 'ajv/dist/2019.js';
import * as draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';

Then('the promise {string} should resolve', async (world: CustomWorld, field: string) => {
  try {
    const promise = handleResolve(field, world);
    const object = await promise;
    world.props['result'] = object;
  } catch (error) {
    world.props['result'] = error;
  }
});

Then('the promise {string} should resolve within 10 seconds', async (world: CustomWorld, field: string) => {
  try {
    const promise = handleResolve(field, world);
    const object = await promise;
    world.props['result'] = object;
  } catch (error) {
    world.props['result'] = error;
  }
});

When('I call {string} with {string}', async (world: CustomWorld, field: string, fnName: string) => {
  try {
    const object = handleResolve(field, world);
    const fn = object[fnName];
    const result = await fn.call(object);
    world.props['result'] = result;
  } catch (error) {
    world.props['result'] = error;
  }
});

When(
  'I call {string} with {string} with parameter {string}',
  async (world: CustomWorld, field: string, fnName: string, param: string) => {
    try {
      const object = handleResolve(field, world);
      const fn = object[fnName];
      const result = await fn.call(object, handleResolve(param, world));
      world.props['result'] = result;
    } catch (error) {
      world.props['result'] = error;
    }
  }
);

When(
  'I call {string} with {string} with parameters {string} and {string}',
  async (world: CustomWorld, field: string, fnName: string, param1: string, param2: string) => {
    try {
      const object = handleResolve(field, world);
      const fn = object[fnName];
      const result = await fn.call(object, handleResolve(param1, world), handleResolve(param2, world));
      world.props['result'] = result;
    } catch (error) {
      world.props['result'] = error;
    }
  }
);

When(
  'I call {string} with {string} with parameters {string} and {string} and {string}',
  async (world: CustomWorld, field: string, fnName: string, param1: string, param2: string, param3: string) => {
    try {
      const object = handleResolve(field, world);
      const fn = object[fnName];
      const result = await fn.call(
        object,
        handleResolve(param1, world),
        handleResolve(param2, world),
        handleResolve(param3, world)
      );
      world.props['result'] = result;
    } catch (error) {
      world.props['result'] = error;
    }
  }
);

When('I refer to {string} as {string}', async (world: CustomWorld, from: string, to: string) => {
  world.props[to] = handleResolve(from, world);
});

Then(
  '{string} is an array of objects with the following contents',
  (world: CustomWorld, field: string, dt: DataTable) => {
    matchData(world, handleResolve(field, world), dt);
  }
);

Then('{string} is an array of objects with length {string}', (world: CustomWorld, field: string, field2: string) => {
  expect(handleResolve(field, world).length).toEqual(Number.parseInt(handleResolve(field2, world)));
});

Then(
  '{string} is an array of strings with the following values',
  (world: CustomWorld, field: string, dt: DataTable) => {
    const values = handleResolve(field, world).map((s: string) => {
      return { value: s };
    });
    matchData(world, values, dt);
  }
);

Then('{string} is an object with the following contents', (world: CustomWorld, field: string, params: DataTable) => {
  const table = params.hashes();
  expect(doesRowMatch(world, table[0], handleResolve(field, world))).toBeTruthy();
});

Then('{string} is null', (world: CustomWorld, field: string) => {
  expect(handleResolve(field, world)).toBeNull();
});

Then('{string} is not null', (world: CustomWorld, field: string) => {
  expect(handleResolve(field, world)).toBeDefined();
});

Then('{string} is true', (world: CustomWorld, field: string) => {
  expect(handleResolve(field, world)).toBeTruthy();
});

Then('{string} is false', (world: CustomWorld, field: string) => {
  expect(handleResolve(field, world)).toBeFalsy();
});

Then('{string} is undefined', (world: CustomWorld, field: string) => {
  expect(handleResolve(field, world)).toBeUndefined();
});

Then('{string} is empty', (world: CustomWorld, field: string) => {
  expect(handleResolve(field, world)).toHaveLength(0);
});

Then('{string} is {string}', (world: CustomWorld, field: string, expected: string) => {
  const fVal = handleResolve(field, world);
  const eVal = handleResolve(expected, world);
  expect('' + fVal).toEqual('' + eVal);
});

Then('{string} is an error with message {string}', (world: CustomWorld, field: string, errorType: string) => {
  expect(handleResolve(field, world)['message']).toBe(errorType);
});

Then('{string} is an error', (world: CustomWorld, field: string) => {
  expect(handleResolve(field, world)).toBeInstanceOf(Error);
});

Given('{string} is a invocation counter into {string}', (world: CustomWorld, handlerName: string, field: string) => {
  world.props[handlerName] = () => {
    let amount: number = world.props[field];
    amount++;
    world.props[field] = amount;
  };
  world.props[field] = 0;
});

Given(
  '{string} is a function which returns a promise of {string}',
  (world: CustomWorld, fnName: string, field: string) => {
    const value = handleResolve(field, world);
    world.props[fnName] = async () => {
      return value;
    };
  }
);

Given('we wait for a period of {string} ms', (world: CustomWorld, ms: string) => {
  return new Promise<void>((resolve, _reject) => {
    setTimeout(() => resolve(), parseInt(ms));
  });
});

Given('schemas loaded', async (world: CustomWorld) => {
  const ajv = new Ajv2019();
  ajv.addMetaSchema(draft7MetaSchema);
  addFormats(ajv);

  const schemaDir = path.join(import.meta.dirname, '../../../fdc3-schema/schemas');
  const contextDir = path.join(import.meta.dirname, '../../../fdc3-context/schemas');

  const abspath = path.join(schemaDir, 'api');

  try {
    fs.readdirSync(abspath).forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(abspath, file);
        const contents = fs.readFileSync(filePath, 'utf8');
        const schema = JSON.parse(contents);
        ajv.addSchema(schema);
      }
    });
  } catch (error) {
    console.log(error);
  }

  const contextPath = path.join(contextDir, 'context/context.schema.json');
  const contents = fs.readFileSync(contextPath, 'utf8');
  const schema = JSON.parse(contents);
  ajv.addSchema(schema);

  world.props['ajv'] = ajv;
});
