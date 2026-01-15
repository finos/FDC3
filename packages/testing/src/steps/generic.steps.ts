import { Given, When, Then } from 'quickpickle';
import { DataTable } from '@cucumber/cucumber';
import { PropsWorldLike } from '../world/PropsWorldLike.js';
import * as impl from './generic.impl.js';

export function setupGenericSteps(schemaBasePath: string): void {
  Then('the promise {string} should resolve', async (world: PropsWorldLike, field: string) => {
    await impl.promiseShouldResolve(world, field);
  });

  Then('the promise {string} should resolve within 10 seconds', async (world: PropsWorldLike, field: string) => {
    await impl.promiseShouldResolveWithin10Seconds(world, field);
  });

  When('I call {string} with {string}', async (world: PropsWorldLike, field: string, fnName: string) => {
    await impl.callWithMethod(world, field, fnName);
  });

  When(
    'I call {string} with {string} with parameter {string}',
    async (world: PropsWorldLike, field: string, fnName: string, param: string) => {
      await impl.callWithMethodAndParam(world, field, fnName, param);
    }
  );

  When(
    'I call {string} with {string} with parameters {string} and {string}',
    async (world: PropsWorldLike, field: string, fnName: string, param1: string, param2: string) => {
      await impl.callWithMethodAndTwoParams(world, field, fnName, param1, param2);
    }
  );

  When(
    'I call {string} with {string} with parameters {string} and {string} and {string}',
    async (world: PropsWorldLike, field: string, fnName: string, param1: string, param2: string, param3: string) => {
      await impl.callWithMethodAndThreeParams(world, field, fnName, param1, param2, param3);
    }
  );

  When('I refer to {string} as {string}', (world: PropsWorldLike, from: string, to: string) => {
    impl.referToAs(world, from, to);
  });

  Then(
    '{string} is an array of objects with the following contents',
    (world: PropsWorldLike, field: string, dt: DataTable) => {
      impl.isArrayOfObjectsWithContents(world, field, dt);
    }
  );

  Then(
    '{string} is an array of objects with length {string}',
    (world: PropsWorldLike, field: string, field2: string) => {
      impl.isArrayOfObjectsWithLength(world, field, field2);
    }
  );

  Then(
    '{string} is an array of strings with the following values',
    (world: PropsWorldLike, field: string, dt: DataTable) => {
      impl.isArrayOfStringsWithValues(world, field, dt);
    }
  );

  Then(
    '{string} is an object with the following contents',
    (world: PropsWorldLike, field: string, params: DataTable) => {
      impl.isObjectWithContents(world, field, params);
    }
  );

  Then('{string} is null', (world: PropsWorldLike, field: string) => {
    impl.isNull(world, field);
  });

  Then('{string} is not null', (world: PropsWorldLike, field: string) => {
    impl.isNotNull(world, field);
  });

  Then('{string} is true', (world: PropsWorldLike, field: string) => {
    impl.isTrue(world, field);
  });

  Then('{string} is false', (world: PropsWorldLike, field: string) => {
    impl.isFalse(world, field);
  });

  Then('{string} is undefined', (world: PropsWorldLike, field: string) => {
    impl.isUndefined(world, field);
  });

  Then('{string} is empty', (world: PropsWorldLike, field: string) => {
    impl.isEmpty(world, field);
  });

  Then('{string} is {string}', (world: PropsWorldLike, field: string, expected: string) => {
    impl.isEqual(world, field, expected);
  });

  Then('{string} is an error with message {string}', (world: PropsWorldLike, field: string, errorType: string) => {
    impl.isErrorWithMessage(world, field, errorType);
  });

  Then('{string} is an error', (world: PropsWorldLike, field: string) => {
    impl.isError(world, field);
  });

  Given(
    '{string} is a invocation counter into {string}',
    (world: PropsWorldLike, handlerName: string, field: string) => {
      impl.isInvocationCounter(world, handlerName, field);
    }
  );

  Given(
    '{string} is a function which returns a promise of {string}',
    (world: PropsWorldLike, fnName: string, field: string) => {
      impl.isFunctionReturningPromiseOf(world, fnName, field);
    }
  );

  Given('we wait for a period of {string} ms', (world: PropsWorldLike, ms: string) => {
    return impl.waitForPeriod(world, ms);
  });

  Given('schemas loaded', async (world: PropsWorldLike) => {
    await impl.schemasLoaded(world, schemaBasePath);
  });
}
