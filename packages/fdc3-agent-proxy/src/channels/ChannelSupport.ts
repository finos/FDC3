import { Channel, ContextHandler, EventHandler, FDC3EventTypes, Listener, PrivateChannel } from '@finos/fdc3-standard';

export interface ChannelSupport {
  getUserChannel(): Promise<Channel | null>;
  getUserChannels(): Promise<Channel[]>;
  getOrCreate(id: string): Promise<Channel>;
  createPrivateChannel(): Promise<PrivateChannel>;
  leaveUserChannel(): Promise<void>;
  joinUserChannel(id: string): Promise<void>;
  addContextListener(handler: ContextHandler, type: string | null): Promise<Listener>;

  /**
   * TODO: Move handling for userChannelChanged out of ChannelSupport and update type to filter to channel events only.
   */
  addEventListener(handler: EventHandler, type: FDC3EventTypes | null): Promise<Listener>;
}
