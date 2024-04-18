import { Messaging } from "da-proxy";
import { ChannelSelector, ChannelSelectorDetails, CSSPositioning } from "fdc3-common";

// const DEFAULT_SELECTOR_CONTAINER_CSS: CSSPositioning = {
//     position: "fixed",
//     zIndex: "1000",
//     left: "10%",
//     top: "10%",
//     right: "10%",
//     bottom: "10%"
// }

const DEFAULT_ICON_CSS: CSSPositioning = {
    position: "fixed",
    zIndex: "1000",
    right: "10px",
    bottom: "10px",
    width: "50px",
    height: "50px"
}

/**
 * Works with the desktop agent to provide a simple channel selector.
 * 
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgentApi() method
 */
export class DefaultDesktopAgentChannelSelector implements ChannelSelector {

    //private readonly m: Messaging
    private readonly details: ChannelSelectorDetails
    private container: HTMLDivElement | undefined = undefined
    private icon: HTMLImageElement | undefined = undefined

    constructor(_m: Messaging, details: ChannelSelectorDetails) {
        //this.m = m
        this.details = details
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
    }

    updateChannel(channelId: string | null): void {
        const src = this.details?.icon?.src
        if (src) {
            // the DA is asking for an icon
            if (this.icon == undefined) {
                this.icon = document.createElement("img")
                this.theme(this.icon, this.details.icon?.css ?? DEFAULT_ICON_CSS)
                document.body.appendChild(this.icon)

                const popup = this.details.selector
                if (popup) {
                    // need to allow for dragging here too
                    this.icon.addEventListener("touchend", this.chooseChannel)
                    this.icon.addEventListener("mouseup", this.chooseChannel)
                }
            }

            this.icon.src = this.buildSrc(src, channelId)
        }
    }

    chooseChannel(): void {
        // this.openFrame(appIntents)

        // const choice = await this.m.waitFor<IntentResolutionChoiceAgentResponse>(m => m.type == 'intentResolutionChoice')

        // this.removeFrame()

        // return choice.payload
    }

    openPopup(): void {
        // this.removeFrame()

        // this.container = document.createElement("div")
        // const ifrm = document.createElement("iframe")

        // this.themeContainer(this.container)
        // this.themeFrame(ifrm)

        // ifrm.setAttribute("src", this.buildUrl(appIntents))

        // this.container.appendChild(ifrm)
        // document.body.appendChild(this.container)
    }
}