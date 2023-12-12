import { FDC3_PORT_TRANSFER_REQUEST_TYPE, FDC3_PORT_TRANSFER_RESPONSE_TYPE, exchange, exchangePostMessage } from "fdc3-common";

const appWindow = window.parent;  

window.addEventListener("load", () => {

    const sw = new SharedWorker('http://localhost:8080/src/SimpleServer.ts')
    sw.port.start()
    
    // the other end to the app
    appWindow.postMessage({
        type: FDC3_PORT_TRANSFER_RESPONSE_TYPE,
    },"*", [sw.port])

   
})
