import { FDC3Server, InstanceID } from '@kite9/fdc3-web-impl';
import { TestServerContext } from './TestServerContext';
import { MockWindow } from './MockWindow';
import { AutomaticResponse } from './responses/AutomaticResponses';
import { FindIntent } from './responses/FindIntent';
import { RaiseIntent } from './responses/RaiseIntent';
import { Handshake } from './responses/Handshake';
import { UserChannels } from './responses/UserChannels';
import { CurrentChannel } from './responses/CurrentChannel';
import { GetInfo } from './responses/GetInfo';
import {
  AppRequestMessage,
  WebConnectionProtocol2LoadURL,
  WebConnectionProtocol3Handshake,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

export const EMBED_URL = 'http://localhost:8080/static/da/embed.html';
export const CHANNEL_SELECTOR_URL = 'https://mock.fdc3.com/channelSelector';
export const INTENT_RESOLVER_URL = 'https://mock.fdc3.com/resolver';

export class MockFDC3Server implements FDC3Server {
  private useIframe: boolean;
  private useDefaultUIUrls: boolean;
  private timeOutIdValidation: boolean;
  private window: MockWindow;
  private tsc: TestServerContext;
  private receivedGoodbye = false;

  readonly automaticResponses: AutomaticResponse[];

  constructor(
    window: MockWindow,
    useIframe: boolean,
    ctx: TestServerContext,
    useDefaultUIUrls: boolean = false,
    timeOutIdValidation: boolean = false
  ) {
    this.useIframe = useIframe;
    this.useDefaultUIUrls = useDefaultUIUrls;
    this.timeOutIdValidation = timeOutIdValidation;
    this.window = window;
    this.tsc = ctx;

    this.automaticResponses = [
      new FindIntent(),
      new RaiseIntent(),
      new Handshake(this.timeOutIdValidation),
      new UserChannels(),
      new CurrentChannel(),
      new GetInfo(),
    ];
    this.init();
  }

  cleanup(instanceId: InstanceID): void {
    this.tsc.goodbye(instanceId);
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

  hasReceivedGoodbye(): boolean {
    return this.receivedGoodbye;
  }

  init() {
    this.window.addEventListener('message', e => {
      const event = e as MessageEvent;
      const data = event.data;
      const source = event.source as Window;
      const origin = event.origin;

      if (this.tsc.cw.debugLogs) {
        console.log('MockFDC3Server received: ', event.data);
      }
      if (data.type == 'WCP1Hello') {
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
        } else {
          const details = this.tsc.getMatchingInstance(data.payload.identityUrl);
          if (details) {
            const message: WebConnectionProtocol3Handshake = {
              type: 'WCP3Handshake',
              meta: {
                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                timestamp: new Date(),
              },
              payload: {
                fdc3Version: '2.2',
                intentResolverUrl: this.useDefaultUIUrls ? true : INTENT_RESOLVER_URL,
                channelSelectorUrl: this.useDefaultUIUrls ? true : CHANNEL_SELECTOR_URL,
              },
            };
            source.postMessage(message, origin, [details.externalPort]);
          } //getMatchingInstance will log if it didn't find anything
        }
      } else if (data.type == 'WCP6Goodbye') {
        this.receivedGoodbye = true;
      }
    });
  }
}
