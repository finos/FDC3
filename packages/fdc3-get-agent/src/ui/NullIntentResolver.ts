import { AppIntent } from '@kite9/fdc3-standard';
import { IntentResolver, IntentResolutionChoice } from '@kite9/fdc3-standard';
import { Context } from '@kite9/fdc3-context';

export class NullIntentResolver implements IntentResolver {
  async disconnect(): Promise<void> {}

  async connect(): Promise<void> {}

  async chooseIntent(_appIntents: AppIntent[], _ctx: Context): Promise<IntentResolutionChoice | void> {}
}
