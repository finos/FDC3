import { AppIdentifier, AppMetadata, ImplementationMetadata, OpenError, ResolveError } from "@kite9/fdc3-standard";
import { Context } from "@kite9/fdc3-context";
import { AppSupport } from "./AppSupport";
import { Messaging } from "../Messaging";
import { BrowserTypes } from "@kite9/fdc3-schema"
import { GetInfoRequest, GetInfoResponse, OpenResponse } from "@kite9/fdc3-schema/generated/api/BrowserTypes";

type FindInstancesRequest = BrowserTypes.FindInstancesRequest
type GetAppMetadataResponse = BrowserTypes.GetAppMetadataResponse
type FindInstancesResponse = BrowserTypes.FindInstancesResponse
type GetAppMetadataRequest = BrowserTypes.GetAppMetadataRequest
type OpenRequest = BrowserTypes.OpenRequest

export class DefaultAppSupport implements AppSupport {

    readonly messaging: Messaging

    constructor(messaging: Messaging) {
        this.messaging = messaging
    }

    findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
        const request: FindInstancesRequest = {
            type: "findInstancesRequest",
            payload: {
                app
            },
            meta: this.messaging.createMeta()
        };

        return this.messaging.exchange<FindInstancesResponse>(request, "findInstancesResponse").then(d => {
            return d.payload.appIdentifiers ?? [];
        });
    }

    getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
        const request: GetAppMetadataRequest = {
            type: "getAppMetadataRequest",
            payload: {
                app: app as AppIdentifier
            },
            meta: this.messaging.createMeta()
        }

        return this.messaging.exchange<GetAppMetadataResponse>(request, "getAppMetadataResponse").then(d => {
            if (d.payload.appMetadata){
                return d.payload.appMetadata;
            } else {
                //should never happen as an error returned will be thrown
                throw new Error(ResolveError.TargetAppUnavailable);
            }
        });
    }

    async open(app: AppIdentifier, context?: Context | undefined): Promise<AppIdentifier> {
        const request: OpenRequest = {
            type: "openRequest",
            payload: {
                app: {
                    appId: app.appId,
                    instanceId: app.instanceId,
                },
                context
            },
            meta: this.messaging.createMeta()
        };

        const out = await this.messaging.exchange<OpenResponse>(request, "openResponse", OpenError.AppTimeout);
        if (out.payload.appIdentifier) {
            return out.payload.appIdentifier;
        } else {
            //should never happen as an error returned will be thrown
            throw new Error(OpenError.AppNotFound);
        }
        
    }

    async getImplementationMetadata(): Promise<ImplementationMetadata> {
        const request: GetInfoRequest = {
            type: "getInfoRequest",
            payload: {},
            meta: this.messaging.createMeta()
        } 

        const out = await this.messaging.exchange<GetInfoResponse>(request, "getInfoResponse", OpenError.AppTimeout);
        if (out.payload.implementationMetadata) {
            return out.payload.implementationMetadata;
        } else {
            //should never happen as an error returned will be thrown
            const unknownImpl: ImplementationMetadata = {
                fdc3Version: "unknown",
                provider: "unknown",
                appMetadata: {appId: "unknown", instanceId: "unknown" },
                optionalFeatures: {
                    OriginatingAppMetadata: false,
                    UserChannelMembershipAPIs: false,
                    DesktopAgentBridging: false
                }
            };
            return unknownImpl;
        }
        
    }

}