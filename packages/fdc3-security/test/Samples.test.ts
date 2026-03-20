/**
 * Integration tests that run the sample scripts in-process by calling runExample() directly.
 */
import { runExample as runBackendEncryptedChannel } from '../samples/backend-encrypted-channel-example';
import { runExample as runFrontendEncryptedChannel } from '../samples/frontend-encrypted-channel-example';
import { runExample as runGetUser } from '../samples/get-user-example';
import { runExample as runSigningBroadcast } from '../samples/signing-broadcast-example';
import { runExample as runSigningIntent } from '../samples/signing-intent-example';

const TIMEOUT_MS = 25000;

describe('Samples integration', () => {
  it(
    'backend-encrypted-channel-example runs to completion',
    async () => {
      await runBackendEncryptedChannel();
    },
    TIMEOUT_MS
  );

  it(
    'frontend-encrypted-channel-example runs to completion',
    async () => {
      await runFrontendEncryptedChannel();
    },
    TIMEOUT_MS
  );

  it(
    'signing-broadcast-example runs to completion',
    async () => {
      await runSigningBroadcast();
    },
    TIMEOUT_MS
  );

  it(
    'get-user-example runs to completion',
    async () => {
      await runGetUser();
    },
    TIMEOUT_MS
  );

  it(
    'signing-intent-example runs to completion',
    async () => {
      await runSigningIntent();
    },
    TIMEOUT_MS
  );
});
