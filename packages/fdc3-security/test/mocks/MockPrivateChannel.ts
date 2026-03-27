import { Listener, PrivateChannel } from '@robmoffat/fdc3-standard';
import { MockChannel } from './MockChannel';

export class MockPrivateChannel extends MockChannel implements PrivateChannel {
  constructor(id: string) {
    super(id, 'private');
  }
  onAddContextListener(_handler: (contextType?: string) => void): Listener {
    return { unsubscribe: async () => {} };
  }
  onUnsubscribe(_handler: (contextType?: string) => void): Listener {
    return { unsubscribe: async () => {} };
  }
  onDisconnect(_handler: () => void): Listener {
    return { unsubscribe: async () => {} };
  }
  async disconnect(): Promise<void> {}
  async addEventListener(_type: string | null, _handler: unknown): Promise<Listener> {
    return { unsubscribe: async () => {} };
  }
}
