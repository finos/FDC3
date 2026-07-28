/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '@finos/fdc3-context';
import type { ContextMetadata } from '@finos/fdc3-standard';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { MockChannel } from './mocks/MockChannel';

describe('DefaultFDC3Handlers', () => {
  it('exercises default no-op implementations for coverage', async () => {
    const handlers = new DefaultFDC3Handlers();
    const channel = new MockChannel('ch-default', 'app');

    await expect(handlers.handleRemoteChannel('purpose', channel)).resolves.toBeUndefined();

    const intentHandler = await handlers.remoteIntentHandler('SomeIntent');
    await expect(intentHandler({ type: 'fdc3.nothing' } as Context, {} as ContextMetadata)).resolves.toBeUndefined();

    await expect(handlers.exchangeData('any-purpose', {})).resolves.toBeUndefined();
  });
});
