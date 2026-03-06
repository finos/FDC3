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
  private listeners: ContextHandler[] = [];

  constructor(id: string, type: 'user' | 'app' | 'private') {
    this.id = id;
    this.type = type;
  }

  async broadcast(context: Context, meta: ContextMetadata): Promise<void> {
    console.log(`[MockChannel ${this.id}] Broadcasting context:`, context.type);
    console.log(`[MockChannel ${this.id}] Metadata:`, JSON.stringify(meta, null, 2));
    // Execute listeners in next tick to avoid blocking
    setImmediate(() => {
      this.listeners.forEach(l => l(context, meta));
    });
  }

  async addContextListener(typeOrHandler: string | null | ContextHandler, handler?: ContextHandler): Promise<Listener> {
    const h = typeof typeOrHandler === 'function' ? typeOrHandler : handler!;
    this.listeners.push(h);
    console.log(`[MockChannel ${this.id}] Listener added. Total listeners: ${this.listeners.length}`);
    return {
      unsubscribe: async () => {
        this.listeners = this.listeners.filter(l => l !== h);
      },
    };
  }

  // Minimal implementation for mock
  displayMetadata = {} as DisplayMetadata;
  async getCurrentContext(): Promise<Context | null> {
    return null;
  }
  async clearContext(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addEventListener(type: string, handler: EventHandler): Promise<Listener> {
    return { unsubscribe: async () => {} };
  }
}
