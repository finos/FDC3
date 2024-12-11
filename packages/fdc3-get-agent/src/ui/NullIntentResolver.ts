import { IntentResolver, IntentResolutionChoice } from '@kite9/fdc3-standard';

export class NullIntentResolver implements IntentResolver {
  async disconnect(): Promise<void> {}
  async connect(): Promise<void> {}
  async chooseIntent(): Promise<IntentResolutionChoice | void> {}
}
