import { When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { createMeta } from './generic.steps.js';
import {} from '@finos/fdc3-standard';
import { handleResolve } from '@finos/testing';
import { BrowserTypes } from '@finos/fdc3-schema';

type AddEventListenerRequest = BrowserTypes.AddEventListenerRequest;
type EventListenerUnsubscribeRequest = BrowserTypes.EventListenerUnsubscribeRequest;

When('{string} adds an event listener for {string}', (world: CustomWorld, app: string, type: string) => {
  const meta = createMeta(world, app);
  const resolvedType = handleResolve(type, world);

  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {
      type: resolvedType,
      channelId: null,
    },
    type: 'addEventListenerRequest',
  } as AddEventListenerRequest;

  world.server.receive(message, uuid);
});

When(
  '{string} adds an event listener for {string} on channel {string}',
  (world: CustomWorld, app: string, type: string, channelId: string) => {
    const meta = createMeta(world, app);
    const resolvedType = handleResolve(type, world);
    const resolvedChannelId = handleResolve(channelId, world);

    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        type: resolvedType,
        channelId: resolvedChannelId,
      },
      type: 'addEventListenerRequest',
    } as AddEventListenerRequest;

    world.server.receive(message, uuid);
  }
);

When(
  '{string} clears context {string} on {string}',
  (world: CustomWorld, app: string, contextType: string, channelId: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;

    const message = {
      meta,
      payload: {
        channelId: handleResolve(channelId, world),
        contextType: handleResolve(contextType, world),
      },
      type: 'clearContextRequest',
    } as BrowserTypes.ClearContextRequest;

    world.server.receive(message, uuid);
  }
);

When('{string} removes event listener with id {string}', (world: CustomWorld, app: string, id: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;

  const message = {
    meta,
    payload: {
      listenerUUID: id,
    },
    type: 'eventListenerUnsubscribeRequest',
  } as EventListenerUnsubscribeRequest;

  world.server.receive(message, uuid);
});
