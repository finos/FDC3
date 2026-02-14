import { AbstractMessaging, RegisterableListener } from '@finos/fdc3-agent-proxy';
import { AppIdentifier, GetAgentParams, WebDesktopAgentType } from '@finos/fdc3-standard';
import { v4 as uuidv4 } from 'uuid';
import {
  AppRequestMessage,
  WebConnectionProtocol3Handshake,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

/**
 * Details needed to set up the Messaging instance and Desktop AgentDetails record
 */
export type ConnectionDetails = {
  connectionAttemptUuid: string;
  handshake: WebConnectionProtocol3Handshake;
  messagePort: MessagePort;
  actualUrl: string;
  options: GetAgentParams;
  agentType: WebDesktopAgentType;
  agentUrl?: string;
  messageExchangeTimeout: number;
  appLaunchTimeout: number;
};
export class MessagePortMessaging extends AbstractMessaging {
  private readonly cd: ConnectionDetails;
  private readonly listeners: Map<string, RegisterableListener> = new Map();

  constructor(cd: ConnectionDetails, appIdentifier: AppIdentifier) {
    super(appIdentifier);
    this.cd = cd;

    this.cd.messagePort.addEventListener('message', m => {
      this.listeners.forEach(v => {
        if (v.filter(m.data)) {
          v.action(m.data);
        }
      });
    });
  }

  createUUID(): string {
    return uuidv4();
  }

  async post(message: AppRequestMessage | WebConnectionProtocol6Goodbye): Promise<void> {
    this.cd.messagePort.postMessage(message);
    return Promise.resolve();
  }

  register(l: RegisterableListener): void {
    this.listeners.set(l.id!, l);
  }

  unregister(id: string): void {
    this.listeners.delete(id);
  }

  createMeta(): AppRequestMessage['meta'] {
    return {
      requestUuid: this.createUUID(),
      timestamp: new Date(),
      source: super.getAppIdentifier(),
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

    this.cd.messagePort.close();
  }
}
