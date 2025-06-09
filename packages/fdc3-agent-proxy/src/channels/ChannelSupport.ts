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
   * TODO: Move out of ChannelSupport when there are other, non-channel related event types to support.
   */
  addEventListener(handler: EventHandler, type: FDC3EventTypes | null): Promise<Listener>;
}
