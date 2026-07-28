import { When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { createMeta } from './generic.steps.js';
import {} from '@finos/fdc3-standard';
import { handleResolve, parseAntiReplayClaims } from '@finos/testing';
import { contextMap } from './generic.steps.js';
import { BrowserTypes } from '@finos/fdc3-schema';

type AddContextListenerRequest = BrowserTypes.AddContextListenerRequest;
type ContextListenerUnsubscribeRequest = BrowserTypes.ContextListenerUnsubscribeRequest;
type BroadcastRequest = BrowserTypes.BroadcastRequest;
type GetCurrentContextRequest = BrowserTypes.GetCurrentContextRequest;

When(
  '{string} adds a context listener on {string} with type {string}',
  (world: CustomWorld, app: string, channelId: string, contextType: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        channelId: handleResolve(channelId, world),
        contextType: handleResolve(contextType, world),
      },
      type: 'addContextListenerRequest',
    } as AddContextListenerRequest;

    world.server.receive(message, uuid);
  }
);

When(
  '{string} adds a user-channel context listener with type {string}',
  (world: CustomWorld, app: string, contextType: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        channelId: null, // null indicates it's added at the DesktopAgent level and listens on the current user-channel
        contextType: handleResolve(contextType, world),
      },
      type: 'addContextListenerRequest',
    } as AddContextListenerRequest;

    world.server.receive(message, uuid);
  }
);

When(
  '{string} asks for the latest context on {string} with type {string}',
  (world: CustomWorld, app: string, channelId: string, contextType: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        channelId: handleResolve(channelId, world),
        contextType,
      },
      type: 'getCurrentContextRequest',
    } as GetCurrentContextRequest;

    world.server.receive(message, uuid);
  }
);

When('{string} removes context listener with id {string}', (world: CustomWorld, app: string, id: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;

  const message = {
    meta,
    payload: {
      listenerUUID: id,
    },
    type: 'contextListenerUnsubscribeRequest',
  } as ContextListenerUnsubscribeRequest;

  world.server.receive(message, uuid);
});

When(
  '{string} broadcasts {string} on {string}',
  (world: CustomWorld, app: string, contextType: string, channelId: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;

    const message = {
      meta,
      payload: {
        channelId: handleResolve(channelId, world),
        context: contextMap[contextType],
      },
      type: 'broadcastRequest',
    } as BroadcastRequest;

    world.server.receive(message, uuid);
  }
);

When(
  '{string} broadcasts {string} on {string} with metadata traceId {string} signature {string} antiReplay claims {string} and custom key {string}',
  (
    world: CustomWorld,
    app: string,
    contextType: string,
    channelId: string,
    traceId: string,
    signature: string,
    antiReplayClaims: string,
    customKey: string
  ) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;

    const message = {
      meta,
      payload: {
        channelId: handleResolve(channelId, world),
        context: contextMap[contextType],
        metadata: {
          traceId: handleResolve(traceId, world),
          signature: {
            signature: handleResolve(signature, world) + ' (signature part)',
            protected: handleResolve(signature, world) + ' (protected part)',
          },
          custom: { region: handleResolve(customKey, world) },
          antiReplay: parseAntiReplayClaims(antiReplayClaims),
        },
      },
      type: 'broadcastRequest',
    } as BroadcastRequest;

    world.server.receive(message, uuid);
  }
);

When(
  '{string} broadcasts {string} on {string} without metadata',
  (world: CustomWorld, app: string, contextType: string, channelId: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;

    const message = {
      meta,
      payload: {
        channelId: handleResolve(channelId, world),
        context: contextMap[contextType],
      },
      type: 'broadcastRequest',
    } as BroadcastRequest;

    world.server.receive(message, uuid);
  }
);
