import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { createMeta } from './generic.steps';
import {} from '@finos/fdc3-standard';
import { handleResolve } from '@finos/testing';
import { BrowserTypes } from '@finos/fdc3-schema';

type AddEventListenerRequest = BrowserTypes.AddEventListenerRequest;
type EventListenerUnsubscribeRequest = BrowserTypes.EventListenerUnsubscribeRequest;

When('{string} adds an event listener for {string}', function (this: CustomWorld, app: string, type: string) {
  const meta = createMeta(this, app);
  const resolvedType = handleResolve(type, this);

  const uuid = this.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {
      type: resolvedType,
    },
    type: 'addEventListenerRequest',
  } as AddEventListenerRequest;

  this.server.receive(message, uuid);
});

When('{string} removes event listener with id {string}', function (this: CustomWorld, app: string, id: string) {
  const meta = createMeta(this, app);
  const uuid = this.sc.getInstanceUUID(meta.source)!;

  const message = {
    meta,
    payload: {
      listenerUUID: id,
    },
    type: 'eventListenerUnsubscribeRequest',
  } as EventListenerUnsubscribeRequest;

  this.server.receive(message, uuid);
});
