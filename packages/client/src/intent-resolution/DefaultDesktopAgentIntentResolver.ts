import { AppIntent, IntentResult } from "@finos/fdc3";
import { Messaging } from "@kite9/da-proxy";
import { IntentResolver, SingleAppIntent, IntentResolutionChoiceAgentResponse, IntentResolverDetails, CSS_ELEMENTS } from "@kite9/fdc3-common";

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

    private readonly m: Messaging
    private readonly details: IntentResolverDetails
    private container: HTMLDivElement | undefined = undefined

    constructor(m: Messaging, details: IntentResolverDetails | null) {
        this.m = m
        this.details = details ?? DEFAULT_INTENT_RESOLVER_DETAILS
    }

    async intentChosen(ir: IntentResult): Promise<IntentResult> {
        this.removeFrame()
        return ir
    }

    async chooseIntent(appIntents: AppIntent[]): Promise<SingleAppIntent> {
        this.openFrame(appIntents)

        const choice = await this.m.waitFor<IntentResolutionChoiceAgentResponse>(m => m.type == 'intentResolutionChoice')

        this.removeFrame()

        return choice.payload
    }

    removeFrame() {
        if (this.container) {
            document.body.removeChild(this.container)
            this.container = undefined
        }
    }

    buildUrl(appIntents: AppIntent[]): string {
        return this.details.uri + "?intentDetails=" + encodeURIComponent(JSON.stringify(appIntents)) +
            "&source=" + encodeURIComponent(JSON.stringify(this.m.getSource()))
    }

    themeContainer(container: HTMLDivElement) {
        const css = this.details.css ?? DEFAULT_INTENT_RESOLVER_DETAILS.css!!
        for (const k in CSS_ELEMENTS) {
            const value: string | undefined = css[(k as string)]
            if (value != null) {
                container.style.setProperty(k, value)
            }
        }
    }

    themeFrame(ifrm: HTMLIFrameElement) {
        ifrm.setAttribute("name", "FDC3 Intent Resolver")
        ifrm.style.width = "100%"
        ifrm.style.height = "100%"
        ifrm.style.border = "0"
    }

    openFrame(appIntents: AppIntent[]): void {
        this.removeFrame()

        this.container = document.createElement("div")
        const ifrm = document.createElement("iframe")

        this.themeContainer(this.container)
        this.themeFrame(ifrm)

        ifrm.setAttribute("src", this.buildUrl(appIntents))

        this.container.appendChild(ifrm)
        document.body.appendChild(this.container)
    }
}