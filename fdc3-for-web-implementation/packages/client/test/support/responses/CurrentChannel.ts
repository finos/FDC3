import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { GetCurrentChannelRequest, GetCurrentChannelResponse } from "@kite9/fdc3-common";

export class CurrentChannel implements AutomaticResponse {

    filter(t: string) {
        return t == 'getCurrentChannelRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createResponse(input as GetCurrentChannelRequest, m)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: GetCurrentChannelRequest, m: TestMessaging): GetCurrentChannelResponse {
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