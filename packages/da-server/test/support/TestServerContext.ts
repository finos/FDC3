import { ServerContext, InstanceID } from '../../src/ServerContext'
import { CustomWorld } from '../world'
import { OpenError, AppIdentifier, AppIntent, Context } from '@kite9/fdc3'

type ConnectionDetails = AppIdentifier & {
    msg?: object
    connected: boolean
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

    async narrowIntents(appIntents: AppIntent[], context: Context): Promise<AppIntent[]> {
        return appIntents
    }

    getInstanceDetails(uuid: string) {
        return this.instances.find(ca => ca.instanceId === uuid)
    }

    setInstanceDetails(uuid: InstanceID, appId: ConnectionDetails) {
        if (uuid != appId.instanceId) {
            throw new Error("UUID mismatch")
        }
        this.instances = this.instances.filter(ca => ca.instanceId !== uuid)
        this.instances.push(appId)
    }

    async disconnectApp(app: AppIdentifier): Promise<void> {
        this.instances = this.instances.filter(ca => ca.instanceId !== app.instanceId)
    }

    async open(appId: string): Promise<InstanceID> {
        const ni = this.nextInstanceId++
        if (appId.includes("missing")) {
            throw new Error(OpenError.AppNotFound)
        } else {
            const uuid = "uuid-" + ni
            this.instances.push({ appId, instanceId: uuid, connected: false })
            return uuid
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

    async post(msg: object, to: InstanceID): Promise<void> {
        if (to == null) {
            this.postedMessages.push({ msg })
        } else {
            const id = this.getInstanceDetails(to)
            const app = id ? {
                appId: id!!.appId,
                instanceId: id!!.instanceId
            } : undefined
            this.postedMessages.push({
                msg, to: app, uuid: to
            })
        }
    }

    log(message: string): void {
        this.cw.log(message)
    }

    /**
     * USED FOR TESTING
     */
    getInstanceUUID(appId: AppIdentifier): InstanceID {
        this.setInstanceDetails(appId.instanceId!!, {
            appId: appId.appId,
            instanceId: appId.instanceId,
            connected: true
        })
        return appId.instanceId!!
    }
}