import { AbstractMessaging, RegisterableListener } from '@finos/fdc3-agent-proxy';
import { CLIENT_MESSAGE, SERVER_MESSAGE } from './MessageTypes';
import { AppIdentifier } from '@finos/fdc3-standard';
import { v4 as uuidv4 } from 'uuid';
import { AppRequestMessage } from '@finos/fdc3-schema/generated/api/BrowserTypes';

/**
 * WebSocket message envelope for distinguishing message types.
 */
interface WebSocketEnvelope {
  type: typeof CLIENT_MESSAGE | typeof SERVER_MESSAGE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

/**
 * Implementation of Messaging that uses native WebSocket to communicate
 * across a secure boundary (e.g., between an untrusted client and a trusted server).
 *
 * Messages are wrapped in an envelope with a `type` field to distinguish
 * between client-to-server and server-to-client messages.
 *
 * @example
 * ```typescript
 * const ws = new WebSocket('wss://trusted-server.example.com');
 * const messaging = new WebSocketMessaging(ws, { appId: 'my-app' });
 * ```
 */
export class WebSocketMessaging extends AbstractMessaging {
  private readonly listeners: Map<string, RegisterableListener> = new Map();
  private readonly ws: WebSocket;

  constructor(ws: WebSocket, appIdentifier: AppIdentifier) {
    super(appIdentifier);
    this.ws = ws;

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const envelope: WebSocketEnvelope = JSON.parse(event.data);

        // Only process client messages (messages from the other side)
        if (envelope.type === CLIENT_MESSAGE) {
          this.listeners.forEach(listener => {
            if (listener.filter(envelope.payload)) {
              listener.action(envelope.payload);
            }
          });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  register(l: RegisterableListener): void {
    if (l.id != null) {
      this.listeners.set(l.id, l);
    }
  }

  unregister(id: string): void {
    this.listeners.delete(id);
  }

  createMeta(): AppRequestMessage['meta'] {
    return {
      requestUuid: this.createUUID(),
      timestamp: new Date(),
    };
  }

  createUUID(): string {
    return uuidv4();
  }

  async disconnect(): Promise<void> {
    this.listeners.forEach(l => l.unsubscribe());
    this.listeners.clear();

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }

  async post(message: unknown): Promise<void> {
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }

    const envelope: WebSocketEnvelope = {
      type: SERVER_MESSAGE,
      payload: message,
    };

    this.ws.send(JSON.stringify(envelope));
  }
}
