import { Channel } from '@kite9/fdc3-standard';
import { ChannelSelector } from '@kite9/fdc3-standard';
import { AbstractUIComponent } from './AbstractUIComponent';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { Logger } from '../util/Logger';
const { isFdc3UserInterfaceChannelSelected } = BrowserTypes;
type Fdc3UserInterfaceChannels = BrowserTypes.Fdc3UserInterfaceChannels;

/**
 * Handles communication between an injected Channel Selector UI and the getAgent implementation.
 */
export class DefaultDesktopAgentChannelSelector extends AbstractUIComponent implements ChannelSelector {
  private callback: ((channelId: string | null) => void) | null = null;

  constructor(url: string | null) {
    //TODO: check default UI URL is correct on release
    super(url ?? 'https://fdc3.finos.org/webui/channel_selector.html', 'FDC3 Channel Selector');
  }

  async setupMessagePort(port: MessagePort): Promise<void> {
    this.port = port;

    port.addEventListener('message', e => {
      if (isFdc3UserInterfaceChannelSelected(e.data)) {
        Logger.debug(`DefaultDesktopAgentChannelSelector: Received channel selection message: `, e.data);
        const choice = e.data;
        if (this.callback) {
          this.callback(choice.payload.selected);
        }
      }
    });

    //This starts the port so do it last
    await super.setupMessagePort(port);
  }

  async updateChannel(channelId: string | null, availableChannels: Channel[]): Promise<void> {
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

    //don't post until the messageport is ready
    await this.messagePortIsReady;

    this.port?.postMessage(message);
    Logger.debug(`DefaultDesktopAgentChannelSelector: Sent channels data to channel selector: `, message);
  }

  setChannelChangeCallback(callback: (channelId: string | null) => void): void {
    this.callback = callback;
  }
}
