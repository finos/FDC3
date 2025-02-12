import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { createMeta } from './generic.steps';
import { handleResolve } from '@finos/testing';
import { BrowserTypes } from '@finos/fdc3-schema';
type GetOrCreateChannelRequest = BrowserTypes.GetOrCreateChannelRequest;

When(
  '{string} creates or gets an app channel called {string}',
  function (this: CustomWorld, app: string, channel: string) {
    const meta = createMeta(this, app);
    const uuid = this.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        channelId: handleResolve(channel, this),
      },
      type: 'getOrCreateChannelRequest',
    } as GetOrCreateChannelRequest;

    this.server.receive(message, uuid);
  }
);
