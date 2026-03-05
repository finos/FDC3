import { AbstractMessaging, RegisterableListener } from '@finos/fdc3-agent-proxy';
import { CLIENT_MESSAGE, SERVER_MESSAGE, WsEnvelope } from './MessageTypes';
import { AppIdentifier } from '@finos/fdc3-standard';
import { v4 as uuidv4 } from 'uuid';
import { AppRequestMessage } from '@finos/fdc3-schema/generated/api/BrowserTypes';

/**
 * Implementation of Messaging that uses native WebSocket to communicate
 * across a secure boundary (e.g., between an untrusted client and a trusted server).
 *
 * Messages are wrapped in a {@link WsEnvelope} with an `event` field to distinguish
 * message types (replicating Socket.IO named events) and an optional `id` / `ack`
 * pair to support request/response semantics (replicating Socket.IO's emitWithAck).
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
        const envelope: WsEnvelope = JSON.parse(event.data);

        // Only process client-side messages (messages addressed to this side)
        if (envelope.event === CLIENT_MESSAGE) {
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

    const envelope: WsEnvelope = {
      event: SERVER_MESSAGE,
      payload: message,
    };

    this.ws.send(JSON.stringify(envelope));
  }
}
