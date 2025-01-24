import { FDC3Server, InstanceID, State } from '@finos/fdc3-web-impl';
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
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { Broadcast } from './responses/Broadcast';

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
  private messageExchangeTimeout: number | null = null;
  private appLaunchTimeout: number | null = null;

  readonly automaticResponses: AutomaticResponse[];

  constructor(
    window: MockWindow,
    useIframe: boolean,
    ctx: TestServerContext,
    useDefaultUIUrls: boolean = false,
    timeOutIdValidation: boolean = false,
    timeoutMessageExchanges: boolean = false,
    messageExchangeTimeout?: number,
    appLaunchTimeout?: number
  ) {
    this.useIframe = useIframe;
    this.useDefaultUIUrls = useDefaultUIUrls;
    this.timeOutIdValidation = timeOutIdValidation;
    this.window = window;
    this.tsc = ctx;
    if (messageExchangeTimeout) {
      this.messageExchangeTimeout = messageExchangeTimeout;
    }
    if (appLaunchTimeout) {
      this.appLaunchTimeout = appLaunchTimeout;
    }

    if (timeoutMessageExchanges) {
      this.automaticResponses = [
        new GetInfo(),
        new Handshake(this.timeOutIdValidation),
        new CurrentChannel(),
        new UserChannels(),
        new Broadcast(),
      ];
    } else {
      this.automaticResponses = [
        new GetInfo(),
        new Handshake(this.timeOutIdValidation),
        new CurrentChannel(),
        new FindIntent(),
        new RaiseIntent(),
        new UserChannels(),
        new Broadcast(),
      ];
    }

    this.init();
  }

  cleanup(instanceId: InstanceID): void {
    //message handler are faked with automated responses, so no need to clean up their state
    this.tsc.setAppState(instanceId, State.Terminated);
  }

  async receive(message: AppRequestMessage, from: string): Promise<void> {
    //If timeoutMessageExchanges was set then we will not respond to some messages here
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
            if (this.messageExchangeTimeout) {
              message.payload.defaultTimeout = this.messageExchangeTimeout;
            }
            if (this.appLaunchTimeout) {
              message.payload.appLaunchTimeout = this.appLaunchTimeout;
            }
            source.postMessage(message, origin, [details.externalPort]);
          } //getMatchingInstance will log if it didn't find anything
        }
      } else if (data.type == 'WCP6Goodbye') {
        this.receivedGoodbye = true;
      }
    });
  }
}
