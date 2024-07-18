import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { RegisterChannelAgentRequest, RegisterChannelAgentResponse } from "@kite9/fdc3-common";
import { ChannelError } from "@finos/fdc3";

type ChannelType = { [channelId: string]: 'user' | 'app' | 'private' }

export class RegisterChannel implements AutomaticResponse {

    private type: ChannelType = {}


    filter(t: string) {
        return t == 'registerChannelRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.registerChannel(input as RegisterChannelAgentRequest)

        setTimeout(() => { m.receive(out as any) }, 100)
        return Promise.resolve()
    }

    registerChannel(r: RegisterChannelAgentRequest): RegisterChannelAgentResponse {
        const id = r.payload.channelId
        const type = r.payload.type

        const existingType = this.type[id]

        if ((existingType) && (existingType != type)) {
            // channel already exists
            return {
                type: "registerChannelResponse",
                meta: r.meta,
                payload: {
                    error: ChannelError.AccessDenied
                }
            }

        } else {
            this.type[id] = type
            return {
                type: "registerChannelResponse",
                meta: r.meta,
                payload: {
                }
            }
        }
    }
}