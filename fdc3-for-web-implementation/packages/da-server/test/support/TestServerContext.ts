import { ServerContext } from '../../src/ServerContext'
import { v4 as uuidv4 } from 'uuid'
import { CustomWorld } from '../world'
import { AppMetadata } from '@finos/fdc3/dist/bridging/BridgingTypes'
import { OpenError } from '@finos/fdc3'

type MessageRecord = {
    to: AppMetadata,
    msg: object
}

export class TestServerContext implements ServerContext {

    public postedMessages: MessageRecord[] = []
    private readonly cw: CustomWorld
    public connectedApps: AppMetadata[] = []
    private nextInstanceId: number = 0

    constructor(cw: CustomWorld) {
        this.cw = cw
    }

    async setAppConnected(app: AppMetadata): Promise<void> {
        this.connectedApps.push(app)
    }

    async disconnectApp(app: AppMetadata): Promise<void> {
        this.connectedApps = this.connectedApps.filter(ca => ca.instanceId !== app.instanceId)
    }

    async open(appId: string): Promise<AppMetadata> {
        if (appId.includes("missing")) {
            throw new Error(OpenError.AppNotFound)
        } else {
            const out = {
                appId,
                instanceId: "" + this.nextInstanceId++
            } as AppMetadata
            return out
        }
    }

    async getConnectedApps(): Promise<AppMetadata[]> {
        return this.connectedApps
    }

    async isAppConnected(app: AppMetadata): Promise<boolean> {
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

    post(msg: object, to: AppMetadata): Promise<void> {
        this.postedMessages.push({ msg, to })
        return Promise.resolve();
    }

    log(message: string): void {
        this.cw.log(message)
    }

}