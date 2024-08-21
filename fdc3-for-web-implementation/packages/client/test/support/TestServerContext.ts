import { ServerContext, InstanceID } from '@kite9/da-server'
import { CustomWorld } from '../world'
import { OpenError, AppIdentifier } from '@finos/fdc3'


type MessageRecord = {
    to?: AppIdentifier,
    uuid?: InstanceID,
    msg: object
}

export class TestServerContext implements ServerContext {

    public postedMessages: MessageRecord[] = []
    private readonly cw: CustomWorld
    public connectedApps: AppIdentifier[] = []
    private readonly instances: { [uuid: InstanceID]: AppIdentifier } = {}
    private nextInstanceId: number = 0
    private nextUUID: number = 0
    private port: MessagePort

    constructor(cw: CustomWorld, port: MessagePort) {
        this.cw = cw
        this.port = port
    }

    getInstanceDetails(uuid: string) {
        return this.instances[uuid]
    }

    setInstanceDetails(uuid: InstanceID, app: AppIdentifier) {
        this.instances[uuid] = app
    }

    async disconnectApp(app: AppIdentifier): Promise<void> {
        this.connectedApps = this.connectedApps.filter(ca => ca.instanceId !== app.instanceId)
    }

    async open(appId: string): Promise<InstanceID> {
        const ni = this.nextInstanceId++
        if (appId.includes("missing")) {
            throw new Error(OpenError.AppNotFound)
        } else {
            const uuid = "uuid-" + ni
            const out = {
                appId,
                instanceId: "" + ni
            } as AppIdentifier
            this.instances[uuid] = out
            return uuid
        }
    }

    async setAppConnected(app: AppIdentifier): Promise<void> {
        this.connectedApps.push(app)
    }

    async getConnectedApps(): Promise<AppIdentifier[]> {
        return this.connectedApps
    }

    async isAppConnected(app: AppIdentifier): Promise<boolean> {
        const openApps = await this.getConnectedApps()
        const found = openApps.find(a => (a.appId == app.appId) && (a.instanceId == app.instanceId))
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
        for (let [key, value] of Object.entries(this.instances)) {
            if (value.instanceId === appId?.instanceId) {
                return key;
            }
        }

        return undefined;

    }

    post(msg: object, _to: InstanceID): Promise<void> {
        this.port.postMessage(msg)
        return Promise.resolve();
    }

    log(message: string): void {
        this.cw.log(message)
    }

}