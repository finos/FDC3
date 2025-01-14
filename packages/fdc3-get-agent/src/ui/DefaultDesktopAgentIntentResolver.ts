import { AppIntent } from '@finos/fdc3-standard';
import { IntentResolver, IntentResolutionChoice } from '@finos/fdc3-standard';
import { AbstractUIComponent } from './AbstractUIComponent';
import { Context } from '@finos/fdc3-context';
import { Logger } from '../util/Logger';
import { BrowserTypes } from '@finos/fdc3-schema';
const { isFdc3UserInterfaceResolveAction } = BrowserTypes;
type Fdc3UserInterfaceResolve = BrowserTypes.Fdc3UserInterfaceResolve;

/**
 * Handles communication between an injected Intent Resolver UI and the getAgent implementation.
 */
export class DefaultDesktopAgentIntentResolver extends AbstractUIComponent implements IntentResolver {
  private pendingResolve: ((x: IntentResolutionChoice | void) => void) | null = null;

  constructor(url: string | null) {
    //TODO: check default UI URL is correct on release
    super(url ?? 'https://fdc3.finos.org/webui/intent_resolver.html', 'FDC3 Intent Resolver');
  }

  async setupMessagePort(port: MessagePort): Promise<void> {
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

    //This starts the port so do it last
    await super.setupMessagePort(port);
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
    Logger.debug(`DefaultDesktopAgentIntentResolver: Requested resolution: `, message);
    return out;
  }
}
