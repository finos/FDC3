import { IntentHandler } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { AbstractListener } from "./AbstractListener";

export class DefaultIntentListener extends AbstractListener<IntentHandler> {

    readonly intent: string

    constructor(messaging: Messaging, intent: string, action: IntentHandler) {
        super(messaging,
            { intent },
            action,
            "subscribeIntentListener", /** TODO : https://github.com/finos/FDC3/issues/1171 */
            "unsubscribeIntentListener")

        this.intent = intent
    }

    filter(m: any): boolean {
        return (m.type == 'raiseIntentRequest') && (m.payload.intent == this.intent)
    }

    action(m: any): void {
        this.handler(m.payload.context, {
            source: m.meta.source
        })
    }
}