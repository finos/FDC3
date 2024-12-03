import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { createMeta } from './generic.steps';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { handleResolve } from '@kite9/testing';

type GetUserChannelsRequest = BrowserTypes.GetUserChannelsRequest;
type GetCurrentChannelRequest = BrowserTypes.GetCurrentChannelRequest;
type JoinUserChannelRequest = BrowserTypes.JoinUserChannelRequest;
type LeaveCurrentChannelRequest = BrowserTypes.LeaveCurrentChannelRequest;
type GetCurrentContextRequest = BrowserTypes.GetCurrentContextRequest;

When('{string} gets the list of user channels', function (this: CustomWorld, app: string) {
  const meta = createMeta(this, app);
  const uuid = this.sc.getInstanceUUID(meta.source)!!;
  const message = {
    meta,
    payload: {},
    type: 'getUserChannelsRequest',
  } as GetUserChannelsRequest;

  this.server.receive(message, uuid);
});

When('{string} gets the current user channel', function (this: CustomWorld, app: string) {
  const meta = createMeta(this, app);
  const uuid = this.sc.getInstanceUUID(meta.source)!!;
  const message = {
    meta,
    payload: {},
    type: 'getCurrentChannelRequest',
  } as GetCurrentChannelRequest;

  this.server.receive(message, uuid);
});

When('{string} leaves user channel {string}', function (this: CustomWorld, app: string, _channel: string) {
  const meta = createMeta(this, app);
  const uuid = this.sc.getInstanceUUID(meta.source)!!;
  const message = {
    meta,
    payload: {},
    type: 'leaveCurrentChannelRequest',
  } as LeaveCurrentChannelRequest;

  this.server.receive(message, uuid);
});

When('{string} joins user channel {string}', function (this: CustomWorld, app: string, channel: string) {
  const meta = createMeta(this, app);
  const uuid = this.sc.getInstanceUUID(meta.source)!!;
  const message = {
    meta,
    payload: {
      channelId: handleResolve(channel, this),
    },
    type: 'joinUserChannelRequest',
  } as JoinUserChannelRequest;

  this.server.receive(message, uuid);
});

When(
  '{string} gets the latest context on {string} with type {string}',
  function (this: CustomWorld, app: string, channel: string, type: string) {
    const meta = createMeta(this, app);
    const uuid = this.sc.getInstanceUUID(meta.source)!!;
    const message = {
      meta,
      payload: {
        channelId: handleResolve(channel, this),
        contextType: handleResolve(type, this),
      },
      type: 'getCurrentContextRequest',
    } as GetCurrentContextRequest;

    this.server.receive(message, uuid);
  }
);
