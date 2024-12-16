import { CustomWorld } from '../world';
import { MockWindow } from './MockWindow';
import { CHANNEL_SELECTOR_URL, INTENT_RESOLVER_URL } from './MockFDC3Server';
import { isWebConnectionProtocol1Hello } from '@kite9/fdc3-schema/dist/generated/api/BrowserTypes';
import {
  Fdc3UserInterfaceHello,
  Fdc3UserInterfaceRestyle,
  isFdc3UserInterfaceHandshake,
  WebConnectionProtocol3Handshake,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

/**
 * This handles the frame communications when we're using the embedded iframe approach
 */
export function handleEmbeddedIframeComms(_value: string, parent: MockWindow, source: MockWindow, cw: CustomWorld) {
  const helloHandler = (e: Event) => {
    const event = e as MessageEvent;
    const eventSource = event.source as unknown as MockWindow;
    const data = event.data;

    if (isWebConnectionProtocol1Hello(data)) {
      console.debug(
        'Received hello message from: ',
        eventSource.name,
        eventSource == parent ? '(parent window): ' : '(NOT parent win): ',
        event.data
      );
      const connection = cw.mockContext.getFirstInstance();

      // send the other end of the channel to the app
      const message: WebConnectionProtocol3Handshake = {
        type: 'WCP3Handshake',
        meta: {
          connectionAttemptUuid: data.meta.connectionAttemptUuid,
          timestamp: new Date(),
        },
        payload: {
          fdc3Version: '2.2',
          channelSelectorUrl: CHANNEL_SELECTOR_URL,
          intentResolverUrl: INTENT_RESOLVER_URL,
        },
      };
      eventSource.postMessage(message, '*', [connection!.externalPort]);

      window.removeEventListener('message', helloHandler);
    } else {
      console.warn(`Unexpected message received by MockIframe - ignored`, e);
    }
  };

  //listen for hello message events from parent to respond to
  source.addEventListener('message', helloHandler);
}

export function handleChannelSelectorComms(
  _value: string,
  parent: MockWindow,
  source: MockWindow,
  cw: CustomWorld
): MessageChannel {
  const connection = new MessageChannel();
  try {
    const msg: Fdc3UserInterfaceHello = {
      type: 'Fdc3UserInterfaceHello',
      payload: {
        implementationDetails: 'mock channel selector',
        initialCSS: {
          width: '100px',
        },
      },
    };

    const event: Event = {
      type: 'message',
      data: msg,
      origin: CHANNEL_SELECTOR_URL,
      source: source,
      ports: [connection.port1],
    } as unknown as Event;
    parent.dispatchEvent(event);

    connection.port2.onmessage = e => {
      if (isFdc3UserInterfaceHandshake(e)) {
        setTimeout(() => {
          const msg: Fdc3UserInterfaceRestyle = {
            type: 'Fdc3UserInterfaceRestyle',
            payload: {
              updatedCSS: {
                width: '100px',
              },
            },
          };
          connection.port2.postMessage(msg);
        }, 100);
      }
      cw.props['lastChannelSelectorMessage'] = e.data;
    };
  } catch (e) {
    console.error(e);
  }

  return connection;
}

export function handleIntentResolverComms(
  _value: string,
  parent: MockWindow,
  source: MockWindow,
  cw: CustomWorld
): MessageChannel {
  const connection = new MessageChannel();
  try {
    const msg: Fdc3UserInterfaceHello = {
      type: 'Fdc3UserInterfaceHello',
      payload: {
        implementationDetails: 'mock intent resolver',
        initialCSS: {
          width: '100px',
        },
      },
    };
    const event: Event = {
      type: 'message',
      data: msg,
      origin: INTENT_RESOLVER_URL,
      source,
      ports: [connection.port1],
    } as unknown as Event;
    parent.dispatchEvent(event);

    connection.port2.onmessage = e => {
      if (isFdc3UserInterfaceHandshake(e)) {
        setTimeout(() => {
          const msg: Fdc3UserInterfaceRestyle = {
            type: 'Fdc3UserInterfaceRestyle',
            payload: {
              updatedCSS: {
                width: '100px',
              },
            },
          };
          connection.port2.postMessage(msg);
        }, 100);
      }

      cw.props['lastIntentResolverMessage'] = e;
    };
  } catch (e) {
    console.error(e);
  }

  return connection;
}
