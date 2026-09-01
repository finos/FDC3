/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { DesktopAgent, EventHandler, Listener, PrivateChannel } from '@finos/fdc3';
import { afterEach, describe, expect, it, vi } from 'vitest';
import systemLogStore from './SystemLogStore.js';
import { PrivateChannelStore } from './PrivateChannelStore.js';

const createListener = (): Listener => ({
  unsubscribe: vi.fn().mockResolvedValue(undefined),
});

interface PrivateChannelHarness {
  channel: PrivateChannel;
  eventHandlers: Map<string, EventHandler>;
  eventListeners: Listener[];
  legacyHandlers: {
    addContextListener?: (contextType?: string) => void;
    unsubscribe?: (contextType?: string) => void;
    disconnect?: () => void;
  };
  addEventListener: ReturnType<typeof vi.fn>;
}

const createPrivateChannelHarness = (): PrivateChannelHarness => {
  const eventHandlers = new Map<string, EventHandler>();
  const eventListeners: Listener[] = [];
  const legacyHandlers: PrivateChannelHarness['legacyHandlers'] = {};
  const addEventListener = vi.fn(async (type: string, handler: EventHandler) => {
    eventHandlers.set(type, handler);
    const listener = createListener();
    eventListeners.push(listener);
    return listener;
  });
  const channel = {
    id: 'private-1',
    type: 'private',
    addEventListener,
    onAddContextListener: vi.fn((handler: (contextType?: string) => void) => {
      legacyHandlers.addContextListener = handler;
      return createListener();
    }),
    onUnsubscribe: vi.fn((handler: (contextType?: string) => void) => {
      legacyHandlers.unsubscribe = handler;
      return createListener();
    }),
    onDisconnect: vi.fn((handler: () => void) => {
      legacyHandlers.disconnect = handler;
      return createListener();
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
  } as unknown as PrivateChannel;

  return { channel, eventHandlers, eventListeners, legacyHandlers, addEventListener };
};

const createAgentProvider = (fdc3Version: string) => async () =>
  ({
    getInfo: vi.fn().mockResolvedValue({ fdc3Version }),
  }) as unknown as DesktopAgent;

describe('PrivateChannelStore event support', () => {
  afterEach(() => {
    vi.useRealTimers();
    systemLogStore.logList = [];
  });

  it('uses the 2.2 event API and reports the received context type', async () => {
    const harness = createPrivateChannelHarness();
    const store = new PrivateChannelStore(createAgentProvider('2.2'));

    await store.listenForEvents(harness.channel);
    harness.eventHandlers.get('addContextListener')?.({
      type: 'addContextListener',
      details: { contextType: 'fdc3.instrument' },
    });
    harness.eventHandlers.get('unsubscribe')?.({
      type: 'unsubscribe',
      details: { contextType: 'fdc3.instrument' },
    });

    expect(harness.addEventListener.mock.calls.map(call => call[0])).toEqual([
      'addContextListener',
      'unsubscribe',
      'disconnect',
    ]);
    expect(store.privateChannelEvents.map(event => [event.type, event.contextType])).toEqual([
      ['addContextListener', 'fdc3.instrument'],
      ['unsubscribe', 'fdc3.instrument'],
    ]);
  });

  it('broadcasts only contexts matching the listener type', async () => {
    vi.useFakeTimers();
    const harness = createPrivateChannelHarness();
    const store = new PrivateChannelStore(createAgentProvider('3.0.0'));
    const broadcast = vi.spyOn(store, 'broadcast').mockResolvedValue();
    const instrument = { type: 'fdc3.instrument', id: { ticker: 'AAPL' } };
    const contact = { type: 'fdc3.contact', id: { email: 'person@example.com' } };

    await store.listenForEvents(harness.channel, { instrument, contact });
    harness.eventHandlers.get('addContextListener')?.({
      type: 'addContextListener',
      details: { contextType: 'fdc3.instrument' },
    });
    await vi.runAllTimersAsync();

    expect(broadcast).toHaveBeenCalledOnce();
    expect(broadcast).toHaveBeenCalledWith(harness.channel, instrument);
  });

  it('broadcasts every configured context when an all-listener event omits contextType', async () => {
    vi.useFakeTimers();
    const harness = createPrivateChannelHarness();
    const store = new PrivateChannelStore(createAgentProvider('2.2'));
    const broadcast = vi.spyOn(store, 'broadcast').mockResolvedValue();
    const instrument = { type: 'fdc3.instrument', id: { ticker: 'AAPL' } };
    const contact = { type: 'fdc3.contact', id: { email: 'person@example.com' } };

    await store.listenForEvents(harness.channel, { instrument, contact });
    harness.eventHandlers.get('addContextListener')?.({
      type: 'addContextListener',
      details: {},
    });
    await vi.runAllTimersAsync();

    expect(broadcast).toHaveBeenCalledTimes(2);
    expect(broadcast).toHaveBeenCalledWith(harness.channel, instrument);
    expect(broadcast).toHaveBeenCalledWith(harness.channel, contact);
    expect(store.privateChannelEvents.at(-1)?.contextType).toBeNull();
  });

  it('uses deprecated private channel callbacks for FDC3 2.0 and 2.1', async () => {
    const harness = createPrivateChannelHarness();
    const store = new PrivateChannelStore(createAgentProvider('2.1'));

    await store.listenForEvents(harness.channel);
    harness.legacyHandlers.addContextListener?.('fdc3.contact');
    harness.legacyHandlers.unsubscribe?.('fdc3.contact');

    expect(harness.addEventListener).not.toHaveBeenCalled();
    expect(store.privateChannelEvents.map(event => [event.type, event.contextType])).toEqual([
      ['addContextListener', 'fdc3.contact'],
      ['unsubscribe', 'fdc3.contact'],
    ]);
  });

  it('registers event listeners only once per private channel', async () => {
    const harness = createPrivateChannelHarness();
    const store = new PrivateChannelStore(createAgentProvider('2.2'));

    await store.listenForEvents(harness.channel);
    await store.listenForEvents(harness.channel);

    expect(harness.addEventListener).toHaveBeenCalledTimes(3);
  });

  it('unsubscribes every event listener when disconnecting', async () => {
    const harness = createPrivateChannelHarness();
    const store = new PrivateChannelStore(createAgentProvider('2.2'));

    await store.listenForEvents(harness.channel);
    await store.disconnect(harness.channel);

    expect(harness.eventListeners).toHaveLength(3);
    harness.eventListeners.forEach(listener => {
      expect(listener.unsubscribe).toHaveBeenCalledOnce();
    });
    expect(harness.channel.disconnect).toHaveBeenCalledOnce();
  });
});
