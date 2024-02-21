import { AgentRequestMessage, IntentResult, RaiseIntentAgentRequest, RaiseIntentAgentResponse, RaiseIntentResultAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { AutomaticResponse, IntentDetail, TestMessaging, intentDetailMatches } from "../TestMessaging";


export class RaiseIntent implements AutomaticResponse {

    filter(t: string) {
        return t == 'raiseIntentRequest'
    }

    createRaiseIntentAgentResponseMessage(intentRequest: RaiseIntentAgentRequest, using: IntentDetail, m: TestMessaging) : RaiseIntentAgentResponse {
        const out : RaiseIntentAgentResponse = {
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

    createRaiseIntentResultResponseMesssage(intentRequest: RaiseIntentAgentRequest, using: IntentDetail, m: TestMessaging) : RaiseIntentResultAgentResponse {
        var intentResult : IntentResult = {}

        // here, we're just providing a few canned responses required for the tests
        switch (using.resultType) {
            case "channel": 
                intentResult.channel = {
                    type: 'app',
                    id: 'result-channel',
                    displayMetadata: {
                        color: "purple",
                        name: "Result Channel"
                    }
                }
                break;
            case "fdc3.order": 
                intentResult.context = {
                    type: 'fdc3.order',
                    id: {
                        myOMS: "OMS-9",
                    },
                    name: "Big Order 9"
                }
                break;
        }
        
        const out: RaiseIntentResultAgentResponse = {
            meta: {
                ...intentRequest.meta,
                responseUuid: m.createUUID()
            },
            payload: {
                intentResult
            },
            type: "raiseIntentResultResponse"
        }

        return out
    }
 
    action(input: AgentRequestMessage, m: TestMessaging) {
        const intentRequest = input as RaiseIntentAgentRequest
        const payload = intentRequest.payload
        const intent = payload.intent
        const context = payload?.context?.type
        const template: IntentDetail = {
            intent,
            context
        }

        const relevant = m.intentDetails.filter(id => intentDetailMatches(id, template))
        const using = relevant[0]

        // this sends out the intent resolution
        const out1 = this.createRaiseIntentAgentResponseMessage(intentRequest, using, m) 
        setTimeout(() => { m.receive(out1) }, 100)

        // next, send the result response
        const out2 = this.createRaiseIntentResultResponseMesssage(intentRequest, using, m) 
        setTimeout(() => { m.receive(out2) }, 300)
        return Promise.resolve()
    }
}
