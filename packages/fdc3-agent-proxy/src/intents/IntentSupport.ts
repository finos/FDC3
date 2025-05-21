import {
  AppIdentifier,
  AppIntent,
  AppProvidableContextMetadata,
  IntentHandler,
  IntentResolution,
  Listener,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

export interface IntentSupport {
  findIntent(intent: string, context: Context, resultType: string | undefined): Promise<AppIntent>;
  findIntentsByContext(context: Context): Promise<AppIntent[]>;
  raiseIntent(
    intent: string,
    context: Context,
    app?: AppIdentifier,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution>;
  raiseIntentForContext(
    context: Context,
    app?: AppIdentifier,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution>;
  addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>;
}
