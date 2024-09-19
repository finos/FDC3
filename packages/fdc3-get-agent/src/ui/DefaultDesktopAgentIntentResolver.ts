import { AppIntent } from "@kite9/fdc3-standard";
import { IntentResolver, IntentResolutionChoice } from '@kite9/fdc3-standard'
import { AbstractUIComponent } from "./AbstractUIComponent";
import { BrowserTypes } from "@kite9/fdc3-schema";
import { Context } from "@kite9/fdc3-context";

type IframeResolveAction = BrowserTypes.IframeResolveAction
type IframeResolve = BrowserTypes.IframeResolve

/**
 * Works with the desktop agent to provide a resolution to the intent choices.
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgent() method
 */
export class DefaultDesktopAgentIntentResolver extends AbstractUIComponent implements IntentResolver {

    private pendingResolve: ((x: IntentResolutionChoice | void) => void) | null = null

    constructor(url: string | null) {
        super(url ?? "https://fdc3.finos.org/webui/intent_resolver.html", "FDC3 Intent Resolver")
    }

    async setupMessagePort(port: MessagePort): Promise<void> {
        await super.setupMessagePort(port)
        this.port = port

        this.port.addEventListener("message", (e) => {
            console.log("Got resolve action")
            if (e.data.type == 'iframeResolveAction') {
                const choice = e.data as IframeResolveAction
                if ((choice.payload.action == 'click') && (this.pendingResolve)) {
                    this.pendingResolve({
                        appId: choice.payload.appIdentifier!!,
                        intent: choice.payload.intent!!
                    })
                } else if ((choice.payload.action == 'cancel') && (this.pendingResolve)) {
                    this.pendingResolve()
                }

                this.pendingResolve = null
            }
        })
    }

    async chooseIntent(appIntents: AppIntent[], context: Context): Promise<IntentResolutionChoice | void> {
        const out = new Promise<IntentResolutionChoice | void>((resolve, _reject) => {
            this.pendingResolve = resolve
        })


        this.port?.postMessage({
            type: 'iframeResolve',
            payload: {
                appIntents,
                context
            }
        } as IframeResolve)

        return out
    }
}