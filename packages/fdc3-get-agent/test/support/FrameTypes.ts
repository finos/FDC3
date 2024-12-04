import { CustomWorld } from '../world';
import { MockWindow } from './MockWindow';
import { CHANNEL_SELECTOR_URL, EMBED_URL, INTENT_RESOLVER_URL } from './MockFDC3Server';
import { BrowserTypes } from '@kite9/fdc3-schema';
import {
  FDC3_USER_INTERFACE_HANDSHAKE_TYPE,
  FDC3_USER_INTERFACE_HELLO_TYPE,
  FDC3_USER_INTERFACE_RESTYLE_TYPE,
} from '@kite9/fdc3-schema/dist/generated/api/BrowserTypes';

type Fdc3UserInterfaceHello = BrowserTypes.Fdc3UserInterfaceHello;
type WebConnectionProtocol3Handshake = BrowserTypes.WebConnectionProtocol3Handshake;

/**
 * This handles the frame communications when we're using the embedded iframe approach
 */
export function handleEmbeddedIframeComms(value: string, parent: MockWindow, cw: CustomWorld) {
  const paramStr = value.substring(EMBED_URL.length + 1);
  const params = new URLSearchParams(paramStr);
  const connectionAttemptUuid = params.get('connectionAttemptUuid')!!;
  const connection = cw.mockContext.getFirstInstance();
  try {
    parent.postMessage(
      {
        type: 'WCP3Handshake',
        meta: {
          connectionAttemptUuid: connectionAttemptUuid,
          timestamp: new Date(),
        },
        payload: {
          fdc3Version: '2.2',
          intentResolverUrl: INTENT_RESOLVER_URL,
          channelSelectorUrl: CHANNEL_SELECTOR_URL,
        },
      } as WebConnectionProtocol3Handshake,
      EMBED_URL,
      [connection!!.externalPort]
    );
  } catch (e) {
    console.error(e);
  }
}

export function handleChannelSelectorComms(
  _value: string,
  parent: MockWindow,
  source: Window,
  cw: CustomWorld
): MessageChannel {
  const connection = new MessageChannel();
  try {
    parent.dispatchEvent({
      type: 'message',
      data: {
        type: FDC3_USER_INTERFACE_HELLO_TYPE,
        payload: {
          initialCSS: {
            width: '100px',
          },
        },
      } as Fdc3UserInterfaceHello,
      origin: CHANNEL_SELECTOR_URL,
      source,
      ports: [connection.port1],
    } as any as Event);

    connection.port2.onmessage = e => {
      if (e.data.type == FDC3_USER_INTERFACE_HANDSHAKE_TYPE) {
        setTimeout(() => {
          connection.port2.postMessage({
            type: FDC3_USER_INTERFACE_RESTYLE_TYPE,
            payload: {
              css: {
                width: '100px',
              },
            },
          });
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
  source: Window,
  cw: CustomWorld
): MessageChannel {
  const connection = new MessageChannel();
  try {
    parent.dispatchEvent({
      type: 'message',
      data: {
        type: FDC3_USER_INTERFACE_HELLO_TYPE,
        payload: {
          initialCSS: {
            width: '100px',
          },
        },
      } as Fdc3UserInterfaceHello,
      origin: INTENT_RESOLVER_URL,
      source,
      ports: [connection.port1],
    } as any as Event);

    connection.port2.onmessage = e => {
      if (e.type == FDC3_USER_INTERFACE_HANDSHAKE_TYPE) {
        setTimeout(() => {
          connection.port2.postMessage({
            type: FDC3_USER_INTERFACE_RESTYLE_TYPE,
            payload: {
              css: {
                width: '100px',
              },
            },
          });
        }, 100);
      }

      cw.props['lastIntentResolverMessage'] = e;
    };
  } catch (e) {
    console.error(e);
  }

  return connection;
}
