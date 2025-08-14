import { AbstractMessaging, RegisterableListener } from '@finos/fdc3-agent-proxy';
import { Socket } from 'socket.io';
import { SERVER_MESSAGE } from './MessageTypes';
import { AppIdentifier } from '@finos/fdc3-standard';
import { v4 as uuidv4 } from 'uuid';
import { AgentResponseMessage, AppRequestMessage } from '@finos/fdc3-schema/generated/api/BrowserTypes';

/**
 * Bare-bones implementation of Messaging that uses a WebSocket to send messages to the server.
 */
export class WebSocketMessaging extends AbstractMessaging {
  private readonly listeners: Map<string, RegisterableListener> = new Map();

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

  async disconnect(): Promise<void> {
    this.listeners.forEach(l => l.unsubscribe());
  }

  private readonly socket: Socket;

  constructor(socket: Socket, appIdentifier: AppIdentifier) {
    super(appIdentifier);
    this.socket = socket;
  }

  createUUID(): string {
    return uuidv4();
  }

  async post(message: any): Promise<void> {
    console.log('posting message', message);
    const response = await this.socket.emitWithAck(SERVER_MESSAGE, message);
    this.listeners.forEach(v => {
      if (v.filter(response)) {
        v.action(response);
      }
    });
  }

  async waitFor<X extends AgentResponseMessage>(
    _filter: (m: X) => boolean,
    _timeoutMs?: number,
    _timeoutErrorMessage?: string
  ): Promise<X> {
    // do nothing
    return Promise.resolve({} as X);
  }
}
