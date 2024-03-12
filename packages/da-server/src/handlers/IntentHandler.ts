import { AppMetadata, FindIntentAgentRequest, FindIntentAgentResponse, RaiseIntentAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { Directory } from "../directory/DirectoryInterface";
import { genericResultType } from "../directory/BasicDirectory";


type ListenerRegistration = {
    appId: string,
    instanceId: string,
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

function matches(lr1: ListenerRegistration, lr2: ListenerRegistration): boolean {
    return (lr1.appId == lr2.appId) &&
        (lr1.instanceId == lr2.instanceId) &&
        (lr1.intentName == lr2.intentName) &&
        (lr1.contextType == lr2.contextType) &&
        (lr1.resultType == lr2.resultType)
}


export class IntentHandler implements MessageHandler {

    private readonly directory: Directory
    private readonly regs: ListenerRegistration[] = []

    constructor(d: Directory) {
        this.directory = d
    }

    accept(msg: any, sc: ServerContext, from: AppMetadata): void {
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
    }

    raiseIntentRequest(arg0: RaiseIntentAgentRequest, sc: ServerContext): void {
        // simply forward the request on to the right app
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

        sc.post(out, arg0.payload.app)
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
