import { When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { createMeta } from './generic.steps.js';
import { handleResolve } from '@finos/testing';
import { BrowserTypes } from '@finos/fdc3-schema';
type GetOrCreateChannelRequest = BrowserTypes.GetOrCreateChannelRequest;

When('{string} creates or gets an app channel called {string}', (world: CustomWorld, app: string, channel: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {
      channelId: handleResolve(channel, world),
    },
    type: 'getOrCreateChannelRequest',
  } as GetOrCreateChannelRequest;

  world.server.receive(message, uuid);
});
