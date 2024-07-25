import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { JoinUserChannelRequest, JoinUserChannelResponse } from "@kite9/fdc3-common";
import { createResponseMeta } from "./support";

export class JoinUserChannel implements AutomaticResponse {

    filter(t: string) {
        return t == 'joinUserChannelRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createResponse(input as JoinUserChannelRequest)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: JoinUserChannelRequest): JoinUserChannelResponse {
        return {
            meta: createResponseMeta(i.meta),
            type: "joinUserChannelResponse",
            payload: {
            }
        }
    }
}