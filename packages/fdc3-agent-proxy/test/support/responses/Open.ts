import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { BrowserTypes } from "@kite9/fdc3-schema";
import { createResponseMeta } from "./support";

type OpenRequest = BrowserTypes.OpenRequest
type OpenResponse = BrowserTypes.OpenResponse

export class Open implements AutomaticResponse {

    filter(t: string) {
        return t == 'openRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createOpenResponse(input as OpenRequest, m)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createOpenResponse(m: OpenRequest, tm: TestMessaging): OpenResponse {
        const found = tm.intentDetails.find(id => id.app?.appId == m.payload.app.appId)

        if (found && found.app) {
            return {
                meta: createResponseMeta(m.meta),
                type: "openResponse",
                payload: {
                    appIdentifier: {
                        appId: found.app.appId,
                        instanceId: "abc123"
                    }
                }
            } as OpenResponse
        } else {
            return {
                meta: createResponseMeta(m.meta),
                type: "openResponse",
                payload: {
                    error: "AppNotFound"
                }
            } as OpenResponse
        }
    }
}