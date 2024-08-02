import { AutomaticResponse, TestMessaging } from "../TestMessaging";


export class GetAppMetadata implements AutomaticResponse {


    filter(t: string) {
        return t == 'getAppMetadataRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createMetadataResponseMessage(input as GetAppMetadataAgentRequest)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createMetadataResponseMessage(m: GetAppMetadataAgentRequest): GetAppMetadataAgentResponse {
        return {
            meta: m.meta as GetAppMetadataAgentResponseMeta,
            type: "getAppMetadataResponse",
            payload: {
                appMetadata: {
                    appId: m.payload.app.appId,
                    name: "Metadata Name",
                    description: "Metadata Description"
                }
            }
        }
    }
}