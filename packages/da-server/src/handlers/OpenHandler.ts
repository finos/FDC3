import { AppMetadata } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";



export class OpenHandler implements MessageHandler {



    accept(msg: any, sc: ServerContext, from: AppMetadata): void {
        if (msg.type == 'open') { }


    }




}