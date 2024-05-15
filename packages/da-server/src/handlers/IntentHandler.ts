import { AppMetadata, ErrorMessage, FindIntentAgentRequest, FindIntentAgentResponse, FindIntentsByContextAgentRequest, FindIntentsByContextAgentResponse, RaiseIntentAgentErrorResponse, RaiseIntentAgentRequest, RaiseIntentAgentResponse, RaiseIntentResultAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { Directory } from "../directory/DirectoryInterface";
import { genericResultTypeSame } from "../directory/BasicDirectory";
import { AppIntent, ResolveError } from "@finos/fdc3";
import { IntentResolutionChoiceAgentRequest, IntentResolutionChoiceAgentResponse, OnAddIntentListenerAgentRequest, OnUnsubscribeIntentListenerAgentRequest } from "@kite9/fdc3-common";


type ListenerRegistration = {
    appId: string | undefined,
    instanceId: string | undefined,
    intentName: string | undefined,
    contextType: string | undefined,
    resultType: string | undefined
}

function createListenerRegistrationNameOnly(msg: OnAddIntentListenerAgentRequest | OnUnsubscribeIntentListenerAgentRequest): ListenerRegistration {
    return {
        appId: msg.meta.source?.appId!!,
        instanceId: msg.meta.source?.instanceId!!,
        intentName: msg.payload.intent,
        contextType: undefined,
        resultType: undefined
    }
}

function sameOrUndefined(a: string | undefined, b: string | undefined) {
    return (a == b) || (a == undefined) || (b == undefined)
}

function matches(a: ListenerRegistration, b: ListenerRegistration): boolean {
    return (sameOrUndefined(a.appId, b.appId)) &&
        (a.intentName == b.intentName) &&
        (sameOrUndefined(a.contextType, b.contextType)) &&
        (genericResultTypeSame(a.resultType, b.resultType))
}

/**
 * Re-writes the request to forward it on to the target application
 */
async function forwardRequest(arg0: RaiseIntentAgentRequest, to: AppMetadata, sc: ServerContext, ih: IntentHandler): Promise<void> {
    const out: RaiseIntentAgentRequest = {
        type: 'raiseIntentRequest',
        payload: arg0.payload,
        meta: {
            source: arg0.meta.source,
            destination: arg0.payload.app,
            requestUuid: arg0.meta.requestUuid,
            timestamp: arg0.meta.timestamp
        }
    }

    // register the resolution destination
    ih.pendingResolutions.set(arg0.meta.requestUuid, arg0.meta.source)

    return sc.post(out, to)
}

async function sendError(arg0: RaiseIntentAgentRequest, sc: ServerContext, e: ErrorMessage) {
    const out: RaiseIntentAgentErrorResponse = {
        type: 'raiseIntentResponse',
        meta: {
            requestUuid: arg0.meta.requestUuid,
            responseUuid: sc.createUUID(),
            timestamp: new Date()
        },
        payload: {
            error: e
        }
    }

    sc.post(out, arg0.meta.source)
}


/**
 * A pending intent is one for an app that hasn't registered it's intent listener yet.
 * (Possibly it is being opened)
 * 
 * Pending intents wait for that registration and then message the app.
 */
class PendingIntent {

    complete: boolean = false
    r: RaiseIntentAgentRequest
    expecting: ListenerRegistration
    sc: ServerContext
    ih: IntentHandler

    constructor(r: RaiseIntentAgentRequest, sc: ServerContext, ih: IntentHandler) {
        this.r = r
        this.expecting = {
            appId: r.payload.app.appId,
            instanceId: undefined,
            intentName: r.payload.intent,
            contextType: r.payload.context?.type,
            resultType: undefined
        }
        this.sc = sc
        this.ih = ih

        // handle the timeout
        setTimeout(() => {
            if (!this.complete) {
                sendError(r, sc, ResolveError.IntentDeliveryFailed)
            }
        }, ih.timeoutMs)
    }

    async accept(arg0: any): Promise<void> {
        const actual = createListenerRegistrationNameOnly(arg0)
        if (matches(this.expecting, actual) && !this.complete) {
            this.complete = true
            forwardRequest(this.r, arg0.meta.source, this.sc, this.ih)
        }
    }
}

export class IntentHandler implements MessageHandler {

    private readonly directory: Directory
    private readonly regs: ListenerRegistration[] = []
    private readonly pendingIntents: Set<PendingIntent> = new Set()
    readonly pendingResolutions: Map<string, AppMetadata> = new Map()
    readonly timeoutMs: number

    constructor(d: Directory, timeoutMs: number) {
        this.directory = d
        this.timeoutMs = timeoutMs
    }

    async accept(msg: any, sc: ServerContext, from: AppMetadata): Promise<void> {
        switch (msg.type as string) {
            case 'findIntentsByContextRequest': return this.findIntentsByContextRequest(msg as FindIntentsByContextAgentRequest, sc, from)
            case 'findIntentRequest': return this.findIntentRequest(msg as FindIntentAgentRequest, sc, from)
            case 'raiseIntentRequest': return this.raiseIntentRequest(msg as RaiseIntentAgentRequest, sc)
            case 'onAddIntentListener': return this.onAddIntentListener(msg as OnAddIntentListenerAgentRequest, sc)
            case 'onUnsubscribeIntentListener': return this.onUnsubscribe(msg as OnUnsubscribeIntentListenerAgentRequest, sc)
            case 'raiseIntentResponse': return this.raiseIntentResponse(msg as RaiseIntentAgentResponse, sc)
            case 'raiseIntentResultResponse': return this.raiseIntentResultResponse(msg as RaiseIntentResultAgentResponse, sc)
            case 'intentResolutionChoice': return this.intentResolutionChoice(msg as IntentResolutionChoiceAgentRequest, from, sc)
        }
    }
    intentResolutionChoice(arg0: IntentResolutionChoiceAgentResponse, from: AppMetadata, sc: ServerContext): void | PromiseLike<void> {
        // currently, this is a no-op, just pass the same message to the app
        const out = arg0 as IntentResolutionChoiceAgentResponse
        sc.post(out, from)
    }


    raiseIntentResponse(arg0: RaiseIntentAgentResponse, sc: ServerContext): void | PromiseLike<void> {
        const requestId = arg0.meta.requestUuid
        const to = this.pendingResolutions.get(requestId)
        if (to) {
            const out: RaiseIntentAgentResponse = {
                meta: arg0.meta,
                type: "raiseIntentResponse",
                payload: arg0.payload
            }

            sc.post(out, to)
        }
    }

    raiseIntentResultResponse(arg0: RaiseIntentResultAgentResponse, sc: ServerContext): void | PromiseLike<void> {
        const requestId = arg0.meta.requestUuid
        const to = this.pendingResolutions.get(requestId)
        if (to) {
            this.pendingResolutions.delete(requestId)
            const out: RaiseIntentResultAgentResponse = {
                meta: arg0.meta,
                type: "raiseIntentResultResponse",
                payload: arg0.payload
            }

            sc.post(out, to)
        }
    }

    onUnsubscribe(arg0: OnUnsubscribeIntentListenerAgentRequest, _sc: ServerContext): void {
        const lr = createListenerRegistrationNameOnly(arg0)
        const fi = this.regs.findIndex((e) => matches(e, lr))
        if (fi > -1) {
            this.regs.splice(fi, 1)
        }
    }

    onAddIntentListener(arg0: OnAddIntentListenerAgentRequest, _sc: ServerContext): void {
        const lr = createListenerRegistrationNameOnly(arg0)
        this.regs.push(lr)

        // see if this intent listener is the destination for any pending intents
        for (let x of this.pendingIntents) {
            x.accept(arg0)
            if (x.complete) {
                this.pendingIntents.delete(x)
            }
        }
    }

    async raiseIntentRequest(arg0: RaiseIntentAgentRequest, sc: ServerContext): Promise<void> {
        const target = arg0.payload.app
        if (target.instanceId) {
            // ok, targeting a specific, known instance
            if (await sc.isAppOpen(target)) {
                return forwardRequest(arg0, target, sc, this)
            } else {
                // instance doesn't exist
                return sendError(arg0, sc, ResolveError.TargetInstanceUnavailable)
            }
        } else if (this.directory.retrieveAppsById(target.appId).length > 0) {
            // app exists but needs starting
            const pi = new PendingIntent(arg0, sc, this)
            this.pendingIntents.add(pi)
            return sc.open(target.appId).then(() => { return undefined })
        } else {
            // app doesn't exist
            return sendError(arg0, sc, ResolveError.TargetAppUnavailable)
        }
    }

    findIntentsByContextRequest(r: FindIntentsByContextAgentRequest, sc: ServerContext, from: AppMetadata): void {

        // TODO: Add result type
        const { context } = r.payload

        const apps1 = this.directory.retrieveIntents(context?.type, undefined).map(di => {
            return {
                intent: {
                    name: di.intentName
                },
                apps: [
                    {
                        appId: di.appId
                    }
                ]
            } as AppIntent
        })

        const out = {
            meta: {
                requestUuid: r.meta.requestUuid,
                timestamp: new Date(),
                responseUuid: sc.createUUID()
            },
            type: "findIntentsByContextResponse",
            payload: {
                appIntents: [
                    ...apps1
                ]
            }
        } as FindIntentsByContextAgentResponse

        sc.post(out, from)
    }


    findIntentRequest(r: FindIntentAgentRequest, sc: ServerContext, from: AppMetadata): void {
        const { intent, context, resultType } = r.payload

        const apps2 = this.retrieveListeners(context?.type, intent, resultType, sc).
            map(lr => {
                return {
                    appId: lr.appId,
                    instanceId: lr.instanceId
                }
            }) as AppMetadata[]

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



        const out = {
            meta: {
                requestUuid: r.meta.requestUuid,
                timestamp: new Date(),
                responseUuid: sc.createUUID()
            },
            type: "findIntentResponse",
            payload: {
                appIntent: {
                    intent: {
                        name: r.payload.intent
                    },
                    apps: [...apps1, ...apps2]
                }
            }
        } as FindIntentAgentResponse

        sc.post(out, from)
    }

    retrieveListeners(contextType: string | undefined, intentName: string | undefined, resultType: string | undefined, sc: ServerContext): ListenerRegistration[] {
        const template: ListenerRegistration = {
            appId: undefined,
            instanceId: undefined,
            contextType,
            intentName,
            resultType
        }

        const matching = this.regs.filter(r => matches(template, r))
        const active = matching.filter(async r => await sc.isAppOpen({
            instanceId: r.instanceId,
            appId: r.appId!!
        }))

        return active
    }


}
