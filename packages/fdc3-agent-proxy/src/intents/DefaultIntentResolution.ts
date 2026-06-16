import { AppIdentifier, ContextMetadata, IntentResolution, IntentResult } from '@finos/fdc3-standard';

export class DefaultIntentResolution implements IntentResolution {
  readonly source: AppIdentifier;
  readonly intent: string;
  readonly result: Promise<IntentResult>;
  readonly resultMetadata: Promise<ContextMetadata>;

  constructor(
    result: Promise<IntentResult>,
    resultMetadata: Promise<ContextMetadata>,
    source: AppIdentifier,
    intent: string
  ) {
    this.result = result;
    this.resultMetadata = resultMetadata;
    this.source = source;
    this.intent = intent;

    //bind all functions to allow destructuring
    this.getResult = this.getResult.bind(this);
    this.getResultMetadata = this.getResultMetadata.bind(this);
  }

  getResult(): Promise<IntentResult> {
    return this.result;
  }

  getResultMetadata(): Promise<ContextMetadata> {
    return this.resultMetadata;
  }
}
