import { GetCurrentChannelRequest, GetCurrentChannelResponse } from "@kite9/fdc3-standard";
import { TestServerContext } from "../TestServerContext";
import { InstanceID } from "@kite9/da-server";
import { AutomaticResponse } from "./AutomaticResponses";

export class CurrentChannel implements AutomaticResponse {

    filter(t: string) {
        return t == 'getCurrentChannelRequest'
    }

    action(input: object, m: TestServerContext, from: InstanceID) {
        const out = this.createResponse(input as GetCurrentChannelRequest, m)
        setTimeout(() => { m.post(out, from) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: GetCurrentChannelRequest, m: TestServerContext): GetCurrentChannelResponse {
        return {
            meta: {
                ...i.meta,
                responseUuid: m.createUUID(),
            },
            type: "getCurrentChannelResponse",
            payload: {

            }
        }
    }
}