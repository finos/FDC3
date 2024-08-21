import { ServerContext, InstanceID } from '../../src/ServerContext'
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
    private readonly instances: { [uuid: InstanceID]: string } = {}
    private nextInstanceId: number = 0
    private nextUUID: number = 0

    constructor(cw: CustomWorld) {
        this.cw = cw
    }

    getInstanceDetails(uuid: string) {
        const appId = this.instances[uuid]
        if (appId) {
            return {
                appId,
                instanceId: uuid
            }
        } else {
            return undefined
        }
    }

    setInstanceDetails(uuid: InstanceID, appId: AppIdentifier) {
        this.instances[uuid] = appId.appId
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
            this.instances[uuid] = appId
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

    async post(msg: object, to: InstanceID): Promise<void> {
        if (to == null) {
            this.postedMessages.push({ msg })
        } else {
            this.postedMessages.push({ msg, to: this.getInstanceDetails(to), uuid: to })
        }
    }

    log(message: string): void {
        this.cw.log(message)
    }

    /**
     * USED FOR TESTING
     */
    getInstanceUUID(appId: AppIdentifier): InstanceID {
        this.setInstanceDetails(appId.instanceId!!, appId)
        return appId.instanceId!!
    }
}