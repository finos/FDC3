import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { createMeta } from './generic.steps';
import { BrowserTypes } from '@finos/fdc3-schema';
import { handleResolve } from '@finos/fdc3-testing';

type CreatePrivateChannelRequest = BrowserTypes.CreatePrivateChannelRequest;
type PrivateChannelAddEventListenerRequest = BrowserTypes.PrivateChannelAddEventListenerRequest;
type PrivateChannelUnsubscribeEventListenerRequest = BrowserTypes.PrivateChannelUnsubscribeEventListenerRequest;
type PrivateChannelDisconnectRequest = BrowserTypes.PrivateChannelDisconnectRequest;

When('{string} creates a private channel', function (this: CustomWorld, app: string) {
  const meta = createMeta(this, app);
  const uuid = this.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {},
    type: 'createPrivateChannelRequest',
  } as CreatePrivateChannelRequest;

  this.server.receive(message, uuid);
});

When('{string} removes event listener {string}', function (this: CustomWorld, app: string, listenerUUID: string) {
  const meta = createMeta(this, app);
  const uuid = this.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {
      listenerUUID,
    },
    type: 'privateChannelUnsubscribeEventListenerRequest',
  } as PrivateChannelUnsubscribeEventListenerRequest;

  this.server.receive(message, uuid);
});

When(
  '{string} adds an {string} event listener on {string}',
  function (this: CustomWorld, app: string, listenerType: string, channelId: string) {
    const meta = createMeta(this, app);
    const uuid = this.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        privateChannelId: handleResolve(channelId, this),
        listenerType,
      },
      type: 'privateChannelAddEventListenerRequest',
    } as PrivateChannelAddEventListenerRequest;

    this.server.receive(message, uuid);
  }
);

When(
  '{string} disconnects from private channel {string}',
  function (this: CustomWorld, app: string, channelId: string) {
    const meta = createMeta(this, app);
    const uuid = this.sc.getInstanceUUID(meta.source)!;

    const message = {
      meta,
      payload: {
        channelId: handleResolve(channelId, this),
      },
      type: 'privateChannelDisconnectRequest',
    } as PrivateChannelDisconnectRequest;

    this.server.receive(message, uuid);
  }
);
