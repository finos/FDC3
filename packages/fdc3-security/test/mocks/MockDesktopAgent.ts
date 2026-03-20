import {
  DesktopAgent,
  Listener,
  Channel,
  ContextHandler,
  PrivateChannel,
  IntentHandler,
  IntentResolution,
} from '@finos/fdc3-standard';
import type { Intent } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { MockChannel } from './MockChannel';
import { MockPrivateChannel } from './MockPrivateChannel';

const sharedChannels = new Map<string, MockChannel>();
const sharedPrivateChannels = new Map<string, MockPrivateChannel>();

export class MockDesktopAgent implements Partial<DesktopAgent> {
  private intentHandlers = new Map<string, IntentHandler>();

  async addIntentListener(intent: Intent, handler: IntentHandler): Promise<Listener> {
    const key = String(intent);
    if (this.intentHandlers.has(key)) throw new Error(`IntentListenerConflict: ${key}`);
    this.intentHandlers.set(key, handler);
    return {
      unsubscribe: async () => {
        this.intentHandlers.delete(key);
      },
    };
  }

  async raiseIntent(intent: Intent, context: Context): Promise<IntentResolution> {
    const key = String(intent);
    const handler = this.intentHandlers.get(key);
    if (!handler) throw new Error(`No handler registered for intent: ${key}`);
    const result = await handler(context);

    const contextResult = result as Context;
    const thePrivateChannel =
      typeof contextResult?.id === 'string' ? sharedPrivateChannels.get(contextResult.id) : undefined;

    return {
      source: { appId: 'mock-app', instanceId: 'mock-instance' },
      intent: key as Intent,
      getResult: async () => thePrivateChannel ?? contextResult,
    };
  }

  async getOrCreateChannel(channelId: string): Promise<Channel> {
    if (!sharedChannels.has(channelId)) {
      sharedChannels.set(channelId, new MockChannel(channelId, 'app'));
    }
    return sharedChannels.get(channelId)!;
  }

  async createPrivateChannel(): Promise<PrivateChannel> {
    const id = `private-${Date.now()}`;
    if (!sharedPrivateChannels.has(id)) {
      sharedPrivateChannels.set(id, new MockPrivateChannel(id));
    }
    return sharedPrivateChannels.get(id)!;
  }

  async addContextListener(contextType: string | ContextHandler | null, handler?: ContextHandler): Promise<Listener> {
    const h = typeof contextType === 'function' ? contextType : handler!;
    const chan = await this.getOrCreateChannel('fdc3.channel.1');
    return chan.addContextListener(h);
  }
}
