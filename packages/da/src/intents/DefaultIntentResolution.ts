import { AppIdentifier, IntentResolution, IntentResult } from "@finos/fdc3";
import { RaiseIntentResultAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { DefaultChannel } from "../channels/DefaultChannel";
import { Messaging } from "../Messaging";
import { DefaultPrivateChannel } from "../channels/DefaultPrivateChannel";

export class DefaultIntentResolution implements IntentResolution {

    readonly messaging: Messaging
    readonly source: AppIdentifier;
    readonly intent: string;
    readonly version?: string | undefined;
    readonly result: Promise<IntentResult>

    constructor(messaging: Messaging, result: Promise<RaiseIntentResultAgentResponse>, source: AppIdentifier, intent: string, version?: string) {
        this.messaging = messaging
        this.result = result.then(m => this.convertOutput(m))
        this.source = source
        this.intent = intent
        this.version = version
    }

    getResult(): Promise<IntentResult> {
        return this.result
    }

    private convertOutput(m: RaiseIntentResultAgentResponse): Promise<IntentResult> {
        if (m.payload.intentResult.channel) {
            const c = m.payload.intentResult.channel!!;
            switch (c.type) {
                case 'app':
                case 'user':
                    return new Promise((resolve) => resolve(new DefaultChannel(this.messaging, c.id, c.type, c.displayMetadata)))
                case 'private':
                    return new Promise((resolve) => resolve(new DefaultPrivateChannel(this.messaging, c.id)))
            }
        } else if (m.payload.intentResult.context) {
            return new Promise((resolve) => {
                resolve(m.payload.intentResult.context)
            })
        } else {
            return new Promise((resolve) => (resolve()))
        }
    }
}