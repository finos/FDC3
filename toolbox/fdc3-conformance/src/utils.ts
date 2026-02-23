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
  reject: (reason?: unknown) => void;
} {
  let wrapperResolve: (() => void) | undefined;
  let wrapperReject: ((reason?: unknown) => void) | undefined;

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

export function handleFail(documentation: string, ex: unknown): never {
  const message = ex instanceof Error ? ex.message : String(ex);
  assert.fail(documentation + message);
}

/**
 * Checks whether a received appId matches an expected unqualified appId.
 * Accepts either an exact match (e.g. 'MockAppId') or a fully qualified
 * appId with the current hostname (e.g. 'MockAppId@localhost').
 */
export function appIdMatches(received: string, expected: string): boolean {
  if (received === expected) {
    return true;
  }

  const host = window.location.hostname;
  return received === `${expected}@${host}`;
}
