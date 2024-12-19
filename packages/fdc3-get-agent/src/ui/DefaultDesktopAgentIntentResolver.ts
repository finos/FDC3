import { AppIntent } from '@kite9/fdc3-standard';
import { IntentResolver, IntentResolutionChoice } from '@kite9/fdc3-standard';
import { AbstractUIComponent } from './AbstractUIComponent';
import { Context } from '@kite9/fdc3-context';
import {
  Fdc3UserInterfaceResolve,
  isFdc3UserInterfaceResolveAction,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { Logger } from '../util/Logger';

/**
 * Works with the desktop agent to provide a resolution to the intent choices.
 * This is the default implementation, but can be overridden by app implementers calling
 * the getAgent() method
 */
export class DefaultDesktopAgentIntentResolver extends AbstractUIComponent implements IntentResolver {
  private pendingResolve: ((x: IntentResolutionChoice | void) => void) | null = null;

  constructor(url: string | null) {
    //TODO: check default UI URL is correct on release
    super(url ?? 'https://fdc3.finos.org/webui/intent_resolver.html', 'FDC3 Intent Resolver');
  }

  async setupMessagePort(port: MessagePort): Promise<void> {
    await super.setupMessagePort(port);
    this.port = port;

    this.port.addEventListener('message', e => {
      if (isFdc3UserInterfaceResolveAction(e.data)) {
        Logger.debug('DefaultDesktopAgentIntentResolver: Received resolveAction message: ', e.data);

        const choice = e.data;
        if (choice.payload.action == 'click' && this.pendingResolve) {
          this.pendingResolve({
            appId: choice.payload.appIdentifier!,
            intent: choice.payload.intent!,
          });
        } else if (choice.payload.action == 'cancel' && this.pendingResolve) {
          this.pendingResolve();
        }

        this.pendingResolve = null;
      }
    });
  }

  async chooseIntent(appIntents: AppIntent[], context: Context): Promise<IntentResolutionChoice | void> {
    const out = new Promise<IntentResolutionChoice | void>(resolve => {
      this.pendingResolve = resolve;
    });
    const message: Fdc3UserInterfaceResolve = {
      type: 'Fdc3UserInterfaceResolve',
      payload: {
        appIntents,
        context,
      },
    };
    this.port?.postMessage(message);
    return out;
  }
}
