import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { GetUserChannelsRequest, GetUserChannelsResponse } from "@kite9/fdc3-common";

export class UserChannels implements AutomaticResponse {

    filter(t: string) {
        return t == 'getUserChannelsRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createResponse(input as GetUserChannelsRequest, m)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: GetUserChannelsRequest, m: TestMessaging): GetUserChannelsResponse {
        return {
            meta: {
                ...i.meta,
                responseUuid: m.createUUID(),
            },
            type: "getUserChannelsResponse",
            payload: {
                userChannels: [
                    {
                        id: "one",
                        type: "user"
                    },
                    {
                        id: "two",
                        type: "user"
                    },
                    {
                        id: "three",
                        type: "user"
                    }
                ]

            }
        }
    }
}