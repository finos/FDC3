import { SimpleServer } from "./SimpleServer";

export function handleInternalRegisterDesktopInstance(e: MessageEvent, client: MessagePort, ss: SimpleServer) {
    console.log("Registering app Identifier: "+e.data.appIdentifier)
    ss.addInstance(e.data.apiKey, e.data.appIdentifier)

}
