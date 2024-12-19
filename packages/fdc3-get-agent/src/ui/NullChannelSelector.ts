import { Channel } from '@kite9/fdc3-standard';
import { Connectable } from '@kite9/fdc3-standard';
import { ChannelSelector } from '@kite9/fdc3-standard';

export class NullChannelSelector implements ChannelSelector, Connectable {
  async disconnect(): Promise<void> {}

  async connect(): Promise<void> {}

  updateChannel(_channelId: string | null, _availableChannels: Channel[]): void {}

  setChannelChangeCallback(_callback: (channelId: string | null) => void): void {}
}
