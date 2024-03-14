import { AppIntent } from "@finos/fdc3";
import { IntentResolver, Messaging } from "da-proxy";
import { SingleAppIntent } from "da-proxy/src/intents/IntentResolver";

/**
 * Works with the desktop agent to provide a resolution to the intent choices.
 */
export class DesktopAgentIntentResolver implements IntentResolver {

    private readonly m: Messaging

    constructor(m: Messaging) {
        this.m = m
    }

    async chooseIntent(_appIntents: AppIntent[]): Promise<SingleAppIntent> {
        throw new Error("Method not implemented.");
    }

}