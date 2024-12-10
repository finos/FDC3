import { Channel } from '@kite9/fdc3-standard';
import { ChannelSelector } from '@kite9/fdc3-standard';
import { AbstractUIComponent } from './AbstractUIComponent';
import {
  Fdc3UserInterfaceChannels,
  isFdc3UserInterfaceChannelSelected,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

/**
 * Works with the desktop agent to provide a simple channel selector.
 *
 * This is the default implementation, but can be overridden by app implementers calling
 * the getAgent() method
 */
export class DefaultDesktopAgentChannelSelector extends AbstractUIComponent implements ChannelSelector {
  private callback: ((channelId: string | null) => void) | null = null;

  constructor(url: string | null) {
    //TODO: check default UI URL is correct on release
    super(url ?? 'https://fdc3.finos.org/webui/channel_selector.html', 'FDC3 Channel Selector');
  }

  async setupMessagePort(port: MessagePort): Promise<void> {
    await super.setupMessagePort(port);
    this.port = port;

    port.addEventListener('message', e => {
      if (isFdc3UserInterfaceChannelSelected(e.data)) {
        const choice = e.data;
        if (this.callback) {
          this.callback(choice.payload.selected);
        }
      }
    });
  }

  updateChannel(channelId: string | null, availableChannels: Channel[]): void {
    const message: Fdc3UserInterfaceChannels = {
      type: 'Fdc3UserInterfaceChannels',
      payload: {
        selected: channelId,
        userChannels: availableChannels.map(ch => {
          return {
            id: ch.id,
            type: 'user',
            displayMetadata: ch.displayMetadata,
          };
        }),
      },
    };
    this.port!.postMessage(message);
  }

  setChannelChangeCallback(callback: (channelId: string | null) => void): void {
    this.callback = callback;
  }
}
