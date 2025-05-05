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
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, timeoutMs);
  });
}

export function wrapPromise(): {
  promise: Promise<void>;
  resolve: () => void;
  reject: (reason?: any) => void;
} {
  let wrapperResolve: (() => void) | undefined;
  let wrapperReject: ((reason?: any) => void) | undefined;

  const promise = new Promise<void>((resolve, reject) => {
    wrapperResolve = resolve;
    wrapperReject = reject;
  });

  return {
    promise,
    resolve: wrapperResolve!,
    reject: wrapperReject!,
  };
}

export function handleFail(documentation: string, ex: any): never {
  const message = ex instanceof Error ? ex.message : String(ex);
  assert.fail(documentation + message);
}
