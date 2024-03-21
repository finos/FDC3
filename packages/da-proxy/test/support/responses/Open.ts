import { OpenAgentRequest, OpenAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { AutomaticResponse, IntentDetail, TestMessaging } from "../TestMessaging";


export class Open implements AutomaticResponse {

    filter(t: string) {
        return t == 'openRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createOpenResponse(input as OpenAgentRequest, m.intentDetails[0])

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createOpenResponse(m: OpenAgentRequest, id: IntentDetail): OpenAgentResponse {
        return {
            meta: m.meta as any,
            type: "openResponse",
            payload: {
                appIdentifier: {
                    appId: id.app?.appId!!,
                    instanceId: id.app?.instanceId!!
                }
            }
        }
    }
}