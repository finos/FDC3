/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 *
 * Exercises {@link connectRemoteHandlers}, {@link setupWebsocketServer}, and channel proxying
 * (subscribe / broadcast / unsubscribe / private disconnect) across the secure WebSocket boundary.
 */

import { Context } from '@finos/fdc3-context';
import { Channel, DesktopAgent, PrivateChannel } from '@finos/fdc3-standard';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { AppBackEnd } from './mocks/AppBackEnd';
import { MockDesktopAgent } from './mocks/MockDesktopAgent';
import { MockPrivateChannel } from './mocks/MockPrivateChannel';

const PURPOSE_APP_CHANNEL = 'secure-boundary-app-channel';
const PURPOSE_PRIVATE_DISCONNECT = 'secure-boundary-private-disconnect';

async function flushWebSocketClose(): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 100));
}

/**
 * Server-side handler that uses the bridged {@link Channel} proxy to exercise
 * `addContextListener`, `broadcast`, and listener `unsubscribe` through the secure WebSocket boundary.
 */
class AppChannelSecureBoundaryHandlers extends DefaultFDC3Handlers {
  listenerNotifications = 0;

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== PURPOSE_APP_CHANNEL) {
      return super.handleRemoteChannel(purpose, channel);
    }

    const ctx: Context = {
      type: 'fdc3.instrument',
      id: { ticker: 'IBM' },
      name: 'IBM Corp.',
    };

    const listener = await channel.addContextListener('fdc3.instrument', async () => {
      this.listenerNotifications++;
    });

    await channel.broadcast(ctx);
    await new Promise<void>(resolve => setImmediate(resolve));

    expect(this.listenerNotifications).toBe(1);

    await listener.unsubscribe();

    await channel.broadcast(ctx);
    await new Promise<void>(resolve => setImmediate(resolve));

    expect(this.listenerNotifications).toBe(1);
  }
}

class PrivateChannelDisconnectHandlers extends DefaultFDC3Handlers {
  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== PURPOSE_PRIVATE_DISCONNECT) {
      return super.handleRemoteChannel(purpose, channel);
    }
    await (channel as PrivateChannel).disconnect();
  }
}

class EchoExchangeHandlers extends DefaultFDC3Handlers {
  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'echo') {
      return { ...(o as Record<string, unknown>), echoed: true };
    }
    return super.exchangeData(purpose, o);
  }
}

describe('Secure boundary — WebSocket channel proxy', () => {
  it('forwards addContextListener, broadcast, and unsubscribe for an app channel', async () => {
    let serverHandlers!: AppChannelSecureBoundaryHandlers;
    const backend = new AppBackEnd((_ws, _sec) => {
      serverHandlers = new AppChannelSecureBoundaryHandlers();
      return serverHandlers;
    });
    await backend.start();
    try {
      const wsUrl = backend.baseUrl.replace('http', 'ws');
      const mockDA = new MockDesktopAgent() as unknown as DesktopAgent;
      const clientHandlers = await connectRemoteHandlers(wsUrl, mockDA, async () => {
        return undefined;
      });
      const ch = await mockDA.getOrCreateChannel('secure-boundary-app-ch');
      await clientHandlers.handleRemoteChannel(PURPOSE_APP_CHANNEL, ch);
      expect(serverHandlers.listenerNotifications).toBe(1);
      await clientHandlers.disconnect();
      await flushWebSocketClose();
    } finally {
      await backend.shutdown();
      await flushWebSocketClose();
    }
  });

  it('forwards private channel disconnect to the client DesktopAgent channel', async () => {
    const backend = new AppBackEnd((_ws, _sec) => new PrivateChannelDisconnectHandlers());
    await backend.start();
    try {
      const wsUrl = backend.baseUrl.replace('http', 'ws');
      const mockDA = new MockDesktopAgent() as unknown as DesktopAgent;
      const priv = await mockDA.createPrivateChannel();
      expect((priv as MockPrivateChannel).disconnectCallCount).toBe(0);

      const clientHandlers = await connectRemoteHandlers(wsUrl, mockDA, async () => {
        return undefined;
      });
      await clientHandlers.handleRemoteChannel(PURPOSE_PRIVATE_DISCONNECT, priv);

      expect((priv as MockPrivateChannel).disconnectCallCount).toBe(1);
      await clientHandlers.disconnect();
      await flushWebSocketClose();
    } finally {
      await backend.shutdown();
      await flushWebSocketClose();
    }
  });

  it('exchangeData round-trips between client proxy and server handler', async () => {
    const backend = new AppBackEnd((_ws, _sec) => new EchoExchangeHandlers());
    await backend.start();
    try {
      const wsUrl = backend.baseUrl.replace('http', 'ws');
      const mockDA = new MockDesktopAgent() as unknown as DesktopAgent;
      const clientHandlers = await connectRemoteHandlers(wsUrl, mockDA, async () => {
        return undefined;
      });
      const out = (await clientHandlers.exchangeData('echo', { n: 42 })) as { n: number; echoed: boolean };
      expect(out).toEqual({ n: 42, echoed: true });
      await clientHandlers.disconnect();
      await flushWebSocketClose();
    } finally {
      await backend.shutdown();
      await flushWebSocketClose();
    }
  });
});
