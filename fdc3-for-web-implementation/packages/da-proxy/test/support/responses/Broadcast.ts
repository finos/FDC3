import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { BroadcastRequest, BroadcastResponse } from "@kite9/fdc3-common";
import { createResponseMeta } from "./support";

export class Broadcast implements AutomaticResponse {

    filter(t: string) {
        return t == 'broadcastRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createResponse(input as BroadcastRequest)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: BroadcastRequest): BroadcastResponse {
        return {
            meta: createResponseMeta(i.meta),
            type: "broadcastResponse",
            payload: {
            }
        }
    }
}