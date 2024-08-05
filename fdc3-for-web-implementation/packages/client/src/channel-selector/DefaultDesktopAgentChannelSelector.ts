import { ChannelSelector, ChannelSelectorDetails, CSS_ELEMENTS, CSSPositioning, SelectorMessageChannels, SelectorMessageChoice, SelectorMessageResize } from "@kite9/fdc3-common";
import { Channel } from "@finos/fdc3";

const DEFAULT_CHANNEL_SELECTOR_DETAILS: ChannelSelectorDetails = {
    uri: "http://localhost:4000/channel_selector.html",
    collapsedCss: {
        position: "fixed",
        zIndex: "1000",
        right: "10px",
        bottom: "10px",
        width: "50px",
        height: "50px"
    },
    expandedCss: {
        position: "fixed",
        zIndex: "1000",
        right: "10px",
        bottom: "10px",
        width: "450px",
        maxHeight: "600px",
        transition: "all 0.5s ease-out allow-discrete"
    }
}

/**
 * Works with the desktop agent to provide a simple channel selector.
 * 
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgentApi() method
 */
export class DefaultDesktopAgentChannelSelector implements ChannelSelector {

    private readonly details: ChannelSelectorDetails
    private container: HTMLDivElement | undefined = undefined
    private iframe: Window | undefined = undefined
    private availableChannels: Channel[] = []
    private channelId: string | null = null
    private callback: ((channelId: string) => void) | null = null
    private port: MessagePort | undefined = undefined

    constructor(details: ChannelSelectorDetails | null) {
        this.details = details ?? DEFAULT_CHANNEL_SELECTOR_DETAILS
        this.setupMessageListener()
        this.openFrame()
    }

    themeContainer(css: CSSPositioning) {
        for (let i = 0; i < CSS_ELEMENTS.length; i++) {
            const k = CSS_ELEMENTS[i]
            const value: string | undefined = css[(k as string)]
            if (value != null) {
                this.container?.style.setProperty(k, value)
            } else {
                this.container?.style.removeProperty(k)
            }
        }
    }

    themeFrame(ifrm: HTMLIFrameElement) {
        ifrm.setAttribute("name", "FDC3 Channel Selector")
        ifrm.style.width = "100%"
        ifrm.style.height = "100%"
        ifrm.style.border = "0"
    }

    private setupMessageListener() {
        globalThis.window.addEventListener("message", (e) => {
            if (e.source == this.iframe && e.data.type == 'SelectorMessageInitialize') {
                this.port = e.ports[0]
                this.port.start()
                this.port.onmessage = (e) => {
                    switch (e.data.type) {
                        case 'SelectorMessageChoice':
                            const choice = e.data as SelectorMessageChoice
                            if ((choice.channelId) && (this.callback)) {
                                this.callback(choice.channelId)
                            }
                            break
                        case 'SelectorMessageResize':
                            const resize = e.data as SelectorMessageResize
                            if (resize.expanded) {
                                this.themeContainer(this.details.expandedCss!!)
                            } else {
                                this.themeContainer(this.details.collapsedCss!!)
                            }
                            break
                    }
                }

                // send the available channels details
                this.updateChannel(this.channelId, this.availableChannels)
            }
        })
    }

    serializeChannels(): any {
        return this.availableChannels.map(ch => {
            return {
                id: ch.id,
                displayMetadata: ch.displayMetadata
            }
        })
    }

    updateChannel(channelId: string | null, availableChannels: Channel[]): void {
        // record the settings here
        this.channelId = channelId
        this.availableChannels = availableChannels

        // also send to the iframe
        this.port?.postMessage({
            type: 'SelectorMessageChannels',
            channels: this.availableChannels.map(ch => {
                return {
                    id: ch.id,
                    displayMetadata: ch.displayMetadata
                }
            }),
            selected: channelId
        } as SelectorMessageChannels)
    }

    private openFrame(): void {
        this.container = globalThis.document.createElement("div")
        const ifrm = globalThis.document.createElement("iframe")

        this.themeContainer(this.details.collapsedCss ?? DEFAULT_CHANNEL_SELECTOR_DETAILS.collapsedCss!!)
        this.themeFrame(ifrm)

        ifrm.setAttribute("src", this.details.uri!!)
        this.container.appendChild(ifrm)
        document.body.appendChild(this.container)
        this.iframe = ifrm.contentWindow!!
    }

    setChannelChangeCallback(callback: (channelId: string) => void): void {
        this.callback = callback
    }

}