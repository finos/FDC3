import { InstanceID } from "@kite9/da-server";
import { TestServerContext } from "../TestServerContext";

export interface AutomaticResponse {

    filter: (t: string) => boolean,
    action: (input: object, m: TestServerContext, from: InstanceID) => Promise<void>

}

