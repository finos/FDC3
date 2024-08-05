import { AppIntent, IntentResult } from "@finos/fdc3";
import { IntentResolver, SingleAppIntent } from "@kite9/fdc3-common";
import { PropsWorld } from "../world";

/**
 * This super-simple intent resolver just resolves to the first
 * intent / app in the list.
 */
export class SimpleIntentResolver implements IntentResolver {

    cw: PropsWorld

    constructor(cw: PropsWorld) {
        this.cw = cw;
    }

    async intentChosen(ir: IntentResult): Promise<IntentResult> {
        this.cw.props['intent-result'] = ir
        return ir
    }

    async chooseIntent(appIntents: AppIntent[]): Promise<SingleAppIntent> {
        const out = {
            intent: appIntents[0].intent,
            chosenApp: appIntents[0].apps[0]
        }

        this.cw.props['intent-resolution'] = out
        return out
    }
}

export const CHANNEL_STATE = 'CHANNEL_STATE'


