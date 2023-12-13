import { FDC3_PORT_TRANSFER_REQUEST_TYPE, FDC3_PORT_TRANSFER_RESPONSE_TYPE, exchange, exchangePostMessage } from "fdc3-common";
import { MAIN_HOST } from "./constants";

const appWindow = window.parent;  

window.addEventListener("load", () => {

    const sw = new SharedWorker(MAIN_HOST+'/src/server/SimpleServer.ts', {
        type: "module",
        name: "Demo FDC3 Server"
    })
    
    sw.port.start()
    
    // the other end to the app
    appWindow.postMessage({
        type: FDC3_PORT_TRANSFER_RESPONSE_TYPE,
    },"*", [sw.port])

   
})
