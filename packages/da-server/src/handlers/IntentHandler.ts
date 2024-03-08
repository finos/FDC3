import { AgentRequestMessage, FindIntentAgentRequest, FindIntentAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { Directory } from "../directory/DirectoryInterface";

export class IntentHandler implements MessageHandler {

    private readonly directory: Directory

    constructor(d: Directory) {
        this.directory = d
    }


    accept(msg: AgentRequestMessage, sc: ServerContext): void {
        switch (msg.type as string) {
            case 'findIntentRequest': return this.findIntentRequest(msg as FindIntentAgentRequest, sc)
        }
    }

    findIntentRequest(r: FindIntentAgentRequest, sc: ServerContext): void {
        const { intent, context, resultType } = r.payload

        const apps = this.directory.retrieveApps(context?.type, intent, resultType)
            .map(a => {
                return {
                    appId: a.appId
                }
            })

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
                    apps
                }
            }
        } as FindIntentAgentResponse

        sc.post(out)
    }




}
