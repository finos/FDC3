import { Given, Then, When } from 'quickpickle';
import { handleResolve, quickpickleWrapStep, setupGenericSteps } from '@robmoffat/standard-cucumber-steps';
import { CustomWorld } from '../world';
import { PropsWorldLike } from '../../../../../../../cucumber/standard-cucumber-steps/typescript/dist';

setupGenericSteps({ Given, When, Then, wrapStep: quickpickleWrapStep });

function isPromiseLike(value: unknown): boolean {
  return value != null && typeof (value as PromiseLike<unknown>).then === 'function';
}

Given('the promise {string} should resolve', async (world: CustomWorld, field: string) => {
  const promise = handleResolve(field, world);
  if (!isPromiseLike(promise)) {
    world.log(
      `Expected "{${field}}" to be a promise, got ${promise === null ? 'null' : typeof promise}: ${JSON.stringify(promise)}`
    );
    throw new Error(`Expected "${field}" to be a promise`);
  }
  try {
    const result = await promise;
    world.props['result'] = result;
  } catch (error) {
    world.props['result'] = error;
  }
});

export function isFunctionReturningPromiseOf(world: PropsWorldLike, fnName: string, field: string): void {
  const value = handleResolve(field, world);
  world.props[fnName] = async () => {
    return value;
  };
}

Given(
  '{string} is a function which returns a promise of {string}',
  (world: PropsWorldLike, fnName: string, field: string) => {
    isFunctionReturningPromiseOf(world, fnName, field);
  }
);

export async function promiseShouldResolveWithin10Seconds(world: PropsWorldLike, field: string): Promise<void> {
  try {
    const promise = handleResolve(field, world) as Promise<unknown>;
    const object = await promise;
    world.props['result'] = object;
  } catch (error) {
    world.props['result'] = error;
  }
}

Then('the promise {string} should resolve within 10 seconds', async (world: PropsWorldLike, field: string) => {
  await promiseShouldResolveWithin10Seconds(world, field);
});
