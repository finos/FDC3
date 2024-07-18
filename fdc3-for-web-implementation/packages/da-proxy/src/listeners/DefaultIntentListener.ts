import { IntentHandler, IntentResult } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { AbstractListener } from "./AbstractListener";
import { RaiseIntentAgentRequest, RaiseIntentResultAgentResponse, IntentResult as BridgeIntentResult, RaiseIntentAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { Context, Channel } from "@finos/fdc3"

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

    action(m: RaiseIntentAgentRequest): void {
        this.handleIntentResponse(m)

        const done = this.handler(m.payload.context, {
            source: m.meta.source
        })

        if (done != null) {
            this.handleIntentResultResponse(done, m);
        }
    }

    private handleIntentResponse(m: RaiseIntentAgentRequest) {
        const out: RaiseIntentAgentResponse = {
            type: "raiseIntentResponse",
            meta: {
                responseUuid: this.messaging.createUUID(),
                requestUuid: m.meta.requestUuid,
                timestamp: new Date()
            },
            payload: {
                intentResolution: {
                    intent: m.payload.intent,
                    source: this.messaging.getSource()
                }
            }
        };
        this.messaging.post(out);
    }

    private handleIntentResultResponse(done: Promise<IntentResult>, m: RaiseIntentAgentRequest) {
        (done as Promise<IntentResult>)
            .then(intentResult => {
                const out: RaiseIntentResultAgentResponse = {
                    type: "raiseIntentResultResponse",
                    meta: {
                        responseUuid: this.messaging.createUUID(),
                        requestUuid: m.meta.requestUuid,
                        timestamp: new Date()
                    },
                    payload: {
                        intentResult: convertIntentResult(intentResult)
                    }
                };
                this.messaging.post(out);
            });
    }
}

export function convertIntentResult(intentResult: Context | Channel | void): BridgeIntentResult {
    if (intentResult == null) {
        return {
            // empty result
        }
    }
    switch (intentResult.type) {
        case 'user':
        case 'app':
        case 'private':
            // it's a channel
            return {
                channel: {
                    type: intentResult.type,
                    id: (intentResult as Channel).id,
                    displayMetadata: intentResult.displayMetadata
                }
            }
        default:
            // it's a context
            return {
                context: intentResult as Context
            }
    }
}