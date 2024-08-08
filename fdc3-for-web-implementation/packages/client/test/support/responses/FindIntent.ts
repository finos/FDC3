import { AutomaticResponse, TestMessaging } from "../TestMessaging";

export class FindIntent implements AutomaticResponse {

    filter(t: string) {
        return t == 'findIntentRequest'
    }

    action(input: object, m: TestMessaging) {
        const intentRequest = input as FindIntentAgentRequest
        const request = this.createFindIntentResponseMessage(intentRequest)
        setTimeout(() => { m.receive(request) }, 100)
        return Promise.resolve()
    }

    private createFindIntentResponseMessage(m: FindIntentAgentRequest): FindIntentAgentResponse {
        return {
            meta: m.meta as FindIntentAgentResponseMeta,
            type: "findIntentResponse",
            payload: {
                appIntent: {
                    intent: m.payload.intent,
                    apps: [
                        {
                            appId: 'test-app-1',
                            name: 'Test App 1',
                        },
                        {
                            appId: 'test-app-2',
                            name: 'Test App 2',
                        }
                    ]
                }
            }
        } as any
    }
}