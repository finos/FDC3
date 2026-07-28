import {
  Channel,
  Listener,
  DisplayMetadata,
  EventHandler,
  ContextHandler,
  ContextMetadata,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

export class MockChannel implements Channel {
  id: string;
  type: 'user' | 'app' | 'private';
  listeners: { type: string | string[] | null; handler: ContextHandler }[] = [];

  constructor(id: string, type: 'user' | 'app' | 'private') {
    this.id = id;
    this.type = type;
  }

  async broadcast(context: Context): Promise<void> {
    console.log('[MockChannel] Broadcasting context', { channelId: this.id, context });
    const toInvoke = this.listeners.filter(l => {
      if (!l.type) return true; // null means all types
      if (Array.isArray(l.type)) return l.type.includes(context.type);
      return l.type === context.type;
    });
    for (const l of toInvoke) {
      try {
        await Promise.resolve(l.handler(context, undefined as unknown as ContextMetadata));
      } catch (err) {
        console.error('[MockChannel] Listener error', { channelId: this.id, err });
      }
    }
  }

  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
  addContextListener(contextTypes: string[], handler: ContextHandler): Promise<Listener>;
  addContextListener(handler: ContextHandler): Promise<Listener>;
  async addContextListener(
    typeOrHandler: string | string[] | null | ContextHandler,
    handler?: ContextHandler
  ): Promise<Listener> {
    const type =
      typeof typeOrHandler === 'string'
        ? typeOrHandler
        : Array.isArray(typeOrHandler)
          ? typeOrHandler
          : typeof typeOrHandler === 'function'
            ? null
            : null;
    const h = typeof typeOrHandler === 'function' ? typeOrHandler : handler!;
    const entry = { type, handler: h };
    this.listeners.push(entry);
    console.log('[MockChannel] Listener added', { channelId: this.id, listenerCount: this.listeners.length });
    return {
      unsubscribe: async () => {
        this.listeners = this.listeners.filter(l => l !== entry);
      },
    };
  }

  // Minimal implementation for mock
  displayMetadata = {} as DisplayMetadata;
  async getCurrentContext(): Promise<Context | null> {
    return null;
  }
  async clearContext(): Promise<void> {}

  async addEventListener(_type: string, _handler: EventHandler): Promise<Listener> {
    return { unsubscribe: async () => {} };
  }

  async getCurrentContextWithMetadata(): Promise<{ context: Context; metadata: ContextMetadata } | null> {
    return null;
  }
}
