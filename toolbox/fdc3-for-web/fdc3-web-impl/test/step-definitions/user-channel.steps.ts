import { When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { createMeta } from './generic.steps.js';
import { BrowserTypes } from '@finos/fdc3-schema';
import { handleResolve } from '@finos/testing';

type GetUserChannelsRequest = BrowserTypes.GetUserChannelsRequest;
type GetCurrentChannelRequest = BrowserTypes.GetCurrentChannelRequest;
type JoinUserChannelRequest = BrowserTypes.JoinUserChannelRequest;
type LeaveCurrentChannelRequest = BrowserTypes.LeaveCurrentChannelRequest;
type GetCurrentContextRequest = BrowserTypes.GetCurrentContextRequest;

When('{string} gets the list of user channels', (world: CustomWorld, app: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {},
    type: 'getUserChannelsRequest',
  } as GetUserChannelsRequest;

  world.server.receive(message, uuid);
});

When('{string} gets the current user channel', (world: CustomWorld, app: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {},
    type: 'getCurrentChannelRequest',
  } as GetCurrentChannelRequest;

  world.server.receive(message, uuid);
});

When('{string} leaves the current user channel', (world: CustomWorld, app: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {},
    type: 'leaveCurrentChannelRequest',
  } as LeaveCurrentChannelRequest;

  world.server.receive(message, uuid);
});

When('{string} joins user channel {string}', (world: CustomWorld, app: string, channel: string) => {
  const meta = createMeta(world, app);
  const uuid = world.sc.getInstanceUUID(meta.source)!;
  const message = {
    meta,
    payload: {
      channelId: handleResolve(channel, world),
    },
    type: 'joinUserChannelRequest',
  } as JoinUserChannelRequest;

  world.server.receive(message, uuid);
});

When(
  '{string} gets the latest context on {string} with type {string}',
  (world: CustomWorld, app: string, channel: string, type: string) => {
    const meta = createMeta(world, app);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        channelId: handleResolve(channel, world),
        contextType: handleResolve(type, world),
      },
      type: 'getCurrentContextRequest',
    } as GetCurrentContextRequest;

    world.server.receive(message, uuid);
  }
);
