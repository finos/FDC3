import {
  Channel,
  Listener,
  DisplayMetadata,
  EventHandler,
  ContextHandler,
  ContextMetadata,
} from '@robmoffat/fdc3-standard';
import { Context } from '@robmoffat/fdc3-context';

export class MockChannel implements Channel {
  id: string;
  type: 'user' | 'app' | 'private';
  private listeners: { type: string | null; handler: ContextHandler }[] = [];

  constructor(id: string, type: 'user' | 'app' | 'private') {
    this.id = id;
    this.type = type;
  }

  async broadcast(context: Context, metadata: ContextMetadata): Promise<void> {
    console.log(`[MockChannel ${this.id}] Broadcasting context:`, context.type);
    const toInvoke = this.listeners.filter(l => !l.type || l.type === context.type);
    for (const l of toInvoke) {
      try {
        await Promise.resolve(l.handler(context, metadata));
      } catch (err) {
        console.error(`[MockChannel ${this.id}] Listener error:`, err);
      }
    }
  }

  async addContextListener(typeOrHandler: string | null | ContextHandler, handler?: ContextHandler): Promise<Listener> {
    const type = typeof typeOrHandler === 'string' ? typeOrHandler : null;
    const h = typeof typeOrHandler === 'function' ? typeOrHandler : handler!;
    const entry = { type, handler: h };
    this.listeners.push(entry);
    console.log(`[MockChannel ${this.id}] Listener added. Total listeners: ${this.listeners.length}`);
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
}
