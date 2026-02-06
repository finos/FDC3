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
    },
    type: 'addEventListenerRequest',
  } as AddEventListenerRequest;

  world.server.receive(message, uuid);
});

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
