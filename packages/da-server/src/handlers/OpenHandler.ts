import { AppDestinationIdentifier, AppMetadata, BroadcastAgentRequest, FindInstancesAgentRequest, FindInstancesAgentResponse, GetAppMetadataAgentErrorResponse, GetAppMetadataAgentRequest, GetAppMetadataAgentResponse, GetAppMetadataAgentResponsePayload, OpenAgentErrorResponse, OpenAgentRequest, OpenAgentResponse, OpenAgentResponseMeta, OpenErrorMessage, PrivateChannelOnAddContextListenerAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { Directory, DirectoryApp } from "../directory/DirectoryInterface";
import { ContextElement, ResolveError } from "@finos/fdc3";
import { OnAddContextListenerAgentRequest } from "@kite9/fdc3-common";

function filterPublicDetails(appD: DirectoryApp, appID: AppDestinationIdentifier): GetAppMetadataAgentResponsePayload['appMetadata'] {
    return {
        appId: appD.appId,
        name: appD.name,
        version: appD.version,
        title: appD.title,
        tooltip: appD.tooltip,
        description: appD.description,
        icons: appD.icons,
        screenshots: appD.screenshots,
        instanceId: appID.instanceId
    }
}

type BasicMeta = OpenAgentResponseMeta

function createReplyMeta(msg: any, sc: ServerContext): BasicMeta {
    return {
        requestUuid: msg.meta.requestUuid,
        responseUuid: sc.createUUID(),
        timestamp: new Date()
    }
}

type PendingContext = {
    context: ContextElement,
    source: AppMetadata
}

export class OpenHandler implements MessageHandler {

    private readonly directory: Directory
    private readonly pendingContexts: Map<string, PendingContext> = new Map()

    constructor(d: Directory) {
        this.directory = d
    }

    async accept(msg: any, sc: ServerContext, from: AppMetadata): Promise<void> {
        switch (msg.type as string) {
            case 'openRequest': return this.open(msg as OpenAgentRequest, sc, from)
            case 'findInstancesRequest': return this.findInstances(msg as FindInstancesAgentRequest, sc, from)
            case 'getAppMetadataRequest': return this.getAppMetadata(msg as GetAppMetadataAgentRequest, sc, from)
            case 'onAddContextListener': return this.handleOnAddContextListener(msg as OnAddContextListenerAgentRequest, sc)
        }
    }

    handleOnAddContextListener(arg0: PrivateChannelOnAddContextListenerAgentRequest | OnAddContextListenerAgentRequest, sc: ServerContext) {
        const instanceId = arg0.meta.source?.instanceId
        const pendingContext = instanceId ? this.pendingContexts.get(instanceId) : undefined

        if (pendingContext && instanceId) {
            const channelId = arg0.payload.channelId
            const contextType = arg0.payload.contextType

            if ((contextType == pendingContext.context.type) || (contextType == undefined)) {
                // ok, we can deliver to this listener

                const message: BroadcastAgentRequest = {
                    meta: {
                        requestUuid: sc.createUUID(),
                        source: pendingContext.source,
                        timestamp: new Date()
                    },
                    type: "broadcastRequest",
                    payload: {
                        channelId,
                        context: pendingContext.context
                    }
                }
                this.pendingContexts.delete(instanceId)
                sc.post(message, arg0.meta.source!!)
            }
        }
    }

    getAppMetadata(arg0: GetAppMetadataAgentRequest, sc: ServerContext, from: AppMetadata): void {
        const appID = arg0.payload.app
        const details = this.directory.retrieveAppsById(appID.appId)
        if (details.length > 0) {
            // returning first matching app record
            const response: GetAppMetadataAgentResponse = {
                type: "getAppMetadataResponse",
                meta: createReplyMeta(arg0, sc),
                payload: {
                    appMetadata: filterPublicDetails(details[0], appID)
                }
            }
            sc.post(response, from)
        } else {
            const response: GetAppMetadataAgentErrorResponse = {
                type: "getAppMetadataResponse",
                meta: createReplyMeta(arg0, sc),
                payload: {
                    error: ResolveError.TargetAppUnavailable
                }
            }
            sc.post(response, from)
        }
    }


    async findInstances(arg0: FindInstancesAgentRequest, sc: ServerContext, from: AppMetadata): Promise<void> {
        const appId = arg0.payload.app.appId
        const openApps = await sc.getOpenApps()
        const matching = openApps.filter(a => a.appId == appId)
        const response: FindInstancesAgentResponse = {
            type: 'findInstancesResponse',
            meta: createReplyMeta(arg0, sc),
            payload: {
                appIdentifiers: matching
            }
        }

        sc.post(response, from)
    }

    async open(arg0: OpenAgentRequest, sc: ServerContext, from: AppMetadata): Promise<void> {
        const source = arg0.payload.app
        const context = arg0.payload.context

        try {
            const details = await sc.open(source.appId)
            if (context && details.instanceId) {
                this.pendingContexts.set(details.instanceId!!, { context, source })
            }

            const message: OpenAgentResponse = {
                meta: createReplyMeta(arg0, sc),
                type: "openResponse",
                payload: {
                    appIdentifier: details
                }
            }

            sc.post(message, from)
        } catch (e: unknown) {
            const message: OpenAgentErrorResponse = {
                meta: createReplyMeta(arg0, sc),
                type: "openResponse",
                payload: {
                    error: ((e as Error).message as OpenErrorMessage)
                }
            }
            sc.post(message, from)
        }
    }


}