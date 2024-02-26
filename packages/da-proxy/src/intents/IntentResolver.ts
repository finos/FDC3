import { AppIdentifier, AppIntent, IntentMetadata } from "@finos/fdc3";

/**
 * Contains the details of a single intent and application resolved
 * by the IntentResolver implementation
 */
export interface SingleAppIntent {

    intent: IntentMetadata
    chosenApp: AppIdentifier

}

export interface IntentResolver {

    chooseIntent(appIntents: AppIntent[]) : SingleAppIntent

}

