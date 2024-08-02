import { AutomaticResponse, IntentDetail, TestMessaging } from "../TestMessaging";


export class Open implements AutomaticResponse {

    filter(t: string) {
        return t == 'openRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createOpenResponse(input as OpenAgentRequest, m.intentDetails[0], m)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createOpenResponse(m: OpenAgentRequest, id: IntentDetail, tm: TestMessaging): OpenAgentResponse | OpenAgentErrorResponse {
        const found = tm.intentDetails.find(id => id.app?.appId == m.payload.app.appId)

        if (found) {
            return {
                meta: m.meta as any,
                type: "openResponse",
                payload: {
                    appIdentifier: {
                        appId: id.app?.appId!!,
                        instanceId: "abc123"
                    }
                }
            } as OpenAgentResponse
        } else {
            return {
                meta: m.meta as any,
                type: "openResponse",
                payload: {
                    error: "AppNotFound"
                }
            } as OpenAgentErrorResponse
        }
    }
}