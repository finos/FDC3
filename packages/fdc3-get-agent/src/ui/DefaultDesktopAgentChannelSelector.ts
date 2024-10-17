import { Channel } from "@kite9/fdc3-standard";
import { ChannelSelector } from "@kite9/fdc3-standard"
import { AbstractUIComponent } from "./AbstractUIComponent";
import { BrowserTypes } from "@kite9/fdc3-schema";

type IframeChannels = BrowserTypes.IframeChannels
type IframeChannelSelected = BrowserTypes.IframeChannelSelected

/**
 * Works with the desktop agent to provide a simple channel selector.
 * 
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgent() method
 */
export class DefaultDesktopAgentChannelSelector extends AbstractUIComponent implements ChannelSelector {

    private callback: ((channelId: string) => void) | null = null

    constructor(url: string | null) {
        super(url ?? "https://fdc3.finos.org/webui/channel_selector.html", "FDC3 Channel Selector")
    }

    async setupMessagePort(port: MessagePort): Promise<void> {
        await super.setupMessagePort(port)
        this.port = port

        port.addEventListener("message", (e) => {
            if (e.data.type == 'fdc3UserInterfaceSelected') {
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
            type: 'fdc3UserInterfaceChannels',
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