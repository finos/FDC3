import { AppIdentifier, AppMetadata, Context } from "@finos/fdc3";
import { AppSupport } from "./AppSupport";
import { Messaging } from "../Messaging";
import { AppDestinationIdentifier, FindInstancesAgentRequest, FindInstancesAgentRequestMeta, FindInstancesAgentResponse, GetAppMetadataAgentRequest, GetAppMetadataAgentRequestMeta, GetAppMetadataAgentResponse, OpenAgentRequest, OpenAgentRequestMeta } from "@finos/fdc3/dist/bridging/BridgingTypes";


export class DefaultAppSupport implements AppSupport {

    readonly messaging: Messaging
    readonly appIdentifier: AppIdentifier
    private thisAppMetadata: AppMetadata | null = null
    private readonly desktopAgent: string

    constructor(messaging: Messaging, appIdentifier: AppIdentifier, desktopAgent: string) {
        this.messaging = messaging
        this.appIdentifier = appIdentifier
        this.desktopAgent = desktopAgent
    }

    hasDesktopAgentBridging(): boolean {
        return true
    }

    hasOriginatingAppMetadata(): boolean {
        return true
    }

    findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
        const request: FindInstancesAgentRequest = {
            type: "findInstancesRequest",
            payload: {
                app
            },
            meta: this.messaging.createMeta() as FindInstancesAgentRequestMeta
        }

        return this.messaging.exchange<FindInstancesAgentResponse>(request, "findInstancesResponse").then(d => {
            return d.payload.appIdentifiers
        });
    }

    getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
        const request: GetAppMetadataAgentRequest = {
            type: "getAppMetadataRequest",
            payload: {
                app: app as AppDestinationIdentifier
            },
            meta: this.messaging.createMeta() as GetAppMetadataAgentRequestMeta
        }

        return this.messaging.exchange<GetAppMetadataAgentResponse>(request, "getAppMetadataResponse").then(d => {
            return d.payload.appMetadata
        });
    }

    open(app: AppIdentifier, context?: Context | undefined): Promise<AppIdentifier> {
        const request: OpenAgentRequest = {
            type: "openRequest",
            payload: {
                app: {
                    appId: app.appId,
                    instanceId: app.instanceId,
                    desktopAgent: this.desktopAgent
                },
                context
            },
            meta: this.messaging.createMeta() as OpenAgentRequestMeta
        }

        return this.messaging.exchange<any>(request, "openResponse")
            .then(d => {
                const error = d.payload.error
                if (error) {
                    throw new Error(error)
                }
                return d.payload.appIdentifier
            })
    }

    async getThisAppMetadata(): Promise<AppMetadata> {
        if (!this.thisAppMetadata) {
            this.thisAppMetadata = await this.getAppMetadata(this.appIdentifier)
        }

        return this.thisAppMetadata
    }

}