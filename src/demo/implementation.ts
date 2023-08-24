import { DesktopAgent } from "@finos/fdc3";
import { AbstractDesktopAgent } from "../lib/agent/AbstractDesktopAgent";
import { FDC3Initialiser } from "../lib/methods/js-inject";
import { DesktopAgentDetails, Options } from "../lib/types";
import { BroadcastAgentRequest, RequestMessageType } from "../lib/BridgingTypes";

/**
 * This dummy desktop agent just implements broadcast and addContextListener for the 
 * purposes of the demo.  Communication is also via post-message.  
 */
class DummyDesktopAgent extends AbstractDesktopAgent {

    constructor(details: DesktopAgentDetails, options: Options) {
        super(details, options);

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

    postInternal(m: object) {
        // this DA is a bit sloppy about frame origin, whereas the other one isn't.
        this.options.frame!!.postMessage(m, "*");
    }

    getIcon() {
        return "https://cosaic.io/wp-content/uploads/2022/09/fdc3-check.png";
    }
    
}

const init : FDC3Initialiser = (details: DesktopAgentDetails, options: Options) => {
    return new DummyDesktopAgent(details, options) as any as DesktopAgent;
}

export default init;
