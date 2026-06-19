import { Listener, PrivateChannel } from '@finos/fdc3-standard';
import { MockChannel } from './MockChannel';

export class MockPrivateChannel extends MockChannel implements PrivateChannel {
  /** Incremented when {@link disconnect} runs (for tests exercising the secure boundary). */
  disconnectCallCount = 0;

  constructor(id: string) {
    super(id, 'private');
  }
  async disconnect(): Promise<void> {
    this.disconnectCallCount++;
  }
  async addEventListener(_type: string | null, _handler: unknown): Promise<Listener> {
    return { unsubscribe: async () => {} };
  }
}
