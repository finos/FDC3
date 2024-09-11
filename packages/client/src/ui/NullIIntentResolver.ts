import { AppIntent, Context } from "@kite9/fdc3-core";
import { IntentResolver, IntentResolutionChoice } from "@kite9/fdc3-core";


export class NullIntentResolver implements IntentResolver {

    async disconnect(): Promise<void> {
    }

    async connect(): Promise<void> {
    }

    async chooseIntent(_appIntents: AppIntent[], _ctx: Context): Promise<IntentResolutionChoice | void> {
    }
}