import { AppIdentifier, AppIntent, Context } from "@finos/fdc3";


export type IntentResolutionChoice = {
    intent: string,
    appId: AppIdentifier
}

/**
 * Interface used by the desktop agent proxy to handle the intent resolution process.
 */
export interface IntentResolver {

    /**
     * Make sure the intent resolver is ready to be used.
     */
    init(): Promise<void>

    /**
     * Called when the user needs to resolve an intent.  Returns either the app chosen to
     * resolve the intent or void if the operation was cancelled.
     */
    chooseIntent(appIntents: AppIntent[], context: Context): Promise<IntentResolutionChoice | void>
}

