import { Listener, PrivateChannel } from '@finos/fdc3-standard';
import { MockChannel } from './MockChannel';

export class MockPrivateChannel extends MockChannel implements PrivateChannel {
  constructor(id: string) {
    super(id, 'private');
  }
  onAddContextListener(handler: (contextType?: string) => void): Listener {
    return { unsubscribe: async () => {} };
  }
  onUnsubscribe(handler: (contextType?: string) => void): Listener {
    return { unsubscribe: async () => {} };
  }
  onDisconnect(handler: () => void): Listener {
    return { unsubscribe: async () => {} };
  }
  async disconnect(): Promise<void> {}
  async addEventListener(type: string | null, handler: any): Promise<Listener> {
    return { unsubscribe: async () => {} };
  }
}
