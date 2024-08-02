import { FDC3Server } from "./FDC3Server";
import { InstanceUUID, ServerContext } from "./ServerContext";
import { BroadcastHandler, ChannelState } from "./handlers/BroadcastHandler";
import { IntentHandler } from "./handlers/IntentHandler";
import { Directory } from "./directory/DirectoryInterface";
import { OpenHandler } from "./handlers/OpenHandler";
import { AppRequestMessage, WebConnectionProtocol4ValidateAppIdentity } from "@kite9/fdc3-common";


export interface MessageHandler {

    /**
     * Handles an AgentRequestMessage from the messaging source
     */
    accept(msg: any, sc: ServerContext, from: InstanceUUID): void
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

    receive(message: AppRequestMessage | WebConnectionProtocol4ValidateAppIdentity, from: InstanceUUID): void {
        this.sc.log(`MessageReceived: \n ${JSON.stringify(message, null, 2)}`)
        this.handlers.forEach(h => h.accept(message, this.sc, from))
    }
}

export class DefaultFDC3Server extends BasicFDC3Server {

    constructor(sc: ServerContext, directory: Directory, userChannels: ChannelState[], intentTimeoutMs: number = 20000, openHandlerTimeoutMs: number = 3000) {
        super([
            new BroadcastHandler(userChannels),
            new IntentHandler(directory, intentTimeoutMs),
            new OpenHandler(directory, openHandlerTimeoutMs)
        ], sc)
    }
}