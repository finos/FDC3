/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { Channel, DesktopAgent, EventHandler, Listener } from '@finos/fdc3';
import { afterEach, describe, expect, it, vi } from 'vitest';
import systemLogStore from './SystemLogStore.js';
import { ChannelStore } from './ChannelStore.js';

const createListener = (): Listener => ({
  unsubscribe: vi.fn(),
});

describe('ChannelStore event support', () => {
  afterEach(() => {
    systemLogStore.logList = [];
  });

  it('updates the current user channel when a 2.2 event is received', async () => {
    const channels = [{ id: 'red' }, { id: 'green' }] as Channel[];
    let eventHandler: EventHandler | undefined;
    const agent = {
      getUserChannels: vi.fn().mockResolvedValue(channels),
      getCurrentChannel: vi.fn().mockResolvedValue(channels[0]),
      getInfo: vi.fn().mockResolvedValue({ fdc3Version: '2.2' }),
      addEventListener: vi.fn(async (_type: string, handler: EventHandler) => {
        eventHandler = handler;
        return createListener();
      }),
    } as unknown as DesktopAgent;
    const store = new ChannelStore(async () => agent, false);

    await store.getUserChannels();
    await store.listenForUserChannelChanges();
    eventHandler?.({
      type: 'userChannelChanged',
      details: { currentChannelId: 'green' },
    });

    expect(agent.addEventListener).toHaveBeenCalledWith('userChannelChanged', expect.any(Function));
    expect(store.isUserChannelChangedListenerActive).toBe(true);
    expect(store.currentUserChannel).toEqual(channels[1]);
    expect(systemLogStore.logList.at(-1)?.message).toBe('User channel changed to [green]');
  });

  it('clears the current user channel when the event reports no channel', async () => {
    const channel = { id: 'red' } as Channel;
    let eventHandler: EventHandler | undefined;
    const agent = {
      getUserChannels: vi.fn().mockResolvedValue([channel]),
      getCurrentChannel: vi.fn().mockResolvedValue(channel),
      getInfo: vi.fn().mockResolvedValue({ fdc3Version: '3.0.0' }),
      addEventListener: vi.fn(async (_type: string, handler: EventHandler) => {
        eventHandler = handler;
        return createListener();
      }),
    } as unknown as DesktopAgent;
    const store = new ChannelStore(async () => agent, false);

    await store.getUserChannels();
    await store.listenForUserChannelChanges();
    eventHandler?.({
      type: 'userChannelChanged',
      details: { currentChannelId: null },
    });

    expect(store.currentUserChannel).toBeNull();
  });

  it('does not register the new event API for FDC3 2.1', async () => {
    const agent = {
      getInfo: vi.fn().mockResolvedValue({ fdc3Version: '2.1' }),
      addEventListener: vi.fn(),
    } as unknown as DesktopAgent;
    const store = new ChannelStore(async () => agent, false);

    await store.listenForUserChannelChanges();

    expect(agent.addEventListener).not.toHaveBeenCalled();
    expect(store.isUserChannelChangedListenerActive).toBe(false);
  });
});
