import { Context, AppIntent, AppIdentifier, IntentResolution, IntentHandler, Listener } from "@finos/fdc3";
import { IntentSupport } from "./IntentSupport";
export declare class DefaultIntentSupport implements IntentSupport {
    findIntent(_intent: string, _context: Context, _resultType: string | undefined): Promise<AppIntent>;
    findIntentsByContext(_context: Context): Promise<AppIntent[]>;
    raiseIntent(_intent: string, _context: Context, _app?: AppIdentifier | undefined): Promise<IntentResolution>;
    raiseIntentForContext(_context: Context, _app?: AppIdentifier | undefined): Promise<IntentResolution>;
    addIntentListener(_intent: string, _handler: IntentHandler): Promise<Listener>;
}
