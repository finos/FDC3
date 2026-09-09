import {
  Listener,
  Channel,
  ContextHandler,
  PrivateChannel,
  IntentHandler,
  IntentResolution,
  ImplementationMetadata,
} from '@finos/fdc3-standard';
import type {
  AppIdentifier,
  AppMetadata,
  AppProvidableContextMetadata,
  ContextMetadata,
  DesktopAgent,
  Intent,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { MockChannel } from './MockChannel';
import { MockPrivateChannel } from './MockPrivateChannel';

const sharedChannels = new Map<string, MockChannel>();
const sharedPrivateChannels = new Map<string, MockPrivateChannel>();
const intentHandlers = new Map<string, IntentHandler>();

/** Clears module-level mock state so sample scripts and tests can run back-to-back. */
export function resetMockDesktopAgentFixtureState(): void {
  intentHandlers.clear();
  sharedChannels.clear();
  sharedPrivateChannels.clear();
}

/** Minimal Desktop Agent stand-in for samples and security tests (subset of API surface). */
class MockDesktopAgent implements Partial<DesktopAgent> {
  constructor(
    readonly fdc3Version: string = '3.0',
    readonly appMetadata: AppMetadata = { appId: 'test.app', instanceId: '123' }
  ) {}

  async getInfo(): Promise<ImplementationMetadata> {
    return {
      fdc3Version: this.fdc3Version,
      provider: 'fdc3-security-mock',
      optionalFeatures: {
        UserChannelMembershipAPIs: true,
        DesktopAgentBridging: false,
      },
      appMetadata: this.appMetadata,
    };
  }

  async addIntentListener(intent: Intent, handler: IntentHandler): Promise<Listener> {
    const key = String(intent);
    if (intentHandlers.has(key)) throw new Error(`IntentListenerConflict: ${key}`);
    intentHandlers.set(key, handler);
    return {
      unsubscribe: async () => {
        intentHandlers.delete(key);
      },
    };
  }

  async raiseIntent(
    intent: Intent,
    context: Context,
    _app?: AppIdentifier | null | string | undefined,
    _newInstance?: boolean | null | undefined,
    metadata?: AppProvidableContextMetadata | undefined
  ): Promise<IntentResolution> {
    const key = String(intent);
    const handler = intentHandlers.get(key);
    if (!handler) throw new Error(`No handler registered for intent: ${key}`);

    const result = await handler(context, (metadata ?? {}) as ContextMetadata);
    const type = result && 'type' in result ? result.type : undefined;
    const contextWithMetadata = result && 'context' in result && 'metadata' in result;
    const resolvedMetadata = (contextWithMetadata ? result.metadata : {}) as ContextMetadata;
    let resolvedResult = (contextWithMetadata ? result.context : result) as
      | Context
      | Channel
      | PrivateChannel
      | undefined;

    switch (type) {
      case 'user':
      case 'app':
        resolvedResult = sharedChannels.get((resolvedResult as Channel).id) as Channel | undefined;
        break;
      case 'private':
        resolvedResult = sharedPrivateChannels.get((resolvedResult as PrivateChannel).id) as PrivateChannel | undefined;
        break;
    }

    return {
      source: { appId: 'mock-app', instanceId: 'mock-instance' },
      intent: key as Intent,
      getResult: async () => {
        return resolvedResult;
      },
      getResultMetadata: async () => {
        return resolvedMetadata;
      },
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
    return chan.addContextListener(null, h);
  }
}

export function createMockDesktopAgent(fdc3Version: string, appMetadata: AppMetadata): DesktopAgent {
  return new MockDesktopAgent(fdc3Version, appMetadata) as unknown as DesktopAgent;
}
