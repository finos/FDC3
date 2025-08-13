import { Channel, DesktopAgent } from '@finos/fdc3';
import constants from '../../../constants';
import { AppControlContext } from '../../../context-types';
import { channelType } from '../../constants';
import { IBroadcastService, IChannelService } from '../../interfaces';

export class ChannelService2_0 implements IChannelService<Channel> {
  constructor(fdc3: DesktopAgent) {
    this.fdc3 = fdc3;
  }

  private fdc3: DesktopAgent;

  async joinRetrievedUserChannel(channelId: string): Promise<Channel> {
    const userChannels = await this.fdc3.getUserChannels();
    const joinedChannel = userChannels.find(c => c.id === channelId);
    if (joinedChannel) {
      await this.fdc3.joinUserChannel(channelId);
      return joinedChannel;
    } else {
      throw new Error(`Channel with ID ${channelId} not found in user channels.`);
    }
  }

  async retrieveTestAppChannel(channelId: string): Promise<Channel> {
    return await this.fdc3.getOrCreateChannel(channelId);
  }

  async broadcastContextItem(
    contextType: string,
    channel: Channel,
    historyItems: number,
    testId: string
  ): Promise<void> {
    const broadcastService = this.getBroadcastService(channel.type);
    await broadcastService.broadcast(contextType, historyItems, channel, testId);
  }

  async closeWindowOnCompletion(testId: string): Promise<void> {
    console.log(Date.now() + ` Setting up closeWindow listener`);
    const appControlChannel = await this.fdc3.getOrCreateChannel(constants.ControlChannel);
    await appControlChannel.addContextListener('closeWindow', async () => {
      console.log(Date.now() + ` Received closeWindow message`);
      await appControlChannel.broadcast({ type: 'windowClosed', testId: testId } as AppControlContext);
      setTimeout(() => {
        //yield to make sure the broadcast gets out before we close
        window.close();
      }, 1);
    });
  }

  async notifyTestOnCompletion(testId: string): Promise<void> {
    const appControlChannel = await this.fdc3.getOrCreateChannel(constants.ControlChannel);
    await this.broadcastContextItem('executionComplete', appControlChannel, 1, testId);
  }

  //get app/system channel broadcast service
  private getBroadcastService(currentChannelType: string): IBroadcastService<Channel> {
    if (currentChannelType === channelType.app) {
      return this.appChannelBroadcastService;
    } else {
      return this.systemChannelBroadcastService;
    }
  }

  //app channel broadcast service
  private appChannelBroadcastService: IBroadcastService<Channel> = {
    broadcast: async (contextType: string, historyItems: number, channel: Channel, testId: string) => {
      if (channel !== undefined) {
        for (let i = 0; i < historyItems; i++) {
          let context: AppControlContext = {
            type: contextType,
            name: `History-item-${i + 1}`,
            testId,
          };
          await channel.broadcast(context);
        }
      }
    },
  };

  //system channel broadcast service
  private systemChannelBroadcastService: IBroadcastService<Channel> = {
    broadcast: async (contextType: string, historyItems: number, _ignored: Channel, testId: string) => {
      for (let i = 0; i < historyItems; i++) {
        let context: AppControlContext = {
          type: contextType,
          name: `History-item-${i + 1}`,
          testId,
        };
        await this.fdc3.broadcast(context);
      }
    },
  };
}
