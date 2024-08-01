import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { Directory } from "../directory/DirectoryInterface";
import { AppIntent, AppMetadata, ResolveError } from "@finos/fdc3";
import {
    AddIntentListenerRequest,
    FindIntentRequest, FindIntentsByContextRequest,
    IntentEvent,
    IntentListenerUnsubscribeRequest,
    RaiseIntentRequest,
    RaiseIntentResponse,
    RaiseIntentResultResponse
} from "@kite9/fdc3-common";
import { errorResponse, successResponse } from "./support";


type ListenerRegistration = {
    appId: string | undefined,
    instanceId: string | undefined,
    intentName: string | undefined,
    listenerUUID: string
}

/**
 * Re-writes the request to forward it on to the target application
 */
async function forwardRequest(arg0: RaiseIntentRequest, from: AppMetadata, to: AppMetadata, sc: ServerContext, ih: IntentHandler): Promise<void> {
    const out: IntentEvent = {
        type: 'intentEvent',
        payload: {
            context: arg0.payload.context,
            intent: arg0.payload.intent,
            originatingApp: from
        },
        meta: {
            eventUuid: sc.createUUID(),
            timestamp: new Date()
        }
    }

    // register the resolution destination
    ih.pendingResolutions.set(arg0.meta.requestUuid, from)
    await sc.post(out, to)
    successResponse(sc, arg0, from, {
        intentResolution: {
            intent: arg0.payload.intent,
            source: to
        }
    }, 'raiseIntentResponse')
}

/**
 * A pending intent is one for an app that hasn't registered it's intent listener yet.
 * (Possibly it is being opened)
 * 
 * Pending intents wait for that registration and then message the app.
 */
class PendingIntent {

    complete: boolean = false
    r: RaiseIntentRequest
    expectingAppId: string
    expectingIntent: string
    sc: ServerContext
    ih: IntentHandler
    from: AppMetadata

    constructor(r: RaiseIntentRequest, sc: ServerContext, ih: IntentHandler, expectingAppId: string, expectingIntent: string, from: AppMetadata) {
        this.r = r
        this.expectingAppId = expectingAppId
        this.expectingIntent = expectingIntent
        this.sc = sc
        this.ih = ih
        this.from = from

        // handle the timeout
        setTimeout(() => {
            if (!this.complete) {
                errorResponse(sc, r, from, ResolveError.IntentDeliveryFailed, 'raiseIntentResponse')
                this.ih.pendingIntents.delete(this)
            }
        }, ih.timeoutMs)
    }

    async accept(arg0: ListenerRegistration): Promise<void> {
        if ((arg0.appId == this.expectingAppId) && (arg0.intentName == this.expectingIntent)) {
            this.complete = true
            this.ih.pendingIntents.delete(this)
            forwardRequest(this.r, this.from, { appId: arg0.appId, instanceId: arg0.instanceId }, this.sc, this.ih)
        }
    }
}

export class IntentHandler implements MessageHandler {

    private readonly directory: Directory
    private readonly regs: ListenerRegistration[] = []
    readonly pendingIntents: Set<PendingIntent> = new Set()
    readonly pendingResolutions: Map<string, AppMetadata> = new Map()
    readonly timeoutMs: number

    constructor(d: Directory, timeoutMs: number) {
        this.directory = d
        this.timeoutMs = timeoutMs
    }

    async accept(msg: any, sc: ServerContext, from: AppMetadata): Promise<void> {
        switch (msg.type as string) {
            case 'findIntentsByContextRequest': return this.findIntentsByContextRequest(msg as FindIntentsByContextRequest, sc, from)
            case 'findIntentRequest': return this.findIntentRequest(msg as FindIntentRequest, sc, from)
            case 'raiseIntentRequest': return this.raiseIntentRequest(msg as RaiseIntentRequest, sc, from)
            case 'addIntentListenerRequest': return this.onAddIntentListener(msg as AddIntentListenerRequest, sc, from)
            case 'intentListenerUnsubscribeRequest': return this.onUnsubscribe(msg as IntentListenerUnsubscribeRequest, sc, from)
            case 'raiseIntentResponse': return this.raiseIntentResponse(msg as RaiseIntentResponse, sc) /* ISSUE: 1303 */
            case 'raiseIntentResultResponse': return this.raiseIntentResultResponse(msg as RaiseIntentResultResponse, sc)
        }
    }

    /**
     * Called when target app handles an intent
     */
    raiseIntentResponse(arg0: RaiseIntentResponse, sc: ServerContext): void | PromiseLike<void> {
        const requestId = arg0.meta.requestUuid
        const to = this.pendingResolutions.get(requestId)
        if (to) {
            const out: RaiseIntentResponse = {
                meta: arg0.meta,
                type: "raiseIntentResponse",
                payload: arg0.payload
            }

            sc.post(out, to)
        }
    }

    raiseIntentResultResponse(arg0: RaiseIntentResultResponse, sc: ServerContext): void | PromiseLike<void> {
        const requestId = arg0.meta.requestUuid
        const to = this.pendingResolutions.get(requestId)
        if (to) {
            this.pendingResolutions.delete(requestId)
            const out: RaiseIntentResultResponse = {
                meta: arg0.meta,
                type: "raiseIntentResultResponse",
                payload: arg0.payload
            }

            sc.post(out, to)
        }
    }

    onUnsubscribe(arg0: IntentListenerUnsubscribeRequest, sc: ServerContext, from: AppMetadata): void {
        const id = arg0.payload.listenerUUID
        const fi = this.regs.findIndex((e) => e.listenerUUID == id)
        if (fi > -1) {
            this.regs.splice(fi, 1)
            successResponse(sc, arg0, from, {}, 'intentListenerUnsubscribeResponse')
        } else {
            errorResponse(sc, arg0, from, "Non-Existent Listener", 'intentListenerUnsubscribeResponse')
        }
    }

    onAddIntentListener(arg0: AddIntentListenerRequest, sc: ServerContext, from: AppMetadata): void {
        const lr = {
            appId: from.appId,
            instanceId: from.instanceId,
            intentName: arg0.payload.intent,
            listenerUUID: sc.createUUID()
        } as ListenerRegistration

        this.regs.push(lr)
        successResponse(sc, arg0, from, {
            listenerUUID: lr.listenerUUID
        }, 'addIntentListenerResponse')

        // see if this intent listener is the destination for any pending intents
        for (let x of this.pendingIntents) {
            x.accept(lr)
            if (x.complete) {
                this.pendingIntents.delete(x)
            }
        }
    }

    async appHandlesIntent(target: AppDestinationIdentifier, intentName: string, contextType: string | undefined): Promise<boolean> {
        return this.directory.retrieveIntents(contextType, intentName, undefined)
            .filter(i => i.appId == target.appId)
            .length > 0
    }

    async raiseIntentRequest(arg0: RaiseIntentRequest, sc: ServerContext, from: AppMetadata): Promise<void> {
        const target = arg0.payload.app
        if ((target?.appId) && (this.directory.retrieveAppsById(target.appId).length == 0)) {
            // app doesn't exist
            return errorResponse(sc, arg0, from, ResolveError.TargetAppUnavailable, 'raiseIntentResponse')
        } else if (!await this.appHandlesIntent(target, arg0.payload.intent, arg0.payload.context.type)) {
            // app doesn't handle the intent
            return errorResponse(sc, arg0, from, ResolveError.NoAppsFound, 'raiseIntentResponse')
        } else if (target?.instanceId) {
            if (await sc.isAppConnected(target)) {
                // ok, targeting a specific, known instance
                return forwardRequest(arg0, from, target, sc, this)
            } else {
                // instance doesn't exist
                return sendError(arg0, sc, ResolveError.TargetInstanceUnavailable)
            }
        } else {
            // app exists but needs starting
            const pi = new PendingIntent(arg0, sc, this)
            this.pendingIntents.add(pi)
            return sc.open(target.appId).then(() => { return undefined })
        }
    }

    async findIntentsByContextRequest(r: FindIntentsByContextRequest, sc: ServerContext, from: AppMetadata): Promise<void> {

        // TODO: Add result type
        const { context } = r.payload

        const apps1 = this.directory.retrieveIntents(context?.type, undefined, undefined)

        // fold apps so same intents aren't duplicated
        const apps2: AppIntent[] = []
        apps1.forEach(a1 => {
            const existing = apps2.find(a2 => a2.intent.name == a1.intentName)
            if (existing) {
                existing.apps.push({ appId: a1.appId })
            } else {
                apps2.push({
                    intent: {
                        name: a1.intentName,
                        displayName: a1.displayName ?? a1.intentName
                    },
                    apps: [
                        {
                            appId: a1.appId
                        }
                    ]
                })
            }
        })

        successResponse(sc, r, from, {
            appIntents: apps2
        }, 'findIntentsByContextResponse')
    }


    async findIntentRequest(r: FindIntentRequest, sc: ServerContext, from: AppMetadata): Promise<void> {
        const { intent, context, resultType } = r.payload

        // listeners for connected applications
        const apps2 = (await this.retrieveListeners(intent, sc))
            .map(lr => {
                return {
                    appId: lr.appId,
                    instanceId: lr.instanceId
                }
            }) as AppMetadata[]

        // directory entries
        const apps1 = this.directory.retrieveApps(context?.type, intent, resultType)
            .map(a => {
                return {
                    appId: a.appId,
                }
            })
            .filter(i => {
                // remove any directory entries that are already started
                const running = apps2.find(i2 => i2.appId == i.appId)
                return !running
            }) as AppMetadata[]

        // just need this for the (deprecated) display name
        const allMatchingIntents = this.directory.retrieveIntents(context?.type, intent, resultType)
        const displayName = (allMatchingIntents.length > 0) ? allMatchingIntents[0].displayName : undefined

        successResponse(sc, r, from, {
            appIntent: {
                intent: {
                    name: intent,
                    displayName
                },
                apps: [...apps1, ...apps2]
            }
        }, 'findIntentResponse')
    }

    async retrieveListeners(intentName: string | undefined, sc: ServerContext): Promise<ListenerRegistration[]> {
        const activeApps = await sc.getConnectedApps()
        const matching = this.regs.filter(r => r.intentName == intentName)

        console.log(`Matched listeners returned ${matching.length}`)
        const active = matching.filter(r => activeApps.find(a => a.instanceId == r.instanceId))
        console.log(`Active listeners returned ${active.length}`)

        return active
    }


}
