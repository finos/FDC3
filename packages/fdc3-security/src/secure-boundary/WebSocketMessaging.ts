import { CLIENT_MESSAGE, SERVER_MESSAGE, WsEnvelope } from './MessageTypes';
import { AppIdentifier } from '@finos/fdc3-standard';
import { v4 as uuidv4 } from 'uuid';
import {
  AppRequestMessage,
  AgentEventMessage,
  AgentResponseMessage,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { Messaging, RegisterableListener } from './Messaging';

/**
 * Implementation of Messaging that uses native WebSocket to communicate
 * across a secure boundary.
 */
export class WebSocketMessaging implements Messaging {
  private readonly listeners: Map<string, RegisterableListener> = new Map();
  private readonly ws: WebSocket;
  readonly appIdentifier: AppIdentifier;
  readonly outgoingEvent: typeof CLIENT_MESSAGE | typeof SERVER_MESSAGE;
  readonly incomingEvent: typeof CLIENT_MESSAGE | typeof SERVER_MESSAGE;

  constructor(
    ws: WebSocket,
    appIdentifier: AppIdentifier,
    options: {
      outgoingEvent?: typeof CLIENT_MESSAGE | typeof SERVER_MESSAGE;
      incomingEvent?: typeof CLIENT_MESSAGE | typeof SERVER_MESSAGE;
    } = {}
  ) {
    this.ws = ws;
    this.appIdentifier = appIdentifier;
    this.outgoingEvent = options.outgoingEvent || (SERVER_MESSAGE as any);
    this.incomingEvent = options.incomingEvent || (CLIENT_MESSAGE as any);

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const envelope: WsEnvelope = JSON.parse(event.data);
        const { event: evtName, payload, id } = envelope;

        this.listeners.forEach(listener => {
          if (listener.filter(payload, evtName)) {
            listener.action(payload, evtName, id);
          }
        });
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
    this.listeners.forEach(l => l.unsubscribe?.());
    this.listeners.clear();

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }

  async post(message: AppRequestMessage | AgentEventMessage | AgentResponseMessage): Promise<void> {
    return this.postEvent(this.outgoingEvent, message);
  }

  async postEvent(event: WsEnvelope['event'], payload: any, id?: string): Promise<void> {
    if (this.ws.readyState !== 1 /* WebSocket.OPEN */) {
      throw new Error('WebSocket is not open');
    }

    const envelope = { event, payload, id } as WsEnvelope;
    this.ws.send(JSON.stringify(envelope));
  }

  async exchange<X>(
    message: any,
    expectedTypeOrEvent: string,
    timeoutMs: number,
    eventName?: WsEnvelope['event']
  ): Promise<X> {
    const correlationId = this.createUUID();
    return new Promise<X>((resolve, reject) => {
      let done = false;
      const timeout = setTimeout(() => {
        this.unregister(correlationId);
        if (!done) {
          reject(new Error(`Timed out waiting for ${expectedTypeOrEvent}`));
        }
      }, timeoutMs);

      const l: RegisterableListener = {
        id: correlationId,
        filter: (m: any, evt: WsEnvelope['event']) => {
          // If it's an ack for this request, it's definitely for us
          if (evt === `ack:${correlationId}`) return true;
          // If it's a standard FDC3 message, check type and request ID
          if (evt === this.incomingEvent) {
            return m?.type === expectedTypeOrEvent && m?.meta?.requestUuid === message.meta?.requestUuid;
          }
          // Otherwise, it might be a direct event response if we used a custom event
          return evt === expectedTypeOrEvent;
        },
        action: (m: any) => {
          done = true;
          this.unregister(correlationId);
          clearTimeout(timeout);
          if (m?.payload?.error) {
            reject(new Error(m.payload.error));
          } else {
            resolve(m as X);
          }
        },
      };

      this.register(l);
      this.postEvent(eventName || this.outgoingEvent, message, correlationId).catch(err => {
        clearTimeout(timeout);
        this.unregister(correlationId);
        reject(err);
      });
    });
  }
}
