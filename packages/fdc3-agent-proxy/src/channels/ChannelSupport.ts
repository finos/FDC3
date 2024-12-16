import { Channel, ContextHandler, EventHandler, Listener, PrivateChannel } from '@kite9/fdc3-standard';

export interface ChannelSupport {
  getUserChannel(): Promise<Channel | null>;
  getUserChannel(): Promise<Channel | null>;
  getUserChannels(): Promise<Channel[]>;
  getOrCreate(id: string): Promise<Channel>;
  createPrivateChannel(): Promise<PrivateChannel>;
  leaveUserChannel(): Promise<void>;
  joinUserChannel(id: string): Promise<void>;
  addContextListener(handler: ContextHandler, type: string | null): Promise<Listener>;
  addChannelChangedEventHandler(handler: EventHandler): Promise<Listener>;
}
