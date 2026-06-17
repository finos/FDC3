/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 *
 * Integration tests that run the sample scripts in-process by calling runExample() directly.
 */
import { beforeAll, describe, it, jest } from '@jest/globals';
import { runExample as runBackendEncryptedChannel } from '../samples/backend-encrypted-channel-example';
import { runExample as runFrontendEncryptedChannel } from '../samples/frontend-encrypted-channel-example';
import { runExample as runGetUser } from '../samples/get-user-example';
import { runExample as runSigningBroadcast } from '../samples/signing-broadcast-example';
import { runExample as runSigningIntent } from '../samples/signing-intent-example';

const TIMEOUT_MS = 25000;

/** Simulated Desktop Agent API levels exercised against each sample. */
const SAMPLE_FDC3_VERSIONS = ['2.2', '3.0'] as const;

describe('Samples integration', () => {
  beforeAll(() => {
    jest.setTimeout(TIMEOUT_MS);
  });

  it.each(SAMPLE_FDC3_VERSIONS)('backend-encrypted-channel-example runs to completion (FDC3 %s)', async fdc3Version => {
    await runBackendEncryptedChannel(fdc3Version);
  });

  it.each(SAMPLE_FDC3_VERSIONS)(
    'frontend-encrypted-channel-example runs to completion (FDC3 %s)',
    async fdc3Version => {
      await runFrontendEncryptedChannel(fdc3Version);
    }
  );

  it.each(SAMPLE_FDC3_VERSIONS)('signing-broadcast-example runs to completion (FDC3 %s)', async fdc3Version => {
    await runSigningBroadcast(fdc3Version);
  });

  it.each(SAMPLE_FDC3_VERSIONS)('get-user-example runs to completion (FDC3 %s)', async fdc3Version => {
    await runGetUser(fdc3Version);
  });

  it.each(SAMPLE_FDC3_VERSIONS)('signing-intent-example runs to completion (FDC3 %s)', async fdc3Version => {
    await runSigningIntent(fdc3Version);
  });
});
