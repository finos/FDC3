export interface IChannelService<TChannel> {
  joinRetrievedUserChannel(channelId: string): Promise<TChannel>;
  retrieveTestAppChannel(channelId: string): Promise<TChannel>;
  broadcastContextItem(contextType: string, channel: TChannel, historyItems: number, testId: string);
  closeWindowOnCompletion(testId: string): Promise<void>;
  notifyTestOnCompletion(testId: string): Promise<void>;
}

export interface IBroadcastService<TChannel> {
  broadcast(contextType: string, historyItems: number, channel: TChannel, testId: string): void;
}
