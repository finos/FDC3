import { AgentRequestMessage, FindIntentsByContextAgentRequest, FindIntentsByContextAgentResponse, FindIntentsByContextAgentResponseMeta } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { AutomaticResponse, IntentDetail, TestMessaging, intentDetailMatches } from "../TestMessaging";


export class FindIntentByContext implements AutomaticResponse {

    filter(t: string) {
        return t == 'findIntentsByContextRequest'
    }

    action(input: AgentRequestMessage, m: TestMessaging) {
        const intentRequest = input as FindIntentsByContextAgentRequest
        const payload = intentRequest.payload
        const context = payload?.context?.type
        const template: IntentDetail = {
            context
        }

        const relevant = m.intentDetails.filter(id => intentDetailMatches(id, template, true))
        const request = this.createFindIntentsByContextResponseMessage(intentRequest, relevant)
        setTimeout(() => { m.receive(request) }, 100)
        return Promise.resolve()
    }


    private createFindIntentsByContextResponseMessage(m: FindIntentsByContextAgentRequest, relevant: IntentDetail[]): FindIntentsByContextAgentResponse {
        const relevantIntents = [...new Set<string>(relevant.map(r => r.intent!!))]

        return {
            meta: m.meta as FindIntentsByContextAgentResponseMeta,
            type: "findIntentsByContextResponse",
            payload: {
                appIntents: 
                    relevantIntents.map(i => {
                        return {
                            intent: { name: i, displayName: i },
                            apps: relevant
                                .filter(r => r.intent == i)
                                .map(r => r.app!!)!!
                        }
                    })
                }
        }
    }
}