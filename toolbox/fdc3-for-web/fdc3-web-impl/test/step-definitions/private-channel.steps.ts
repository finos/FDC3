import { When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { createMeta } from './generic.steps.js';
import { BrowserTypes } from '@finos/fdc3-schema';
import { handleResolve } from '@finos/testing';

type CreatePrivateChannelRequest = BrowserTypes.CreatePrivateChannelRequest;
type PrivateChannelAddEventListenerRequest = BrowserTypes.PrivateChannelAddEventListenerRequest;
type PrivateChannelUnsubscribeEventListenerRequest = BrowserTypes.PrivateChannelUnsubscribeEventListenerRequest;
type PrivateChannelDisconnectRequest = BrowserTypes.PrivateChannelDisconnectRequest;

When('{string} creates a private channel', (world: CustomWorld, app: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {},
    type: 'createPrivateChannelRequest',
  } as CreatePrivateChannelRequest;

  world.server.receive(message, uuid);
});

When('{string} removes event listener {string}', (world: CustomWorld, app: string, listenerUUID: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {
      listenerUUID,
    },
    type: 'privateChannelUnsubscribeEventListenerRequest',
  } as PrivateChannelUnsubscribeEventListenerRequest;

  world.server.receive(message, uuid);
});

When(
  '{string} adds an {string} event listener on {string}',
  (world: CustomWorld, app: string, listenerType: string, channelId: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        privateChannelId: handleResolve(channelId, world),
        listenerType,
      },
      type: 'privateChannelAddEventListenerRequest',
    } as PrivateChannelAddEventListenerRequest;

    world.server.receive(message, uuid);
  }
);

When('{string} disconnects from private channel {string}', (world: CustomWorld, app: string, channelId: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;

  const message = {
    meta,
    payload: {
      channelId: handleResolve(channelId, world),
    },
    type: 'privateChannelDisconnectRequest',
  } as PrivateChannelDisconnectRequest;

  world.server.receive(message, uuid);
});
