import { ServerContext, InstanceID } from '@kite9/fdc3-web-impl'
import { CustomWorld } from '../world'
import { OpenError, AppIdentifier, AppIntent, Context } from '@kite9/fdc3'

type ConnectionDetails = AppIdentifier & {
    msg?: object
    connected: boolean,
    connectionId: string,
    externalPort: MessagePort,
    internalPort: MessagePort,
    url: string
}

type MessageRecord = {
    to?: AppIdentifier,
    uuid?: InstanceID,
    msg: object
}

export class TestServerContext implements ServerContext<ConnectionDetails> {

    public postedMessages: MessageRecord[] = []
    private readonly cw: CustomWorld
    private instances: ConnectionDetails[] = []
    private nextInstanceId: number = 0
    private nextUUID: number = 0

    constructor(cw: CustomWorld) {
        this.cw = cw
    }

    async narrowIntents(appIntents: AppIntent[], _context: Context): Promise<AppIntent[]> {
        return appIntents
    }

    getInstanceDetails(uuid: string) {
        return this.instances.find(ca => ca.instanceId === uuid)
    }

    setInstanceDetails(uuid: InstanceID, appId: ConnectionDetails) {
        this.instances = this.instances.filter(ca => ca.connectionId !== uuid)
        this.instances.push({
            ...appId,
            connectionId: uuid
        })
    }

    getMatchingInstance(url: string): ConnectionDetails | undefined {
        return this.instances.find(ca => ca.url === url)
    }

    async disconnectApp(app: AppIdentifier): Promise<void> {
        this.instances = this.instances.filter(ca => ca.instanceId !== app.instanceId)
    }

    async shutdown(): Promise<void> {
        await Promise.all(this.instances.map(i => i.internalPort.close()))
        await Promise.all(this.instances.map(i => i.externalPort.close()))
    }

    async open(appId: string): Promise<InstanceID> {
        const ni = this.nextInstanceId++
        if (appId.includes("missing")) {
            throw new Error(OpenError.AppNotFound)
        } else {
            const mc = new MessageChannel()
            const internalPort = mc.port1
            const externalPort = mc.port2;

            (internalPort as any).name = "internalPort-" + ni;
            (externalPort as any).name = "externalPort-" + ni;

            internalPort.start()

            const connectionDetails = {
                appId,
                instanceId: "uuid-" + ni,
                connected: false,
                connectionId: "uuid-" + ni,
                externalPort,
                internalPort,
                url: "https://dummyOrigin.test/path"
            }

            this.instances.push(connectionDetails)
            internalPort.onmessage = (msg) => {
                console.log(`Received message on internalPort ${appId}: ${JSON.stringify(msg.data)}`)
                this.cw.mockFDC3Server?.receive(msg.data, connectionDetails.instanceId)
            }

            return connectionDetails.connectionId
        }
    }

    async setAppConnected(app: AppIdentifier): Promise<void> {
        this.instances.find(ca => (ca.instanceId == app.instanceId))!!.connected = true
    }

    async getConnectedApps(): Promise<AppIdentifier[]> {
        return this.instances.filter(ca => ca.connected).map(x => {
            return {
                appId: x.appId,
                instanceId: x.instanceId
            }
        })
    }

    async isAppConnected(app: AppIdentifier): Promise<boolean> {
        const found = this.instances.find(a => (a.appId == app.appId) && (a.instanceId == app.instanceId) && (a.connected))
        return found != null
    }

    provider(): string {
        return "cucumber-provider"
    }
    providerVersion(): string {
        return "1.2.3.TEST"
    }
    fdc3Version(): string {
        return "2.0"
    }

    createUUID(): string {
        return "uuid" + this.nextUUID++
    }

    /**
     * USED FOR TESTING
     */
    getInstanceUUID(appId: AppIdentifier): InstanceID | undefined {
        return this.instances.find(ca => (ca.appId == appId.appId) && (ca.instanceId == appId.instanceId) && (ca.connected))?.instanceId
    }

    /**
     * USED FOR TESTING
     */
    getFirstInstance() {
        return this.instances[0]
    }

    post(msg: object, to: InstanceID): Promise<void> {
        const details = this.getInstanceDetails(to)
        details?.internalPort.postMessage(msg)
        return Promise.resolve();
    }

    log(message: string): void {
        this.cw.log(message)
    }

}