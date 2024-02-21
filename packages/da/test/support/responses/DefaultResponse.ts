import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { AutomaticResponse, TestMessaging } from "../TestMessaging";

export class DefaultResponse implements AutomaticResponse {
    
    filter(t: string) {
        return true
    }

    action(_input: AgentRequestMessage, _m: TestMessaging)  {
        return Promise.resolve()
    }
    
}