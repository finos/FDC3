import { Context, AppIntent, AppIdentifier, IntentResolution, IntentHandler, Listener } from "@finos/fdc3";
import { IntentSupport } from "./IntentSupport";
import { Messaging } from "../Messaging";
import { AppDestinationIdentifier, FindIntentAgentRequest, FindIntentAgentRequestMeta, FindIntentAgentResponse, FindIntentsByContextAgentRequest, FindIntentsByContextAgentRequestMeta, FindIntentsByContextAgentResponse, RaiseIntentAgentRequest, RaiseIntentAgentRequestMeta, RaiseIntentAgentResponse, RaiseIntentResultAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { DefaultIntentResolution } from "./DefaultIntentResolution";
import { DefaultIntentListener } from "../listeners/DefaultIntentListener";

export class DefaultIntentSupport implements IntentSupport {
    
    readonly messaging: Messaging

    constructor(messaging: Messaging) {
        this.messaging = messaging
    }

    async findIntent(intent: string, context: Context, _resultType: string | undefined): Promise<AppIntent> {
        const messageOut : FindIntentAgentRequest = {
            type: "findIntentRequest",
            payload: {
                intent,
                context
            },
            meta: this.messaging.createMeta() as FindIntentAgentRequestMeta
        }

        const result = await this.messaging.exchange(messageOut, "findIntentResponse") as FindIntentAgentResponse

        return {
            intent: result.payload.appIntent.intent,
            apps: result.payload.appIntent.apps
        }
    }
    
    async findIntentsByContext(context: Context): Promise<AppIntent[]> {
        const messageOut : FindIntentsByContextAgentRequest = {
            type: "findIntentsByContextRequest",
            payload: {
                context
            },
            meta: this.messaging.createMeta() as FindIntentsByContextAgentRequestMeta
        }

        const result = await this.messaging.exchange(messageOut, "findIntentsByContextResponse") as FindIntentsByContextAgentResponse

        return result.payload.appIntents
    }

    async raiseIntentInner(intent: string | undefined, context: Context, app: AppIdentifier | undefined) : Promise<IntentResolution> {
        const messageOut : RaiseIntentAgentRequest = {
            type: "raiseIntentRequest",
            payload: {
                intent: intent as any, // raised #1157
                context: context,
                app: (app as AppDestinationIdentifier)
            },
            meta: this.messaging.createMeta() as RaiseIntentAgentRequestMeta
        }

        const resolution = await this.messaging.exchange(messageOut, "raiseIntentResponse") as RaiseIntentAgentResponse
        const details = resolution.payload.intentResolution 

        const resultPromise = this.messaging.waitFor<RaiseIntentResultAgentResponse>(
            m => m.meta.requestUuid == messageOut.meta.requestUuid
        )

        return new DefaultIntentResolution(
            this.messaging,
            resultPromise, 
            details.source,
            details.intent,
            details.version
        )
    }

    async raiseIntent(intent: string, context: Context, app?: AppIdentifier | undefined): Promise<IntentResolution> {
        return this.raiseIntentInner(intent, context, app)
    }

    raiseIntentForContext(context: Context, app?: AppIdentifier | undefined): Promise<IntentResolution> {
        return this.raiseIntentInner(undefined, context, app)
    }

    async addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
        return new DefaultIntentListener(this.messaging, intent, handler);
    }
    
}