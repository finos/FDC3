import { Channel, Context } from "@finos/fdc3";

/**
 * Channel where the details of the last context object of each type is available.
 */
export interface StatefulChannel extends Channel {

    getState() : Map<string, Context>

    getCurrentContext(contextType: string | undefined): Promise<Context | null> 

}