import { IntentHandler } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { AbstractListener } from "./AbstractListener";
import { RaiseIntentAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";

export class DefaultIntentListener extends AbstractListener<IntentHandler> {

    readonly intent: string

    constructor(messaging: Messaging, intent: string, action: IntentHandler) {
        super(messaging,
            { intent },
            action,
            "onAddIntentListener",
            "onUnsubscribeIntentListener")

        this.intent = intent
    }

    filter(m: RaiseIntentAgentRequest): boolean {
        return (m.type == 'raiseIntentRequest') && (m.payload.intent == this.intent)
    }

    action(m: any): void {
        this.handler(m.payload.context, {
            source: m.meta.source
        })
    }
}