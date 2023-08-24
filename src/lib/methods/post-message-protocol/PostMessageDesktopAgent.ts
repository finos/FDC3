import { DesktopAgentDetails, Options } from "../../types";
import { BroadcastAgentRequest, RequestMessageType } from "../../BridgingTypes";
import { AbstractDesktopAgent } from "../../agent/AbstractDesktopAgent";

/**
 * Desktop Agent implemented over post-message protocol, using DesktopAgentBridging.
 * As before, just implementing broadcast, addContextListener and getInfo.
 */
export class PostMessageDesktopAgent extends AbstractDesktopAgent {

    origin: string;

    constructor(details: DesktopAgentDetails, options: Options) {
        super(details, options);
        this.origin = details.origin as string;
        
        // set up the post message listener for events coming from the server
        window.addEventListener("message", (event) => {
            const data = event.data;

            if (data.type == RequestMessageType.BroadcastRequest) {
                const typedData = data as BroadcastAgentRequest;
                const meta = typedData.meta;
                const payload = typedData.payload;
                const context = payload.context;
                this.listeners.forEach(l => l.handle(context, meta))
            }
        });
    }

    getIcon() {
        return "/static/da/noun-mailbox-6010513.png";
    }

    postInternal(m: object) {
        this.options.frame!!.postMessage(m, this.origin);
    }
    
}