/**
 * Integration tests that run the sample scripts in-process by calling runExample() directly.
 */
import { runExample as runEncryptedPrivateChannel } from '../samples/encrypted-private-channel-example';
import { runExample as runGetUser } from '../samples/get-user-example';
import { runExample as runSigningBroadcast } from '../samples/signing-broadcast-example';

const TIMEOUT_MS = 15000;

describe('Samples integration', () => {
  it(
    'encrypted-private-channel-example runs to completion',
    async () => {
      await runEncryptedPrivateChannel();
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
});
