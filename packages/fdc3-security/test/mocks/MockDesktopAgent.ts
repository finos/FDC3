import { DesktopAgent, Listener, Channel, ContextHandler } from '@finos/fdc3-standard';
import { MockChannel } from './MockChannel';

const sharedChannels = new Map<string, MockChannel>();

export class MockDesktopAgent implements Partial<DesktopAgent> {
  async getOrCreateChannel(channelId: string): Promise<Channel> {
    if (!sharedChannels.has(channelId)) {
      sharedChannels.set(channelId, new MockChannel(channelId, 'user'));
    }
    return sharedChannels.get(channelId)!;
  }

  async addContextListener(contextType: string | ContextHandler | null, handler?: ContextHandler): Promise<Listener> {
    const h = typeof contextType === 'function' ? contextType : handler!;
    const chan = await this.getOrCreateChannel('fdc3.channel.1');
    return chan.addContextListener(h);
  }
}
