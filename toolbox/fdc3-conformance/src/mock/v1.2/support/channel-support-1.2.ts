import { Channel, DesktopAgent } from 'fdc3_1_2';
import constants from '../../../constants';
import { AppControlContext } from '../../../context-types';
import { channelType } from '../../constants';
import { IBroadcastService, IChannelService } from '../../interfaces';

declare let fdc3: DesktopAgent;

export class ChannelService1_2 implements IChannelService<Channel> {
  async joinRetrievedUserChannel(channelId: string): Promise<Channel> {
    const systemChannels = await fdc3.getSystemChannels();
    const joinedChannel = systemChannels.find(c => c.id === channelId);
    if (joinedChannel) {
      await fdc3.joinChannel(channelId);
      return joinedChannel;
    }
  }

  async retrieveTestAppChannel(channelId: string): Promise<Channel> {
    return await fdc3.getOrCreateChannel(channelId);
  }

  broadcastContextItem(contextType: string, channel: Channel, historyItems: number, testId: string) {
    let broadcastService = this.getBroadcastService(channel.type);
    broadcastService.broadcast(contextType, historyItems, channel, testId);
  }

  async closeWindowOnCompletion(testId: string): Promise<void> {
    console.log(Date.now() + ` Setting up closeWindow listener`);
    const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
    appControlChannel.addContextListener('closeWindow', async () => {
      console.log(Date.now() + ` Received closeWindow message`);
      appControlChannel.broadcast({ type: 'windowClosed', testId: testId } as AppControlContext);
      setTimeout(() => {
        //yield to make sure the broadcast gets out before we close
        window.close();
      }, 1);
    });
  }

  async notifyTestOnCompletion(testId: string): Promise<void> {
    const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
    this.broadcastContextItem('executionComplete', appControlChannel, 1, testId);
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
    broadcast: (contextType: string, historyItems: number, channel: Channel, testId: string) => {
      if (channel !== undefined) {
        for (let i = 0; i < historyItems; i++) {
          let context: AppControlContext = {
            type: contextType,
            name: `History-item-${i + 1}`,
            testId,
          };
          channel.broadcast(context);
        }
      }
    },
  };

  //system channel broadcast service
  private systemChannelBroadcastService: IBroadcastService<Channel> = {
    broadcast: (contextType: string, historyItems: number, ignored, testId: string) => {
      for (let i = 0; i < historyItems; i++) {
        let context: AppControlContext = {
          type: contextType,
          name: `History-item-${i + 1}`,
          testId,
        };
        fdc3.broadcast(context);
      }
    },
  };
}
