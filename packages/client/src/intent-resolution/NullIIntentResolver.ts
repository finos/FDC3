import { AppIntent, AppIdentifier, IntentResult } from "@finos/fdc3";
import { IntentResolver, SingleAppIntent } from "@kite9/fdc3-common";


export class NullIntentResolver implements IntentResolver {

    chooseIntent(_appIntents: AppIntent[], _source: AppIdentifier): Promise<SingleAppIntent> {
        throw new Error("Method not implemented.");
    }

    intentChosen(_intentResult: IntentResult): Promise<IntentResult> {
        throw new Error("Method not implemented.");
    }

}