import { ServerContext, InstanceUUID } from '../../src/ServerContext'
import { v4 as uuidv4 } from 'uuid'
import { CustomWorld } from '../world'
import { OpenError, AppIdentifier } from '@finos/fdc3'


type MessageRecord = {
    to?: AppIdentifier,
    uuid?: InstanceUUID,
    msg: object
}

export class TestServerContext implements ServerContext {

    public postedMessages: MessageRecord[] = []
    private readonly cw: CustomWorld
    public connectedApps: AppIdentifier[] = []
    private readonly instances: { [uuid: InstanceUUID]: AppIdentifier } = {}
    private nextInstanceId: number = 0
    private nextUUID: number = 0

    constructor(cw: CustomWorld) {
        this.cw = cw
    }

    getInstanceDetails(uuid: string) {
        return this.instances[uuid]
    }

    setInstanceDetails(uuid: InstanceUUID, app: AppIdentifier) {
        this.instances[uuid] = app
    }

    async disconnectApp(app: AppIdentifier): Promise<void> {
        this.connectedApps = this.connectedApps.filter(ca => ca.instanceId !== app.instanceId)
    }

    async open(appId: string): Promise<InstanceUUID> {
        if (appId.includes("missing")) {
            throw new Error(OpenError.AppNotFound)
        } else {
            const uuid = "UUID-" + this.nextUUID++
            const out = {
                appId,
                instanceId: "" + this.nextInstanceId++
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
        return uuidv4()
    }

    getInstanceUUID(appId: AppIdentifier): InstanceUUID | undefined {
        for (let [key, value] of Object.entries(this.instances)) {
            if (value.instanceId === appId?.instanceId) {
                return key;
            }
        }

        return undefined;

    }

    async post(msg: object, to: AppIdentifier | InstanceUUID): Promise<void> {
        if (to == null) {
            this.postedMessages.push({ msg })
        } else if (typeof to === 'string') {
            const appId = this.instances[to as InstanceUUID]
            this.postedMessages.push({ msg, to: appId, uuid: to as InstanceUUID })
        } else {
            const instanceId = (to as any).instanceId!!
            const uuid = this.getInstanceUUID(instanceId) ?? "none"
            this.postedMessages.push({ msg, to: (to as any), uuid })
        }
    }

    log(message: string): void {
        this.cw.log(message)
    }

}