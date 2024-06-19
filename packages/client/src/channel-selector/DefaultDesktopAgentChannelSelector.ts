import { Messaging } from "@kite9/da-proxy";
import { ChannelSelector, ChannelSelectorDetails, CSSPositioning, ChannelSelectionChoiceAgentRequest } from "@kite9/fdc3-common";
import { Channel } from "@finos/fdc3";

const DEFAULT_CHANNEL_SELECTOR_DETAILS: ChannelSelectorDetails = {
    uri: "http://localhost:4000/channel_selector.html",
    css: {
        position: "fixed",
        zIndex: "1000",
        right: "10px",
        bottom: "10px",
        width: "50px",
        height: "50px"
    }
}

/**
 * Works with the desktop agent to provide a simple channel selector.
 * 
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgentApi() method
 */
export class DefaultDesktopAgentChannelSelector implements ChannelSelector {

    private readonly m: Messaging
    private readonly details: ChannelSelectorDetails
    private container: HTMLDivElement | undefined = undefined
    private icon: HTMLImageElement | undefined = undefined
    private availableChannels: Channel[] = []
    private currentId: string | null = null
    private callback: ((channelId: string) => void) | null = null

    constructor(m: Messaging, details: ChannelSelectorDetails | null) {
        this.m = m
        this.details = details ?? DEFAULT_CHANNEL_SELECTOR_DETAILS
    }

    removeFrame() {
        if (this.container) {
            document.body.removeChild(this.container)
            this.container = undefined
        }
    }

    buildSrc(src: string, channelId: string | null): string {
        return src + (channelId ? "?channelId=" + encodeURIComponent(channelId) : "")
    }

    theme(e: HTMLElement, css: CSSPositioning) {
        for (const [key, value] of Object.entries(css)) {
            if (value != null) {
                e.style.setProperty(key, value as string)
            }
        }
    }

    themeFrame(ifrm: HTMLIFrameElement) {
        ifrm.setAttribute("name", "FDC3 Channel Selector")
        ifrm.style.width = "100%"
        ifrm.style.height = "100%"
        ifrm.style.border = "0"
    }

    updateChannel(_channelId: string | null, _availableChannels: Channel[]): void {
        // this.availableChannels = availableChannels
        // this.currentId = channelId
        // const src = this.details?.icon?.src
        // if (src) {
        //     // the DA is asking for an icon
        //     if (this.icon == undefined) {
        //         this.icon = document.createElement("img")
        //         this.theme(this.icon, this.details.icon?.css ?? DEFAULT_ICON_CSS)
        //         document.body.appendChild(this.icon)

        //         const popup = this.details.selector
        //         if (popup?.uri) {
        //             // need to allow for dragging here too
        //             this.icon.addEventListener("touchend", () => this.chooseChannel())
        //             this.icon.addEventListener("mouseup", () => this.chooseChannel())
        //         }
        //     }

        //     this.icon.src = this.buildSrc(src, channelId)
        // }
    }

    buildUrl(): string {
        return this.details.uri
            + "?currentId=" + encodeURIComponent(JSON.stringify(this.currentId))
            + "&availableChannels=" + encodeURIComponent(JSON.stringify(this.serializeChannels()))
            + "&source=" + encodeURIComponent(JSON.stringify(this.m.getSource()))
    }

    serializeChannels(): any {
        return this.availableChannels.map(ch => {
            return {
                id: ch.id,
                displayMetadata: ch.displayMetadata
            }
        })
    }

    openFrame(): void {
        this.removeFrame()

        this.container = document.createElement("div")
        const ifrm = document.createElement("iframe")

        this.theme(this.container, this.details.css ?? DEFAULT_CHANNEL_SELECTOR_DETAILS.css!!)
        this.themeFrame(ifrm)

        ifrm.setAttribute("src", this.buildUrl())

        this.container.appendChild(ifrm)
        document.body.appendChild(this.container)
    }

    setChannelChangeCallback(callback: (channelId: string) => void): void {
        this.callback = callback
    }

    async chooseChannel(): Promise<void> {
        this.openFrame()

        const choice = await this.m.waitFor<ChannelSelectionChoiceAgentRequest>(m => m.type == 'channelSelectionChoice')

        this.removeFrame()

        if ((!choice.payload.cancelled) && (this.callback)) {
            return this.callback(choice.payload.channelId)
        }
    }


}