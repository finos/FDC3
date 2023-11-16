import { AppIdentifier, AppIntent, Context, IntentHandler, IntentResolution, Listener } from "@finos/fdc3";

export interface IntentSupport {
    
    findIntent(intent: string, context: Context, resultType: string | undefined) : Promise<AppIntent>

    findIntentsByContext(context: Context): Promise<AppIntent[]>

    raiseIntent(intent: string, context: Context, app: AppIdentifier | undefined) : Promise<IntentResolution>

    raiseIntentForContext(context: Context, app: AppIdentifier | undefined) : Promise<IntentResolution>

    addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>

}