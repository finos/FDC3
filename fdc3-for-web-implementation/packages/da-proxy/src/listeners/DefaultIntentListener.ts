import { IntentHandler, IntentResult, AppIdentifier, Context } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { AbstractListener } from "./AbstractListener";
import { RaiseIntentRequest, RaiseIntentResultResponse, ResponsePayload, RaiseIntentResponse, IntentResult as BridgeIntentResult } from "@kite9/fdc3-common"


export class DefaultIntentListener extends AbstractListener<IntentHandler> {

    readonly intent: string

    constructor(messaging: Messaging, intent: string, action: IntentHandler) {
        super(messaging,
            { intent },
            action,
            "addIntentListener",
            "intentListenerUnsubscribe")

        this.intent = intent
    }

    filter(m: RaiseIntentRequest): boolean {
        return (m.type == 'raiseIntentRequest') && (m.payload.intent == this.intent)
    }

    action(m: RaiseIntentRequest): void {
        this.handleIntentResponse(m as any)

        const done = this.handler(m.payload.context, {
            source: m.meta.source as AppIdentifier// ISSUE: #1275
        })

        if (done != null) {
            this.handleIntentResultResponse(done, m);
        }
    }

    private handleIntentResponse(m: RaiseIntentRequest) {
        const out: RaiseIntentResponse = {
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

    private handleIntentResultResponse(done: Promise<IntentResult>, m: RaiseIntentRequest) {
        done.then(ir => {
            const out: RaiseIntentResultResponse = {
                type: "raiseIntentResultResponse",
                meta: {
                    responseUuid: this.messaging.createUUID(),
                    requestUuid: m.meta.requestUuid,
                    timestamp: new Date()
                },
                payload: {
                    intentResult: convertIntentResult(ir)
                } as ResponsePayload
            };
            this.messaging.post(out);
        });
    }
}

export function convertIntentResult(intentResult: IntentResult): BridgeIntentResult {
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
                    id: intentResult.id as string,
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