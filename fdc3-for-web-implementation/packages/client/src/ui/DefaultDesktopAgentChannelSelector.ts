import { IframeChannels, IframeChannelSelected, ChannelSelector } from "@kite9/fdc3-common";
import { Channel } from "@finos/fdc3";
import { AbstractUIComponent } from "./AbstractUIComponent";


/**
 * Works with the desktop agent to provide a simple channel selector.
 * 
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgentApi() method
 */
export class DefaultDesktopAgentChannelSelector extends AbstractUIComponent implements ChannelSelector {

    private callback: ((channelId: string) => void) | null = null
    private port: MessagePort | null = null

    constructor(url: string | null) {
        super(url ?? "https://fdc3.finos.org/webui/channel_selector.html", "FDC3 Channel Selector")
    }

    async setupMessagePort(port: MessagePort): Promise<void> {
        await super.setupMessagePort(port)
        this.port = port

        port.addEventListener("message", (e) => {
            if (e.data.type == 'iframeChannelSelected') {
                const choice = e.data as IframeChannelSelected
                if ((choice.payload.selected) && (this.callback)) {
                    this.callback(choice.payload.selected)
                }
            }
        })
    }

    updateChannel(channelId: string | null, availableChannels: Channel[]): void {
        // also send to the iframe
        this.port!!.postMessage({
            type: 'iframeChannels',
            payload: {
                selected: channelId,
                userChannels: availableChannels.map(ch => {
                    return {
                        id: ch.id,
                        displayMetadata: ch.displayMetadata
                    }
                })
            }

        } as IframeChannels)
    }

    setChannelChangeCallback(callback: (channelId: string) => void): void {
        this.callback = callback
    }

}