import { AppIdentifier, AppIntent, IntentResult } from "@finos/fdc3";
import { IntentResolver, SingleAppIntent, IntentResolverDetails, CSS_ELEMENTS, ResolverMessageChoice, ResolverIntents } from "@kite9/fdc3-common";

export const DEFAULT_INTENT_RESOLVER_DETAILS: IntentResolverDetails = {
    uri: "http://localhost:4000/intent_resolver.html",
    css: {
        position: "fixed",
        zIndex: "1000",
        left: "10%",
        top: "10%",
        right: "10%",
        bottom: "10%"
    }
}

/**
 * Works with the desktop agent to provide a resolution to the intent choices.
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgentApi() method
 */
export class DefaultDesktopAgentIntentResolver implements IntentResolver {

    private readonly details: IntentResolverDetails
    private container: HTMLDivElement | undefined = undefined

    constructor(url: string | null) {
        this.details = {
            ...DEFAULT_INTENT_RESOLVER_DETAILS,
            uri: url ?? DEFAULT_INTENT_RESOLVER_DETAILS.uri!!
        }
    }

    async intentChosen(ir: IntentResult): Promise<IntentResult> {
        this.removeFrame()
        return ir
    }

    async chooseIntent(appIntents: AppIntent[], source: AppIdentifier) {
        const iframe = await this.openFrame()
        const chosen = await this.receiveChosenIntent(iframe, appIntents, source)
        this.removeFrame()
        return chosen
    }

    async receiveChosenIntent(iframe: Window, appIntents: AppIntent[], source: AppIdentifier): Promise<SingleAppIntent> {
        return new Promise((resolve, _reject) => {
            window.addEventListener("message", (e) => {
                if (e.source == iframe && e.data.type == 'SelectorMessageInitialize') {
                    const port = e.ports[0]
                    port.start()
                    port.onmessage = (e) => {
                        switch (e.data.type) {
                            case 'ResolverMessageChoice':
                                const choice = e.data as ResolverMessageChoice
                                resolve(choice.payload)

                        }
                    }

                    // send the available channels details
                    port.postMessage({
                        type: "ResolverIntents",
                        appIntents,
                        source
                    } as ResolverIntents)
                }
            })
        })
    }

    removeFrame() {
        if (this.container) {
            document.body.removeChild(this.container)
            this.container = undefined
        }
    }

    themeContainer(container: HTMLDivElement) {
        const css = this.details.css ?? DEFAULT_INTENT_RESOLVER_DETAILS.css!!
        for (let i = 0; i < CSS_ELEMENTS.length; i++) {
            const k = CSS_ELEMENTS[i]
            const value: string | undefined = css[(k as string)]
            if (value != null) {
                container.style.setProperty(k, value)
            } else {
                this.container?.style.removeProperty(k)
            }

        }
    }

    themeFrame(ifrm: HTMLIFrameElement) {
        ifrm.setAttribute("name", "FDC3 Intent Resolver")
        ifrm.style.width = "100%"
        ifrm.style.height = "100%"
        ifrm.style.border = "0"
    }

    async openFrame(): Promise<Window> {
        this.removeFrame()

        this.container = document.createElement("div")
        const ifrm = document.createElement("iframe")

        this.themeContainer(this.container)
        this.themeFrame(ifrm)

        ifrm.setAttribute("src", this.details.uri ?? DEFAULT_INTENT_RESOLVER_DETAILS.uri!!)

        this.container.appendChild(ifrm)
        document.body.appendChild(this.container)
        return ifrm.contentWindow!!
    }
}