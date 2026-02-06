import { PropsWorldLike } from '../world/PropsWorldLike.js';
import { handleResolve, matchData, doesRowMatch, HashesProvider } from '../support/matching.js';
import { expect } from 'vitest';
import * as AjvModule from 'ajv/dist/2019.js';
import * as draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json' with { type: 'json' };
import * as addFormatsModule from 'ajv-formats';
import fs from 'fs';
import path from 'path';

// Workaround for AJV ESM default export
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AjvCtor = (AjvModule as any).default ?? AjvModule;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addFormatsFn = (addFormatsModule as any).default ?? addFormatsModule;

export async function promiseShouldResolve(world: PropsWorldLike, field: string): Promise<void> {
  try {
    const promise = handleResolve(field, world) as Promise<unknown>;
    const object = await promise;
    world.props['result'] = object;
  } catch (error) {
    world.props['result'] = error;
  }
}

export async function promiseShouldResolveWithin10Seconds(world: PropsWorldLike, field: string): Promise<void> {
  try {
    const promise = handleResolve(field, world) as Promise<unknown>;
    const object = await promise;
    world.props['result'] = object;
  } catch (error) {
    world.props['result'] = error;
  }
}

export async function callWithMethod(world: PropsWorldLike, field: string, fnName: string): Promise<void> {
  try {
    const object = handleResolve(field, world) as Record<string, (...args: unknown[]) => unknown>;
    const fn = object[fnName];
    const result = await fn.call(object);
    world.props['result'] = result;
  } catch (error) {
    world.props['result'] = error;
  }
}

export async function callWithMethodAndParam(
  world: PropsWorldLike,
  field: string,
  fnName: string,
  param: string
): Promise<void> {
  try {
    const object = handleResolve(field, world) as Record<string, (...args: unknown[]) => unknown>;
    const fn = object[fnName];
    const result = await fn.call(object, handleResolve(param, world));
    world.props['result'] = result;
  } catch (error) {
    world.props['result'] = error;
  }
}

export async function callWithMethodAndTwoParams(
  world: PropsWorldLike,
  field: string,
  fnName: string,
  param1: string,
  param2: string
): Promise<void> {
  try {
    const object = handleResolve(field, world) as Record<string, (...args: unknown[]) => unknown>;
    const fn = object[fnName];
    const result = await fn.call(object, handleResolve(param1, world), handleResolve(param2, world));
    world.props['result'] = result;
  } catch (error) {
    world.props['result'] = error;
  }
}

export async function callWithMethodAndThreeParams(
  world: PropsWorldLike,
  field: string,
  fnName: string,
  param1: string,
  param2: string,
  param3: string
): Promise<void> {
  try {
    const object = handleResolve(field, world) as Record<string, (...args: unknown[]) => unknown>;
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

export function referToAs(world: PropsWorldLike, from: string, to: string): void {
  world.props[to] = handleResolve(from, world);
}

export function isArrayOfObjectsWithContents(world: PropsWorldLike, field: string, dt: HashesProvider): void {
  matchData(world, handleResolve(field, world) as unknown[], dt);
}

export function isArrayOfObjectsWithLength(world: PropsWorldLike, field: string, field2: string): void {
  expect((handleResolve(field, world) as unknown[]).length).toEqual(
    Number.parseInt(handleResolve(field2, world) as string)
  );
}

export function isArrayOfStringsWithValues(world: PropsWorldLike, field: string, dt: HashesProvider): void {
  const values = (handleResolve(field, world) as string[]).map((s: string) => {
    return { value: s };
  });
  matchData(world, values, dt);
}

export function isObjectWithContents(world: PropsWorldLike, field: string, params: HashesProvider): void {
  const table = params.hashes();
  expect(doesRowMatch(world, table[0], handleResolve(field, world))).toBeTruthy();
}

export function isNull(world: PropsWorldLike, field: string): void {
  expect(handleResolve(field, world)).toBeNull();
}

export function isNotNull(world: PropsWorldLike, field: string): void {
  expect(handleResolve(field, world)).toBeDefined();
}

export function isTrue(world: PropsWorldLike, field: string): void {
  expect(handleResolve(field, world)).toBeTruthy();
}

export function isFalse(world: PropsWorldLike, field: string): void {
  expect(handleResolve(field, world)).toBeFalsy();
}

export function isUndefined(world: PropsWorldLike, field: string): void {
  expect(handleResolve(field, world)).toBeUndefined();
}

export function isEmpty(world: PropsWorldLike, field: string): void {
  expect(handleResolve(field, world)).toHaveLength(0);
}

export function isEqual(world: PropsWorldLike, field: string, expected: string): void {
  const fVal = handleResolve(field, world);
  const eVal = handleResolve(expected, world);
  expect('' + fVal).toEqual('' + eVal);
}

export function isErrorWithMessage(world: PropsWorldLike, field: string, errorType: string): void {
  expect((handleResolve(field, world) as { message: string })['message']).toBe(errorType);
}

export function isError(world: PropsWorldLike, field: string): void {
  expect(handleResolve(field, world)).toBeInstanceOf(Error);
}

export function isInvocationCounter(world: PropsWorldLike, handlerName: string, field: string): void {
  world.props[handlerName] = () => {
    let amount = world.props[field] as number;
    amount++;
    world.props[field] = amount;
  };
  world.props[field] = 0;
}

export function isFunctionReturningPromiseOf(world: PropsWorldLike, fnName: string, field: string): void {
  const value = handleResolve(field, world);
  world.props[fnName] = async () => {
    return value;
  };
}

export function waitForPeriod(_world: PropsWorldLike, ms: string): Promise<void> {
  return new Promise<void>((resolve, _reject) => {
    setTimeout(() => resolve(), parseInt(ms));
  });
}

export async function schemasLoaded(world: PropsWorldLike, schemaBasePath: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ajv = new AjvCtor() as any;
  ajv.addMetaSchema(draft7MetaSchema);
  addFormatsFn(ajv);

  const schemaDir = path.join(schemaBasePath, 'fdc3-schema/schemas');
  const contextDir = path.join(schemaBasePath, 'fdc3-context/schemas');

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
}
