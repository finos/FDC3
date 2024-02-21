import { AppIdentifier, AppMetadata, Context } from "@finos/fdc3";
import { AppSupport } from "./AppSupport";
import { Messaging } from "../Messaging";
import { AppDestinationIdentifier, GetAppMetadataAgentRequest, GetAppMetadataAgentRequestMeta, GetAppMetadataAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";


export class DefaultAppSupport implements AppSupport {

    readonly messaging: Messaging
    readonly appIdentifier: AppIdentifier
    private thisAppMetadata: AppMetadata | null = null

    constructor(messaging: Messaging, appIdentifier: AppIdentifier) {
        this.messaging = messaging
        this.appIdentifier = appIdentifier
    }

    hasDesktopAgentBridging(): boolean {
        return true
    }

    hasOriginatingAppMetadata(): boolean {
        return true
    }
    
    findInstances(_app: AppIdentifier): Promise<AppIdentifier[]> {
        throw new Error("Method not implemented.");
    }

    getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
        const request : GetAppMetadataAgentRequest = {
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

    open(_app: AppIdentifier, _context?: Context | undefined): Promise<AppIdentifier> {
        throw new Error("Method not implemented.");
    }
    
    async getThisAppMetadata(): Promise<AppMetadata> {
        if (!this.thisAppMetadata) {
            this.thisAppMetadata = await this.getAppMetadata(this.appIdentifier)
        }
        
        return this.thisAppMetadata
    }
    
}