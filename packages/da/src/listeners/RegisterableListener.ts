import { Listener } from "@finos/fdc3";

export interface RegisterableListener extends Listener {

    id : string

    filter(m: any) : boolean

    action(m: any) : void
}