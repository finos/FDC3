import { AppIntent, IntentResult } from "@finos/fdc3";
import { Messaging } from "@kite9/da-proxy";
import { IntentResolver, SingleAppIntent, IntentResolutionChoiceAgentResponse } from "@kite9/fdc3-common";

/**
 * Works with the desktop agent to provide a resolution to the intent choices.
 */
export class DesktopAgentIntentResolver implements IntentResolver {

    private readonly m: Messaging
    private readonly uri: string
    private container: HTMLDivElement | undefined = undefined

    constructor(m: Messaging, uri: string) {
        this.m = m
        this.uri = uri
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
        return this.uri + "?intentDetails=" + encodeURIComponent(JSON.stringify(appIntents)) +
            "&source=" + encodeURIComponent(JSON.stringify(this.m.getSource()))
    }

    openFrame(appIntents: AppIntent[]): void {
        this.removeFrame()

        this.container = document.createElement("div")
        document.body.appendChild(this.container)
        this.container.style.position = "fixed"
        this.container.style.zIndex = "1000"
        this.container.style.left = "10%"
        this.container.style.top = "10%"
        this.container.style.right = "10%"
        this.container.style.bottom = "10%"

        var ifrm = document.createElement("iframe")
        ifrm.setAttribute("src", this.buildUrl(appIntents))
        ifrm.setAttribute("name", "FDC3 Communications")
        ifrm.style.width = "100%"
        ifrm.style.height = "100%"
        this.container.appendChild(ifrm)
    }
}