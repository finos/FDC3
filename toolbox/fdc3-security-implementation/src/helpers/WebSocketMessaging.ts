import { AppIdentifier } from '@finos/fdc3';
import { AbstractMessaging, RegisterableListener } from '@finos/fdc3-agent-proxy';
import {
  AgentEventMessage,
  AgentResponseMessage,
  AppRequestMessage,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SERVER_MESSAGE, WEB_MESSAGE } from './MessageTypes';

/**
 * A version of the Messaging interface that uses WebSockets
 * to communicate with the client-side DesktopAgent.
 */
export class WebSocketMessaging extends AbstractMessaging {
  private readonly listeners: Map<string, RegisterableListener> = new Map();
  private socket: Socket;

  constructor(socket: Socket, appIdentifier: AppIdentifier) {
    super(appIdentifier);
    this.socket = socket;
    this.socket.on(WEB_MESSAGE, (message: AgentEventMessage | AgentResponseMessage) => {
      this.listeners.forEach(v => {
        if (v.filter(message)) {
          v.action(message);
        }
      });
    });
  }

  async post(message: AppRequestMessage | WebConnectionProtocol6Goodbye): Promise<void> {
    this.socket.emit(SERVER_MESSAGE, message);
  }

  register(l: RegisterableListener): void {
    this.listeners.set(l.id!, l);
  }

  unregister(id: string): void {
    this.listeners.delete(id);
  }

  createUUID(): string {
    return uuidv4();
  }

  createMeta() {
    return {
      requestUuid: this.createUUID(),
      timestamp: new Date(),
      source: this.getAppIdentifier(),
    };
  }

  async disconnect(): Promise<void> {
    const bye: WebConnectionProtocol6Goodbye = {
      type: 'WCP6Goodbye',
      meta: {
        timestamp: new Date(),
      },
    };
    await this.post(bye);

    this.socket.disconnect();
  }
}
