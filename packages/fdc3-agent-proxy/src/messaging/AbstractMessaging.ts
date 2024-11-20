import { AppIdentifier, ImplementationMetadata } from '@kite9/fdc3-standard';
import { Messaging } from '../Messaging';
import { RegisterableListener } from '../listeners/RegisterableListener';
import {
  AgentResponseMessage,
  isAgentResponseMessage,
  WebConnectionProtocolMessage,
  AppRequestMessage
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

export abstract class AbstractMessaging implements Messaging {
  private appIdentifier: AppIdentifier | null = null;
  private implementationMetadata: ImplementationMetadata | null = null;

  abstract createUUID(): string;
  abstract post(message: object): Promise<void>;

  abstract register(l: RegisterableListener): void;
  abstract unregister(id: string): void;

  abstract createMeta(): AppRequestMessage['meta'];

  abstract getTimeoutMs(): number;

  constructor() {}

  getSource(): AppIdentifier | null {
    return this.appIdentifier;
  }

  waitFor<X>(
    filter: (m: AgentResponseMessage) => boolean,
    timeoutErrorMessage?: string
  ): Promise<X> {
    const id = this.createUUID();
    return new Promise<X>((resolve, reject) => {
      var done = false;
      const l: RegisterableListener = {
        id,
        filter: filter,
        action: m => {
          done = true;
          this.unregister(id);
          resolve(m);
        },
      } as RegisterableListener;

      this.register(l);

      if (timeoutErrorMessage) {
        setTimeout(() => {
          this.unregister(id);
          if (!done) {
            console.error(`Rejecting after ${this.getTimeoutMs()}ms with ${timeoutErrorMessage}`);
            reject(new Error(timeoutErrorMessage));
          }
        }, this.getTimeoutMs());
      }
    });
  }

  async exchange<X>(message: AppRequestMessage, expectedTypeName: string, timeoutErrorMessage?: string): Promise<X> {
    const errorMessage =
      timeoutErrorMessage ?? `Timeout waiting for ${expectedTypeName} with requestUuid ${message.meta.requestUuid}`;
    const prom = this.waitFor((m) => {
      if (isAgentResponseMessage(m)) {
        return m.type == expectedTypeName && m.meta.requestUuid == message.meta.requestUuid;
      } else {
        return false;
      }
    }, errorMessage);
    this.post(message);
    const out: any = await prom;
    if (out?.payload?.error) {
      throw new Error(out.payload.error);
    } else {
      return out;
    }
  }

  async getImplementationMetadata(): Promise<ImplementationMetadata | null> {
    return this.implementationMetadata;
  }

  setImplementationMetadata(impl: ImplementationMetadata | null) {
    this.implementationMetadata = impl;
  }

  async getAppIdentifier(): Promise<AppIdentifier | null> {
    return this.appIdentifier;
  }

  setAppIdentifier(ident: AppIdentifier | null) {
    this.appIdentifier = ident;
  }

  abstract connect(): Promise<void>;

  abstract disconnect(): Promise<void>;
}
