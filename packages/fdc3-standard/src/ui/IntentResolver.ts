import { Context } from '@finos/fdc3-context';
import { AppIdentifier } from '../api/AppIdentifier.js';
import { AppIntent } from '../api/AppIntent.js';
import { Connectable } from './Connectable.js';

export type IntentResolutionChoice = {
  intent: string;
  appId: AppIdentifier;
};

/**
 * Interface used by the desktop agent proxy to handle the intent resolution process.
 */
export interface IntentResolver extends Connectable {
  /**
   * Called when the user needs to resolve an intent.  Returns either the app chosen to
   * resolve the intent or void if the operation was cancelled.
   */
  chooseIntent(appIntents: AppIntent[], context: Context): Promise<IntentResolutionChoice | void>;
}
