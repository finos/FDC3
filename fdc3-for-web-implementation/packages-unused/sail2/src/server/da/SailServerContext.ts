import { AppMetadata } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { ServerContext } from "da-server";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid'
import { DA_OPEN, FDC3_APP_EVENT } from "./message-types";



export class SailServerContext implements ServerContext {

    readonly serverSocket: Socket
    readonly apps: Map<AppMetadata, Socket> = new Map()

    constructor(socket: Socket) {
        this.serverSocket = socket;
    }

    createUUID(): string {
        return uuidv4()
    }

    async post(message: object, to: AppMetadata): Promise<void> {
        const ent = Array.from(this.apps.entries()).find(e => this.matches(e[0], to))
        if (ent) {
            ent[1].emit(FDC3_APP_EVENT, message)
        } else {
            this.log(`Can't find app: ${JSON.stringify(to)}`)
        }
    }

    async open(appId: string): Promise<AppMetadata> {
        const instanceId = uuidv4()
        const metadata = {
            appId,
            instanceId
        } as AppMetadata
        this.serverSocket.emit(DA_OPEN, metadata)
        return metadata
    }

    getOpenApps(): Promise<AppMetadata[]> {
        return Promise.resolve(Array.from(this.apps.keys()))
    }

    matches(a: AppMetadata, b: AppMetadata): boolean {
        return (a.appId == b.appId) && (a.instanceId == b.instanceId)
    }

    async isAppOpen(app: AppMetadata): Promise<boolean> {
        const openApps = await this.getOpenApps()
        const found = openApps.find(a => this.matches(app, a))
        return found != null
    }

    log(message: string): void {
        console.log(message)
    }

    provider(): string {
        return "FDC3 Sail"
    }

    providerVersion(): string {
        return "2.0"
    }

    fdc3Version(): string {
        return "2.0"
    }

    /**
     * Called when an app connects to the server
     */
    connect(appId: AppMetadata, socket: Socket) {
        this.apps.set(appId, socket)
    }

    /**
     * Called when an app disconnects from the server
     */
    disconnect(socket: Socket) {
        const ent = Array.from(this.apps.entries()).find(e => e[1].id == socket.id)
        if (ent) {
            this.apps.delete(ent[0])
        }
    }

}