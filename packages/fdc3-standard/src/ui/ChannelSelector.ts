import { Channel } from '../api/Channel';
import { Connectable } from '../ui/Connectable';

/**
 * Interface used by the desktop agent proxy to handle the channel selection process.
 */
export interface ChannelSelector extends Connectable {
  /**
   * Called when the list of user channels is updated, or the selected channel changes.
   */
  updateChannel(channelId: string | null, availableChannels: Channel[]): Promise<void>;

  /**
   * Called on initialization.  The channel selector will invoke the callback after the
   * channel is changed.
   */
  setChannelChangeCallback(callback: (channelId: string | null) => void): void;
}
