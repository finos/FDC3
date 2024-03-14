
/**
 * This is a very basic implementation of the server side of the desktop agent. 
 * You can register message ports with it and plug in extra functionality to handle new message types. 
 */

import { DefaultFDC3Server } from "da-server/src/BasicFDC3Server"
import { FDC3_2_1_JSONDirectory } from "./FDC3_2_1_JSONDirectory"
import { ServerContext } from "da-server/src/ServerContext"
import { AppMetadata } from "@finos/fdc3/dist/bridging/BridgingTypes"
import { v4 as uuidv4 } from 'uuid'

export class SimpleServer {

    const fdc3: DefaultFDC3Server = new DefaultFDC3Server()

    register(client: MessagePort) {
        console.log("Added new listener")
        client.onmessage = (e) => {
            console.log("Received: " + e.data.type);
            Object.keys(this.actions).forEach(k => {
                if (k == e.data.type) {
                    console.log("Performing " + k)
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

        console.log("Added client. " + this.clients.size)
    }
}

const directory = new FDC3_2_1_JSONDirectory();
directory.load("./initial-apps.json")

class MessagePortServerContext implements ServerContext {



    createUUID(): string {
        return uuidv4();
    }

    post(message: object, to: AppMetadata): Promise<void> {
        throw new Error("Method not implemented.")
    }

    open(appId: string): Promise<AppMetadata> {
        throw new Error("Method not implemented.")
    }

    getOpenApps(): Promise<AppMetadata[]> {
        throw new Error("Method not implemented.")
    }

    isAppOpen(app: AppMetadata): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    log(message: string): void {
        console.log(message)
    }

    provider(): string {
        return "webFDC3-demo"
    }

    providerVersion(): string {
        return "0.1"
    }

    fdc3Version(): string {
        return "2.0"
    }

}



const theServer = new SimpleServer();

onconnect = function (event) {
    const port = event.ports[0]
    port.start()
    theServer.register(port)
}
