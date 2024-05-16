import { AppDestinationIdentifier, AppMetadata, BroadcastAgentRequest, FindInstancesAgentRequest, FindInstancesAgentResponse, GetAppMetadataAgentErrorResponse, GetAppMetadataAgentRequest, GetAppMetadataAgentResponse, GetAppMetadataAgentResponsePayload, OpenAgentErrorResponse, OpenAgentRequest, OpenAgentResponse, OpenAgentResponseMeta, OpenErrorMessage, PrivateChannelOnAddContextListenerAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { Directory, DirectoryApp } from "../directory/DirectoryInterface";
import { ContextElement, OpenError, ResolveError } from "@finos/fdc3";
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

class PendingContext {

    readonly context: ContextElement
    readonly source: AppMetadata
    private resolved: boolean = false
    private onSuccess: () => void

    constructor(context: ContextElement, source: AppMetadata,
        onSuccess: () => void,
        onError: () => void,
        timeoutMs: number) {
        this.context = context
        this.source = source
        this.onSuccess = onSuccess

        setTimeout(() => {
            if (!this.resolved) {
                onError()
            }
        }, timeoutMs)
    }

    resolve() {
        this.resolved = true
        this.onSuccess()
    }
}

export class OpenHandler implements MessageHandler {

    private readonly directory: Directory
    private readonly pendingContexts: Map<string, PendingContext> = new Map()

    readonly timeoutMs: number

    constructor(d: Directory, timeoutMs: number) {
        this.directory = d
        this.timeoutMs = timeoutMs
    }

    async accept(msg: any, sc: ServerContext, from: AppMetadata): Promise<void> {
        this.ensureRegisteredConnected(sc, from)

        switch (msg.type as string) {
            case 'openRequest': return this.open(msg as OpenAgentRequest, sc, from)
            case 'findInstancesRequest': return this.findInstances(msg as FindInstancesAgentRequest, sc, from)
            case 'getAppMetadataRequest': return this.getAppMetadata(msg as GetAppMetadataAgentRequest, sc, from)
            case 'onAddContextListener': return this.handleOnAddContextListener(msg as OnAddContextListenerAgentRequest, sc)
        }
    }

    ensureRegisteredConnected(sc: ServerContext, from: AppMetadata) {
        sc.setAppConnected(from)
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

                pendingContext.resolve()
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
        const openApps = await sc.getConnectedApps()
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

        function createErrorMessage(e: string): OpenAgentErrorResponse {
            const message: OpenAgentErrorResponse = {
                meta: createReplyMeta(arg0, sc),
                type: "openResponse",
                payload: {
                    error: e as OpenErrorMessage
                }
            }
            return message;
        }

        function createSuccessMessage(details: AppMetadata): OpenAgentResponse {
            const message: OpenAgentResponse = {
                meta: createReplyMeta(arg0, sc),
                type: "openResponse",
                payload: {
                    appIdentifier: details
                }
            }
            return message
        }

        const source = arg0.payload.app
        const context = arg0.payload.context

        try {
            const details = await sc.open(source.appId)
            if (context && details.instanceId) {
                this.pendingContexts.set(details.instanceId!!, new PendingContext(context, source,
                    () => sc.post(createSuccessMessage(details), from),
                    () => sc.post(createErrorMessage(OpenError.AppTimeout), from),
                    this.timeoutMs))
            } else {
                sc.post(createSuccessMessage(details), from)
            }
        } catch (e: any) {
            const message = createErrorMessage(e.message)
            sc.post(message, from)
        }
    }


}