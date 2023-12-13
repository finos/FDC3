
/**
 * This is a very basic implementation of the server side of the desktop agent. 
 * You can register message ports with it and plug in extra functionality to handle new message types. 
 */

import { Context } from "@finos/fdc3"
import { v4 as uuidv4 } from "uuid"
import { handleHandshake } from "./handshake"
import { ConnectionStep2Hello, ConnectionStep3Handshake } from "@finos/fdc3/dist/bridging/BridgingTypes"

declare var onconnect : any

type ClientData = {
    hello: ConnectionStep2Hello,
    handshake: ConnectionStep3Handshake
}

export class SimpleServer {

    private readonly channelsState: Record<string, Context[]> 
    private readonly actions : Record<string, (e: MessageEvent<any>, client: MessagePort, ss: SimpleServer) => void> 
    private readonly clients : Map<MessagePort, ClientData> = new Map()

    constructor(actions) {
        this.channelsState = {}
        this.actions = actions
    }

    createUUID(): string {
        return uuidv4();
    }
    
    register(client: MessagePort) {
        console.log("Added new listener")
        client.onmessage = (e) => {
            console.log("Received: "+e.data.type);
            Object.keys(this.actions).forEach(k => {
                if (k == e.data.type) {
                    console.log("Performing "+k)
                    const action = this.actions[k]
                    action(e, client, this);
                }    
            })
        }
    }

    addClient(mp: MessagePort, hello: ConnectionStep2Hello, handshake: ConnectionStep3Handshake) {
        this.clients.set(mp, {
            hello,
            handshake
        })
    }
}

const theServer = new SimpleServer({
    "hello" : handleHandshake
});

onconnect = function (event) {
    const port = event.ports[0]
    theServer.register(port)
}
