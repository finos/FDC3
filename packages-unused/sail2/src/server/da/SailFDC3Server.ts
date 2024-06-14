import { BasicFDC3Server, ServerContext } from "da-server";
import { SailDirectory } from "../appd/SailDirectory";
import { ReconfigurableBroadcastHandler } from "./ReconfigurableBroadcastHandler";
import { IntentHandler } from "da-server/src/handlers/IntentHandler";
import { OpenHandler } from "da-server/src/handlers/OpenHandler";
import { ChannelMetadata, HelloArgs } from "./message-types";

/**
 * Extends BasicFDC3Server to allow for more detailed (and changeable) user channel metadata
 * as well as user-configurable SailDirectory.
 */
export class SailFDC3Server extends BasicFDC3Server {

    protected readonly directory: SailDirectory
    protected readonly broadcastHandler: ReconfigurableBroadcastHandler

    constructor(sc: ServerContext, helloArgs: HelloArgs) {
        const dir = new SailDirectory()
        const bh = new ReconfigurableBroadcastHandler("Sail", helloArgs.channels)
        const ih = new IntentHandler(dir, 200000)
        const oh = new OpenHandler(dir)

        super([bh, ih, oh], sc)
        dir.replace(helloArgs.directories)

        this.directory = dir
        this.broadcastHandler = bh
    }

    getDirectory() {
        return this.directory
    }

    getBroadcastHandler() {
        return this.broadcastHandler
    }
}