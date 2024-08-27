import { AutomaticResponse, IntentDetail, TestMessaging } from "../TestMessaging";
import { RaiseIntentRequest, RaiseIntentResponse, RaiseIntentResultResponse } from "@kite9/fdc3-common";

export class RaiseIntent implements AutomaticResponse {

    filter(t: string) {
        return t == 'raiseIntentRequest'
    }

    createRaiseIntentAgentResponseMessage(intentRequest: RaiseIntentRequest, using: IntentDetail, m: TestMessaging): RaiseIntentResponse {
        const result = m.getIntentResult()
        if (result.error) {
            const out: RaiseIntentResponse = {
                meta: {
                    ...intentRequest.meta,
                    responseUuid: m.createUUID()
                },
                payload: {
                    error: result.error as any
                },
                type: "raiseIntentResponse"
            }

            return out
        } else {
            const out: RaiseIntentResponse = {
                meta: {
                    ...intentRequest.meta,
                    responseUuid: m.createUUID()
                },
                payload: {
                    intentResolution: {
                        intent: using.intent!!,
                        source: using.app!!
                    }
                },
                type: "raiseIntentResponse"
            }

            return out
        }
    }

    createRaiseIntentResultResponseMesssage(intentRequest: RaiseIntentRequest, m: TestMessaging): RaiseIntentResultResponse | undefined {
        const result = m.getIntentResult()
        if (result.error) {
            return undefined
        } else {
            const out: RaiseIntentResultResponse = {
                meta: {
                    ...intentRequest.meta,
                    responseUuid: m.createUUID()
                },
                payload: {
                    intentResult: m.getIntentResult()
                },
                type: "raiseIntentResultResponse"
            }

            return out
        }

    }

    action(input: object, m: TestMessaging) {
        const intentRequest = input as RaiseIntentRequest
        const payload = intentRequest.payload
        const intent = payload.intent
        const context = payload?.context?.type
        const app = payload?.app
        const using: IntentDetail = {
            intent,
            context,
            app
        }

        if (!m.getIntentResult()?.timeout) {
            // this sends out the intent resolution
            const out1 = this.createRaiseIntentAgentResponseMessage(intentRequest, using, m)
            setTimeout(() => { m.receive(out1) }, 100)

            // next, send the result response
            const out2 = this.createRaiseIntentResultResponseMesssage(intentRequest, m)
            if (out2) {
                setTimeout(() => { m.receive(out2) }, 300)
            }
        }
        return Promise.resolve()
    }
}
