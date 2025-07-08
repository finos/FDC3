import { AppIdentifier, Intent, IntentResolution, IntentResult } from '@finos/fdc3';
import { AbstractDesktopAgentDelegate } from './AbstractDesktopAgentDelegate';

export class IntentResolutionDelegate implements IntentResolution {
  private readonly s: AbstractDesktopAgentDelegate;
  private readonly delegate: IntentResolution;

  source: AppIdentifier;
  intent: Intent;

  constructor(s: AbstractDesktopAgentDelegate, d: IntentResolution) {
    this.source = d.source;
    this.intent = d.intent;
    this.s = s;
    this.delegate = d;
  }

  getResult(): Promise<IntentResult> {
    return this.delegate.getResult().then(r => this.s.wrapIntentResult(r));
  }
}
