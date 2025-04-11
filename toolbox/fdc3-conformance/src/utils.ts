import { assert } from 'chai';
import constants from './constants';

export function failAfterTimeout(timeoutMs: number = constants.WaitTime): Promise<void> {
  return new Promise<void>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Test timed out after ${timeoutMs} ms`));
    }, timeoutMs);
  });
}

export async function wait(timeoutMs?: number): Promise<void> {
  const { promise, timeout } = sleep(timeoutMs);
  return promise;
}

export function wrapPromise(): {
  promise: Promise<void>;
  resolve: () => void;
  reject: (reason?: any) => void;
} {
  let wrapperResolve;
  let wrapperReject;
  const promise = new Promise<void>((resolve, reject) => {
    wrapperResolve = resolve;
    wrapperReject = reject;
  });
  return { promise, resolve: wrapperResolve, reject: wrapperReject };
}

export function failOnTimeout(errorMessage) {
  let timeout = window.setTimeout(() => {
    assert.fail(errorMessage);
  }, constants.WaitTime);
  return timeout;
}
