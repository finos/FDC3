import { Channel } from '@finos/fdc3';

export interface IChannelService {
  joinRetrievedUserChannel(channelId: string): Promise<Channel>;

  retrieveTestAppChannel(channelId: string): Promise<Channel>;

  broadcastContextItem(contextType: string, channel: Channel, historyItems: number, testId: string): Promise<void>;

  closeWindowOnCompletion(testId: string): Promise<void>;

  notifyTestOnCompletion(testId: string): Promise<void>;
}

export interface IBroadcastService {
  broadcast(contextType: string, historyItems: number, channel: Channel, testId: string): Promise<void>;
}
