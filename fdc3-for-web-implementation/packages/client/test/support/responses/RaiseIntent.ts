import { RaiseIntentRequest, RaiseIntentResponse } from "@kite9/fdc3-common";
import { AutomaticResponse, TestMessaging } from "../TestMessaging";


export class RaiseIntent implements AutomaticResponse {

    filter(t: string) {
        return t == 'raiseIntentRequest'
    }

    createRaiseIntentAgentResponseMessage(intentRequest: RaiseIntentRequest, m: TestMessaging): RaiseIntentResponse {
        const out: RaiseIntentResponse = {
            meta: {
                ...intentRequest.meta,
                responseUuid: m.createUUID()
            },
            payload: {
                intentResolution: {
                    intent: intentRequest.payload.intent,
                    source: intentRequest.payload.app!!
                }
            },
            type: "raiseIntentResponse"
        }

        return out
    }

    action(input: object, m: TestMessaging) {
        const intentRequest = input as RaiseIntentRequest
        // this sends out the intent resolution
        const out1 = this.createRaiseIntentAgentResponseMessage(intentRequest, m)
        setTimeout(() => { m.receive(out1) }, 100)
        return Promise.resolve()
    }
}
