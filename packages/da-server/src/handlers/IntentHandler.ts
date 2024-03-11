import { AgentRequestMessage, AppMetadata, FindIntentAgentRequest, FindIntentAgentResponse, RaiseIntentAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
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

export class IntentHandler implements MessageHandler {

    private readonly directory: Directory
    private readonly regs: ListenerRegistration[] = []

    constructor(d: Directory) {
        this.directory = d
    }

    connect(_sc: ServerContext): void {
    }

    disconnect(_app: AppMetadata, _sc: ServerContext): void {
    }

    accept(msg: AgentRequestMessage, sc: ServerContext): void {
        switch (msg.type as string) {
            case 'findIntentRequest': return this.findIntentRequest(msg as FindIntentAgentRequest, sc)
            case 'raiseIntentRequest': return this.raiseIntentRequest(msg as RaiseIntentAgentRequest, sc)
            case 'onAddIntentListener': return this.onAddIntentListener(msg as PC)
        }
    }

    raiseIntentRequest(arg0: RaiseIntentAgentRequest, sc: ServerContext): void {
        throw new Error("Method not implemented.");
    }

    findIntentRequest(r: FindIntentAgentRequest, sc: ServerContext): void {
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

        sc.post(out)
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
