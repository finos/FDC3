import { Context, AppIntent, AppIdentifier, IntentResolution, IntentHandler, Listener } from "@finos/fdc3";
import { IntentSupport } from "./IntentSupport.js";

export class DefaultIntentSupport implements IntentSupport {
    
    findIntent(_intent: string, _context: Context, _resultType: string | undefined): Promise<AppIntent> {
        throw new Error("Method not implemented.");
    }
    findIntentsByContext(_context: Context): Promise<AppIntent[]> {
        throw new Error("Method not implemented.");
    }
    raiseIntent(_intent: string, _context: Context, _app?: AppIdentifier | undefined): Promise<IntentResolution> {
        throw new Error("Method not implemented.");
    }
    raiseIntentForContext(_context: Context, _app?: AppIdentifier | undefined): Promise<IntentResolution> {
        throw new Error("Method not implemented.");
    }
    addIntentListener(_intent: string, _handler: IntentHandler): Promise<Listener> {
        throw new Error("Method not implemented.");
    }
    
}