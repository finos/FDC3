import { IntentResolver, IntentResolutionChoice } from '@finos/fdc3-standard';

/** Implementation used when an injected IntentResolver is not in use. */
export class NullIntentResolver implements IntentResolver {
  async disconnect(): Promise<void> { }
  async connect(): Promise<void> { }
  async chooseIntent(): Promise<IntentResolutionChoice | void> { }
}
