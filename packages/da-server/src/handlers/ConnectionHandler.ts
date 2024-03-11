import { AgentRequestMessage, AppMetadata, ConnectionStep2Hello } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";


export class ConnectionHandler implements MessageHandler {



    accept(msg: AgentRequestMessage, sc: ServerContext): void {
        throw new Error("Method not implemented.");
    }

    connect(sc: ServerContext): void {
        // here, we need to send the hello message
        const out: ConnectionStep2Hello = {
            meta: {
                timestamp: new Date(),
            },
            type: "hello",
            payload: {
                authRequired: false,
                desktopAgentBridgeVersion: "n/a",
                supportedFDC3Versions: ["2.0"]
            }
        }

        sc.post(out)
    }


    disconnect(app: AppMetadata, sc: ServerContext): void {
        throw new Error("Method not implemented.");
    }





}
