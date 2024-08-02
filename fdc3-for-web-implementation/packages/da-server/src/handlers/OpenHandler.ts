import { MessageHandler } from "../BasicFDC3Server";
import { InstanceUUID, ServerContext } from "../ServerContext";
import { Directory, DirectoryApp } from "../directory/DirectoryInterface";
import { ContextElement, OpenError, ResolveError } from "@finos/fdc3";
import {
    AddContextListenerRequest,
    AppIdentifier, AppMetadata,
    BroadcastEvent,
    FindInstancesRequest,
    GetAppMetadataRequest,
    OpenRequest,
    WebConnectionProtocol4ValidateAppIdentity,
    WebConnectionProtocol5ValidateAppIdentityFailedResponse,
    WebConnectionProtocol5ValidateAppIdentitySuccessResponse
} from "@kite9/fdc3-common";
import { errorResponse, successResponse } from "./support";

enum AppState { Opening, DeliveringContext, Done }

class PendingApp {

    private readonly sc: ServerContext
    private readonly msg: OpenRequest
    readonly context: ContextElement | undefined
    readonly source: AppMetadata
    state: AppState = AppState.Opening
    private openedApp: AppIdentifier | undefined = undefined

    constructor(sc: ServerContext, msg: OpenRequest, context: ContextElement | undefined, source: AppIdentifier, timeoutMs: number) {
        this.context = context
        this.source = source
        this.sc = sc
        this.msg = msg

        setTimeout(() => {
            if (this.state != AppState.Done) {
                this.onError()
            }
        }, timeoutMs)
    }

    private onSuccess() {
        this.sc.setAppConnected(this.openedApp!!)
        successResponse(this.sc, this.msg, this.source, { appIdentifier: this.openedApp }, 'openResponse')
    }

    private onError() {
        errorResponse(this.sc, this.msg, this.source, OpenError.AppTimeout, 'openResponse')
    }

    setOpened(openedApp: AppIdentifier) {
        this.openedApp = openedApp
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
    readonly pending: Map<InstanceUUID, PendingApp> = new Map()
    readonly timeoutMs: number

    constructor(d: Directory, timeoutMs: number) {
        this.directory = d
        this.timeoutMs = timeoutMs
    }

    async accept(msg: any, sc: ServerContext, uuid: InstanceUUID): Promise<void> {
        switch (msg.type as string) {
            case 'openRequest': return this.open(msg as OpenRequest, sc, sc.getInstanceDetails(uuid))
            case 'findInstancesRequest': return this.findInstances(msg as FindInstancesRequest, sc, sc.getInstanceDetails(uuid))
            case 'getAppMetadataRequest': return this.getAppMetadata(msg as GetAppMetadataRequest, sc, sc.getInstanceDetails(uuid))

            case 'addContextListenerRequest': return this.handleAddContextListener(msg as AddContextListenerRequest, sc, sc.getInstanceDetails(uuid))

            case 'WCP4ValidateAppIdentity': return this.handleValidate(msg as WebConnectionProtocol4ValidateAppIdentity, sc, uuid)
        }
    }

    /**
     * This deals with sending pending context to listeners of newly-opened apps.
     */
    handleAddContextListener(arg0: AddContextListenerRequest, sc: ServerContext, from: AppIdentifier | undefined): void {
        if (from == undefined) {
            return
        }

        const instanceId = arg0.meta.source?.instanceId
        const pendingOpen = instanceId ? this.pending.get(instanceId) : undefined

        if (pendingOpen && instanceId) {
            const channelId = arg0.payload.channelId!!
            const contextType = arg0.payload.contextType

            if ((pendingOpen.context) && (pendingOpen.state == AppState.DeliveringContext)) {
                if ((contextType == pendingOpen.context.type) || (contextType == undefined)) {
                    // ok, we can deliver to this listener

                    const message: BroadcastEvent = {
                        meta: {
                            eventUuid: sc.createUUID(),
                            timestamp: new Date()
                        },
                        type: "broadcastEvent",
                        payload: {
                            channelId,
                            context: pendingOpen.context,
                            originatingApp: pendingOpen.source
                        }
                    }

                    pendingOpen.setDone()
                    this.pending.delete(instanceId)
                    sc.post(message, arg0.meta.source!!)
                }
            }
        }
    }

    filterPublicDetails(appD: DirectoryApp, appID: AppIdentifier): AppMetadata {
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

    getAppMetadata(arg0: GetAppMetadataRequest, sc: ServerContext, from: AppIdentifier | undefined): void {
        if (from == undefined) {
            return
        }

        const appID = arg0.payload.app
        const details = this.directory.retrieveAppsById(appID.appId)
        if (details.length > 0) {
            successResponse(sc, arg0, from, {
                appMetadata: this.filterPublicDetails(details[0], appID)
            }, 'getAppMetadataResponse')
        } else {
            errorResponse(sc, arg0, from, ResolveError.TargetAppUnavailable, 'getAppMetadataResponse')
        }
    }


    async findInstances(arg0: FindInstancesRequest, sc: ServerContext, from: AppIdentifier | undefined): Promise<void> {
        if (from == undefined) {
            return
        }

        const appId = arg0.payload.app.appId
        const openApps = await sc.getConnectedApps()
        const matching = openApps.filter(a => a.appId == appId)
        successResponse(sc, arg0, from, {
            appIdentifiers: matching
        }, 'findInstancesResponse')
    }

    async open(arg0: OpenRequest, sc: ServerContext, from: AppIdentifier | undefined): Promise<void> {
        if (from == undefined) {
            return
        }

        const source = arg0.payload.app
        const context = arg0.payload.context

        try {
            const uuid = await sc.open(source.appId)
            this.pending.set(uuid, new PendingApp(sc, arg0, context, from, this.timeoutMs))
        } catch (e: any) {
            errorResponse(sc, arg0, from, e.message, 'openResponse')
        }
    }

    async handleValidate(arg0: WebConnectionProtocol4ValidateAppIdentity, sc: ServerContext, from: InstanceUUID): Promise<void> {
        const _this = this

        const responseMeta = {
            connectionAttemptUuid: arg0.meta.connectionAttemptUuid,
            timestamp: new Date()
        }

        function returnSuccess(appIdentity: AppIdentifier) {
            const aopMetadata = _this.filterPublicDetails(_this.directory.retrieveAppsById(appIdentity.appId)[0], appIdentity)
            sc.post({
                meta: responseMeta,
                type: 'WCP5ValidateAppIdentityResponse',
                payload: {
                    appId: appIdentity.appId,
                    instanceId: appIdentity.instanceId,
                    instanceUuid: from,
                    implementationMetadata: {
                        provider: sc.provider(),
                        providerVersion: sc.providerVersion(),
                        fdc3Version: sc.fdc3Version(),
                        optionalFeatures: {
                            DesktopAgentBridging: false,
                            OriginatingAppMetadata: true,
                            UserChannelMembershipAPIs: true
                        },
                        appMetadata: aopMetadata
                    }
                }
            } as WebConnectionProtocol5ValidateAppIdentitySuccessResponse, appIdentity)
        }

        if (arg0.payload.instanceUuid) {
            // existing app reconnecting
            const instanceUUID: InstanceUUID = arg0.payload.instanceUuid
            const appIdentity = await sc.getInstanceDetails(arg0.payload.instanceUuid)

            if (appIdentity) {
                // in this case, the app is reconnecting, so let's just re-assign the 
                // identity
                await sc.setInstanceDetails(from, appIdentity)
                returnSuccess(appIdentity)
            } else {
                // we can't find the app, so we need to reject it
                sc.post({
                    meta: responseMeta,
                    payload: {
                        message: 'App Instance not found'
                    }
                } as WebConnectionProtocol5ValidateAppIdentityFailedResponse, instanceUUID)
            }
        } else {
            // we need to assign an identity to this app
            const appIdentity = {
                appId: arg0.payload.appId,
                instanceId: sc.createUUID()
            } as AppIdentifier
            await sc.setInstanceDetails(from, appIdentity)
            returnSuccess(appIdentity)

            // make sure if the opener is listening for this app to open gets informed
            const pendingOpen = this.pending.get(from)
            if (pendingOpen) {
                if (pendingOpen.state == AppState.Opening) {
                    pendingOpen.setOpened(appIdentity)
                }
            }
        }
    }
}