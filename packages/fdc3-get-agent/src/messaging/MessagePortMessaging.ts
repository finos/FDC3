import { AbstractWebMessaging } from './AbstractWebMessaging';
import { RegisterableListener } from '@kite9/fdc3-agent-proxy';
import { GetAgentParams } from '@kite9/fdc3-standard';
import { v4 as uuidv4 } from 'uuid';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { AddContextListenerRequestMeta } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
type WebConnectionProtocol3Handshake = BrowserTypes.WebConnectionProtocol3Handshake;

/**
 * Details needed to set up the Messaging instance
 */
export type ConnectionDetails = {
  connectionAttemptUuid: string;
  handshake: WebConnectionProtocol3Handshake;
  messagePort: MessagePort;
  actualUrl: string;
  options: GetAgentParams;
};

export class MessagePortMessaging extends AbstractWebMessaging {
  private readonly cd: ConnectionDetails;
  private readonly listeners: Map<string, RegisterableListener> = new Map();

  constructor(cd: ConnectionDetails, deliveryTimeoutMs?: number) {
    super(cd.options, cd.connectionAttemptUuid, cd.actualUrl, deliveryTimeoutMs);
    this.cd = cd;

    this.cd.messagePort.onmessage = m => {
      this.listeners.forEach((v, _k) => {
        if (v.filter(m.data)) {
          v.action(m.data);
        }
      });
    };
  }

  createUUID(): string {
    return uuidv4();
  }

  async post(message: object): Promise<void> {
    this.cd.messagePort.postMessage(message);
  }

  register(listener: RegisterableListener): void {
    if (!listener.id) {
      throw new Error('Provided listener must have an id');
    }

    this.listeners.set(listener.id, listener);
  }

  unregister(id: string): void {
    this.listeners.delete(id);
  }

  createMeta(): AddContextListenerRequestMeta {
    return {
      requestUuid: this.createUUID(),
      timestamp: new Date(),
      source: this.getSource(),
    };
  }

  async waitFor<X>(filter: (m: any) => boolean, timeoutErrorMessage?: string): Promise<X> {
    return await super.waitFor(filter, timeoutErrorMessage);
  }

  async disconnect(): Promise<void> {
    await super.disconnect();
    this.cd.messagePort.close();
  }
}
