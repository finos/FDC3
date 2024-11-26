import { AppIdentifier, AppIntent, IntentHandler, IntentResolution, Listener } from "@kite9/fdc3-standard";
import { Context } from "@kite9/fdc3-context";

export interface IntentSupport {

    findIntent(intent: string, context: Context, resultType: string | undefined): Promise<AppIntent>

    findIntentsByContext(context: Context): Promise<AppIntent[]>

    raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution>

    raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution>

    addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>

}