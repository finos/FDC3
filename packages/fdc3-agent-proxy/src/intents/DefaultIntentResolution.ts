import { AppIdentifier, IntentResolution, IntentResult } from '@finos/fdc3-standard';
import { Messaging } from '../Messaging.js';

export class DefaultIntentResolution implements IntentResolution {
  readonly messaging: Messaging;
  readonly source: AppIdentifier;
  readonly intent: string;
  readonly result: Promise<IntentResult>;

  constructor(messaging: Messaging, result: Promise<IntentResult>, source: AppIdentifier, intent: string) {
    this.messaging = messaging;
    this.result = result;
    this.source = source;
    this.intent = intent;

    //bind all functions to allow destructuring
    this.getResult = this.getResult.bind(this);
  }

  getResult(): Promise<IntentResult> {
    return this.result;
  }
}
