import { Connectable } from '@finos/fdc3-standard';
import { ChannelSelector } from '@finos/fdc3-standard';

/** Implementation used when an injected Channel selector is not in use. */
export class NullChannelSelector implements ChannelSelector, Connectable {
  async disconnect(): Promise<void> { }
  async connect(): Promise<void> { }
  async updateChannel(): Promise<void> { }
  setChannelChangeCallback(): void { }
}
