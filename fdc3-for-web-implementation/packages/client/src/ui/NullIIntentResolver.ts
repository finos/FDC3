import { AppIntent } from "@finos/fdc3";
import { Context, IntentResolver } from "@kite9/fdc3-common";
import { IntentResolutionChoice } from "@kite9/fdc3-common/src/IntentResolver";


export class NullIntentResolver implements IntentResolver {

    async disconnect(): Promise<void> {
    }

    async connect(): Promise<void> {
    }

    async chooseIntent(_appIntents: AppIntent[], _ctx: Context): Promise<IntentResolutionChoice | void> {
    }
}