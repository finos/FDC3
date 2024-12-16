import { FDC3Server } from '@kite9/fdc3-web-impl';
import { TestServerContext } from './TestServerContext';
import { MockWindow } from './MockWindow';
import { AutomaticResponse } from './responses/AutomaticResponses';
import { FindIntent } from './responses/FindIntent';
import { RaiseIntent } from './responses/RaiseIntent';
import { Handshake } from './responses/Handshake';
import { UserChannels } from './responses/UserChannels';
import { CurrentChannel } from './responses/CurrentChannel';
import { BrowserTypes } from '@kite9/fdc3-schema';

type AppRequestMessage = BrowserTypes.AppRequestMessage;
type WebConnectionProtocol2LoadURL = BrowserTypes.WebConnectionProtocol2LoadURL;

export const dummyInstanceId = { appId: 'Test App Id', instanceId: '1' };

export const EMBED_URL = 'http://localhost:8080/static/da/embed.html';

export const CHANNEL_SELECTOR_URL = 'https://mock.fdc3.com/channelSelector';

export const INTENT_RESOLVER_URL = 'https://mock.fdc3.com/resolver';

export class MockFDC3Server implements FDC3Server {
  private useIframe: boolean;
  private window: MockWindow;
  private tsc: TestServerContext;

  readonly automaticResponses: AutomaticResponse[] = [
    new FindIntent(),
    new RaiseIntent(),
    new Handshake(),
    new UserChannels(),
    new CurrentChannel(),
  ];

  constructor(window: MockWindow, useIframe: boolean, ctx: TestServerContext) {
    this.useIframe = useIframe;
    this.window = window;
    this.tsc = ctx;
    this.init();
  }

  receive(message: AppRequestMessage, from: string): void {
    this.automaticResponses.forEach(r => {
      if (r.filter(message.type)) {
        r.action(message, this.tsc, from);
      }
    });
  }

  shutdown() {
    this.tsc.shutdown();
  }

  init() {
    this.window.addEventListener('message', e => {
      const event = e as MessageEvent;
      const data = event.data;
      const source = event.source as Window;
      const origin = event.origin;

      if (data.type !== 'WCP1Hello') {
        return;
      }

      // Using an iframe
      if (this.useIframe) {
        const message: WebConnectionProtocol2LoadURL = {
          type: 'WCP2LoadUrl',
          meta: {
            connectionAttemptUuid: data.meta.connectionAttemptUuid,
            timestamp: new Date(),
          },
          payload: {
            iframeUrl: EMBED_URL + '?connectionAttemptUuid=' + data.meta.connectionAttemptUuid,
          },
        };
        source.postMessage(message, origin);
        return;
      }

      // Not using an iframe
      const details = this.tsc.getMatchingInstance(data.payload.identityUrl);

      if (!details) {
        throw new Error('Unable to find the matching instance. Handshake can not complete without other hand.');
      }

      const message = {
        type: 'WCP3Handshake',
        meta: {
          connectionAttemptUuid: data.meta.connectionAttemptUuid,
          timestamp: new Date(),
        },
        payload: {
          fdc3Version: '2.2',
          intentResolverUrl: INTENT_RESOLVER_URL,
          channelSelectorUrl: CHANNEL_SELECTOR_URL,
        },
      };
      source.postMessage(message, origin, [details.externalPort]);
    });
  }
}
