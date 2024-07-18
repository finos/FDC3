import { AppIdentifier, IntentResolution, IntentResult } from "@finos/fdc3";
import { Messaging } from "../Messaging";

export class DefaultIntentResolution implements IntentResolution {

    readonly messaging: Messaging
    readonly source: AppIdentifier;
    readonly intent: string;
    readonly version?: string | undefined;
    readonly result: Promise<IntentResult>

    constructor(messaging: Messaging, result: Promise<IntentResult>, source: AppIdentifier, intent: string, version?: string) {
        this.messaging = messaging
        this.result = result
        this.source = source
        this.intent = intent
        this.version = version
    }

    getResult(): Promise<IntentResult> {
        return this.result
    }
}