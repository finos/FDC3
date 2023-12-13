import { SimpleServer } from "./SimpleServer";



export function handleBroadcast(e: MessageEvent, client: MessagePort, ss: SimpleServer) {
    // in this case, we are going to send the message to every _other_ client that 
    // is registered.

    console.log("Clients: "+ss.clients.size)

    Array.from(ss.clients.keys()).forEach(mp => {
        if (mp != client) {
            try {
                mp.postMessage(e.data)
            } catch (e) {
                console.error("Couldn't send: "+e)
            }
        }
    })
}
