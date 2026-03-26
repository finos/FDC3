/**
 * Integration tests that run the sample scripts in-process by calling runExample() directly.
 */
import { beforeAll, describe, it, jest } from '@jest/globals';
import { runExample as runBackendEncryptedChannel } from '../samples/backend-encrypted-channel-example';
import { runExample as runFrontendEncryptedChannel } from '../samples/frontend-encrypted-channel-example';
import { runExample as runGetUser } from '../samples/get-user-example';
import { runExample as runSigningBroadcast } from '../samples/signing-broadcast-example';
import { runExample as runSigningIntent } from '../samples/signing-intent-example';

const TIMEOUT_MS = 25000;

describe('Samples integration', () => {
  /** Per-suite timeout; `it(name, fn, ms)` works at runtime but @types/jest often omits the 3rd overload. */
  beforeAll(() => {
    jest.setTimeout(TIMEOUT_MS);
  });

  it('backend-encrypted-channel-example runs to completion', async () => {
    await runBackendEncryptedChannel();
  });

  it('frontend-encrypted-channel-example runs to completion', async () => {
    await runFrontendEncryptedChannel();
  });

  it('signing-broadcast-example runs to completion', async () => {
    await runSigningBroadcast();
  });

  it('get-user-example runs to completion', async () => {
    await runGetUser();
  });

  it('signing-intent-example runs to completion', async () => {
    await runSigningIntent();
  });
});
