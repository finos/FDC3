import { AppMetadata, ErrorMessage, FindIntentAgentRequest, FindIntentAgentResponse, RaiseIntentAgentErrorResponse, RaiseIntentAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { Directory } from "../directory/DirectoryInterface";
import { genericResultType } from "../directory/BasicDirectory";
import { ResolveError } from "@finos/fdc3";


type ListenerRegistration = {
    appId: string,
    instanceId: string | undefined,
    intentName: string,
    contextType: string | undefined,
    resultType: string | undefined
}

function createListenerRegistration(msg: any): ListenerRegistration {

    return {
        appId: msg.meta.source?.appId!!,
        instanceId: msg.meta.source?.instanceId!!,
        intentName: msg.payload.intentName,
        contextType: msg.payload.contextType,
        resultType: msg.payload.resultType
    }
}

function matches(template: ListenerRegistration, actual: ListenerRegistration): boolean {
    return (template.appId == actual.appId) &&
        ((template.instanceId == actual.instanceId) || (template.instanceId == undefined)) &&
        (template.intentName == actual.intentName) &&
        ((template.contextType == actual.contextType) || (template.contextType == undefined)) &&
        ((template.resultType == actual.resultType) || (template.resultType == undefined))
}

/**
 * Re-writes the request to forward it on to the target application
 */
async function forwardRequest(arg0: RaiseIntentAgentRequest, to: AppMetadata, sc: ServerContext): Promise<void> {
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

    constructor(r: RaiseIntentAgentRequest, sc: ServerContext, timeoutMs: number) {
        this.r = r
        this.expecting = {
            appId: r.payload.app.appId,
            instanceId: undefined,
            intentName: r.payload.intent,
            contextType: r.payload.context?.type,
            resultType: undefined
        }
        this.sc = sc

        // handle the timeout
        setTimeout(() => {
            if (!this.complete) {
                sendError(r, sc, ResolveError.IntentDeliveryFailed)
            }
        }, timeoutMs)
    }

    async accept(arg0: any): Promise<void> {
        if (this.complete) {
            return
        }

        if (arg0.type == 'onAddIntentListener') {
            const actual = createListenerRegistration(arg0)
            if (matches(this.expecting, actual)) {
                this.complete = true
                forwardRequest(this.r, arg0.meta.source, this.sc)
            }
        }
    }
}

export class IntentHandler implements MessageHandler {

    private readonly timeoutMs: number
    private readonly directory: Directory
    private readonly regs: ListenerRegistration[] = []
    private readonly pendingIntents: Set<PendingIntent> = new Set()

    constructor(d: Directory, timeoutMs: number = 8000) {
        this.directory = d
        this.timeoutMs = timeoutMs
    }

    async accept(msg: any, sc: ServerContext, from: AppMetadata): Promise<void> {
        switch (msg.type as string) {
            case 'findIntentRequest': return this.findIntentRequest(msg as FindIntentAgentRequest, sc, from)
            case 'raiseIntentRequest': return this.raiseIntentRequest(msg as RaiseIntentAgentRequest, sc)
            case 'onAddIntentListener': return this.onAddIntentListener(msg as any, sc)
            case 'onUnsubscribe': return this.onUnsubscribe(msg as any, sc)
        }
    }

    onUnsubscribe(arg0: any, _sc: ServerContext): void {
        const lr = createListenerRegistration(arg0)
        const fi = this.regs.findIndex((e) => matches(e, lr))
        if (fi > -1) {
            this.regs.splice(fi, 1)
        }
    }

    onAddIntentListener(arg0: any, _sc: ServerContext): void {
        const lr = createListenerRegistration(arg0)
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
        if (arg0.meta.destination.instanceId) {
            // ok, targeting a specific, known instance
            if (await sc.isAppOpen(arg0.meta.destination)) {
                return forwardRequest(arg0, arg0.meta.destination, sc)
            } else {
                // instance doesn't exist
                return sendError(arg0, sc, ResolveError.TargetInstanceUnavailable)
            }
        } else if (this.directory.retrieveAppsById(arg0.meta.destination.appId).length > 0) {
            // app exists but needs starting
            const pi = new PendingIntent(arg0, sc, this.timeoutMs)
            this.pendingIntents.add(pi)
            return sc.open(arg0.meta.destination.appId).then(() => { return undefined })
        } else {
            // app doesn't exist
            return sendError(arg0, sc, ResolveError.TargetAppUnavailable)
        }
    }

    findIntentRequest(r: FindIntentAgentRequest, sc: ServerContext, from: AppMetadata): void {
        const { intent, context, resultType } = r.payload

        const apps1 = this.directory.retrieveApps(context?.type, intent, resultType)
            .map(a => {
                return {
                    appId: a.appId,
                }
            }) as AppMetadata[]

        const apps2 = this.retrieveListeners(context?.type, intent, resultType).
            map(lr => {
                return {
                    appId: lr.appId,
                    instanceId: lr.instanceId
                }
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

    retrieveListeners(contextType: string | undefined, intentName: string, resultType: string | undefined): ListenerRegistration[] {

        function matches(i: ListenerRegistration): boolean {
            return ((intentName == undefined) || (i.intentName == intentName)) &&
                ((contextType == undefined) || (i.contextType == contextType)) &&
                ((resultType == undefined) || (i.resultType == resultType) || (genericResultType(i.resultType) == resultType))
        }

        return this.regs.filter(r => matches(r))
    }
}
