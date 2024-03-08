import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { FDC3Server } from "./FDC3Server";
import { ServerContext } from "./ServerContext";
import { BroadcastHandler } from "./handlers/BroadcastHandler";
import { IntentHandler } from "./handlers/IntentHandler";
import { Directory } from "./directory/DirectoryInterface";

export interface MessageHandler {

    accept(msg: AgentRequestMessage, sc: ServerContext): void
}

/**
 * This defers all functionality to either MessageHandler's or the ServerContext objects.
 */
export class BasicFDC3Server implements FDC3Server {

    private handlers: MessageHandler[]
    private sc: ServerContext

    constructor(handlers: MessageHandler[], sc: ServerContext) {
        this.handlers = handlers
        this.sc = sc;
    }

    receive(message: AgentRequestMessage): void {
        this.sc.log(`MessageReceived: \n ${JSON.stringify(message, null, 2)}`)
        this.handlers.forEach(h => h.accept(message, this.sc))
    }

}

export class DefaultFDC3Server extends BasicFDC3Server {

    constructor(sc: ServerContext, directory: Directory) {
        super([
            new BroadcastHandler(),
            new IntentHandler(directory)
        ], sc)
    }
}