import { AutomaticResponse, TestMessaging } from "../TestMessaging";


export class FindInstances implements AutomaticResponse {

    filter(t: string) {
        return t == 'findInstancesRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createFindInstancesResponse(input as FindInstancesAgentRequest)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createFindInstancesResponse(m: FindInstancesAgentRequest): FindInstancesAgentResponse {
        return {
            meta: m.meta as FindInstancesAgentResponseMeta,
            type: "findInstancesResponse",
            payload: {
                appIdentifiers: [
                    { appId: "One", instanceId: "1" },
                    { appId: "Two", instanceId: "2" },
                    { appId: "Three", instanceId: "3" },

                ]
            }
        }
    }
}