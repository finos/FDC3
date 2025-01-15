import { Channel, ChannelSelector } from '@finos/fdc3-standard';

export class TestChannelSelector implements ChannelSelector {
  private callback: ((channelId: string | null) => void) | null = null;
  channelId: string | null = null;
  channels: Channel[] = [];

  constructor() { }

  async updateChannel(channelId: string | null, availableChannels: Channel[]): Promise<void> {
    this.channelId = channelId;
    this.channels = availableChannels;
  }

  setChannelChangeCallback(callback: (channelId: string | null) => void): void {
    this.callback = callback;
  }

  async connect(): Promise<void> {
    console.log('TestChannelSelector was connected');
  }

  async disconnect(): Promise<void> {
    console.log('TestChannelSelector was disconnected');
  }

  selectChannel(channelId: string | null): void {
    this.channelId = channelId;
    if (this.callback) {
      this.callback(this.channelId);
    } else {
      throw new Error('Channel selected before Channel Change callback was set!');
    }
  }

  selectFirstChannel(): void {
    this.selectChannel(this.channels[0].id);
  }

  selectSecondChannel(): void {
    this.selectChannel(this.channels[1].id);
  }

  deselectChannel(): void {
    this.selectChannel(null);
  }
}
