import { AppIntent, Context, IntentResult } from "@finos/fdc3";
import { IntentResolver, IntentResolutionChoice } from "@kite9/fdc3-common";
import { PropsWorld } from "../world";

/**
 * This super-simple intent resolver just resolves to the first
 * intent / app in the list, unless the context is fdc3.cancel-me  and then it just cancels.
 */
export class SimpleIntentResolver implements IntentResolver {

    cw: PropsWorld

    constructor(cw: PropsWorld) {
        this.cw = cw;
    }

    async connect(): Promise<void> {
    }

    async disconnect(): Promise<void> {
    }

    async intentChosen(ir: IntentResult): Promise<IntentResult> {
        this.cw.props['intent-result'] = ir
        return ir
    }

    async chooseIntent(appIntents: AppIntent[], ctx: Context): Promise<IntentResolutionChoice | void> {
        if (ctx.type == 'fdc3.cancel-me') {
            return;
        }

        const out = {
            intent: appIntents[0].intent,
            chosenApp: appIntents[0].apps[0]
        }

        this.cw.props['intent-resolution'] = out
        return {
            appId: appIntents[0].apps[0],
            intent: appIntents[0].intent.name
        }
    }
}

export const CHANNEL_STATE = 'CHANNEL_STATE'


