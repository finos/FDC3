import { AppDestinationIdentifier, AppMetadata, BroadcastAgentRequest, ConnectionStep2Hello, FindInstancesAgentRequest, FindInstancesAgentResponse, GetAppMetadataAgentErrorResponse, GetAppMetadataAgentRequest, GetAppMetadataAgentResponse, GetAppMetadataAgentResponsePayload, OpenAgentErrorResponse, OpenAgentRequest, OpenAgentResponse, OpenAgentResponseMeta, OpenErrorMessage, PrivateChannelOnAddContextListenerAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
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

enum AppState { Opening, DeliveringContext, Done }

class PendingApps {

    readonly context: ContextElement | undefined
    readonly source: AppMetadata
    state: AppState = AppState.Opening
    private onSuccess: () => void

    constructor(context: ContextElement | undefined, source: AppMetadata,
        onSuccess: () => void,
        onError: () => void,
        timeoutMs: number) {
        this.context = context
        this.source = source
        this.onSuccess = onSuccess

        setTimeout(() => {
            if (this.state != AppState.Done) {
                onError()
            }
        }, timeoutMs)
    }

    setOpened() {
        if (this.context) {
            this.state = AppState.DeliveringContext
        } else {
            this.setDone()
        }
    }

    setDone() {
        this.state = AppState.Done
        this.onSuccess()
    }
}

export class OpenHandler implements MessageHandler {

    private readonly directory: Directory
    private readonly pending: Map<string, PendingApps> = new Map()

    readonly timeoutMs: number

    constructor(d: Directory, timeoutMs: number) {
        this.directory = d
        this.timeoutMs = timeoutMs
    }

    async accept(msg: any, sc: ServerContext, from: AppMetadata): Promise<void> {
        switch (msg.type as string) {
            case 'openRequest': return this.open(msg as OpenAgentRequest, sc, from)
            case 'findInstancesRequest': return this.findInstances(msg as FindInstancesAgentRequest, sc, from)
            case 'getAppMetadataRequest': return this.getAppMetadata(msg as GetAppMetadataAgentRequest, sc, from)
            case 'onAddContextListener': return this.handleOnAddContextListener(msg as OnAddContextListenerAgentRequest, sc)
            case 'hello': return this.handleHello(msg as ConnectionStep2Hello, sc, from)
        }
    }

    handleOnAddContextListener(arg0: PrivateChannelOnAddContextListenerAgentRequest | OnAddContextListenerAgentRequest, sc: ServerContext) {
        const instanceId = arg0.meta.source?.instanceId
        const pendingOpen = instanceId ? this.pending.get(instanceId) : undefined

        if (pendingOpen && instanceId) {
            const channelId = arg0.payload.channelId
            const contextType = arg0.payload.contextType

            if ((pendingOpen.context) && (pendingOpen.state == AppState.DeliveringContext)) {
                if ((contextType == pendingOpen.context.type) || (contextType == undefined)) {
                    // ok, we can deliver to this listener

                    const message: BroadcastAgentRequest = {
                        meta: {
                            requestUuid: sc.createUUID(),
                            source: pendingOpen.source,
                            timestamp: new Date()
                        },
                        type: "broadcastRequest",
                        payload: {
                            channelId,
                            context: pendingOpen.context
                        }
                    }

                    pendingOpen.setDone()
                    this.pending.delete(instanceId)
                    sc.post(message, arg0.meta.source!!)
                }
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
            this.pending.set(details.instanceId!!, new PendingApps(context, source,
                () => sc.post(createSuccessMessage(details), from),
                () => sc.post(createErrorMessage(OpenError.AppTimeout), from),
                this.timeoutMs))
        } catch (e: any) {
            const message = createErrorMessage(e.message)
            sc.post(message, from)
        }
    }

    handleHello(_arg0: ConnectionStep2Hello, sc: ServerContext, opening: AppMetadata): void | PromiseLike<void> {
        sc.setAppConnected(opening)

        const instanceId = opening.instanceId
        const pendingOpen = instanceId ? this.pending.get(instanceId) : undefined

        if (pendingOpen) {
            if (pendingOpen.state == AppState.Opening) {
                pendingOpen.setOpened()
            }
        }
    }
}