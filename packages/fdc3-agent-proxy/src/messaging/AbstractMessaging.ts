import { AppIdentifier } from '@finos/fdc3-standard';
import { Messaging } from '../Messaging';
import { RegisterableListener } from '../listeners/RegisterableListener';
import {
  AgentResponseMessage,
  AppRequestMessage,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';

export abstract class AbstractMessaging implements Messaging {
  private appIdentifier: AppIdentifier;

  abstract createUUID(): string;
  abstract post(message: AppRequestMessage | WebConnectionProtocol6Goodbye): Promise<void>;
  abstract register(l: RegisterableListener): void;
  abstract unregister(id: string): void;
  abstract createMeta(): AppRequestMessage['meta'];

  constructor(appIdentifier: AppIdentifier) {
    this.appIdentifier = appIdentifier;
  }

  waitFor<X extends AgentResponseMessage>(
    filter: (m: X) => boolean,
    timeoutMs?: number,
    timeoutErrorMessage?: string
  ): Promise<X> {
    const id = this.createUUID();
    return new Promise<X>((resolve, reject) => {
      let done = false;
      let timeout: NodeJS.Timeout | null = null;
      const l: RegisterableListener = {
        id,
        filter: filter,
        action: m => {
          done = true;
          this.unregister(id);
          if (timeout) {
            clearTimeout(timeout);
          }
          resolve(m as X);
        },
        register: async () => {
          this.register(l);
        },
        unsubscribe: async () => {
          this.unregister(id);
        },
      };

      this.register(l);

      if (timeoutMs) {
        timeout = setTimeout(() => {
          this.unregister(id);
          if (!done) {
            console.error(
              `waitFor rejecting after ${timeoutMs}ms at ${new Date().toISOString()}${timeoutErrorMessage ? ' with message: ' + timeoutErrorMessage : ''}`
            );
            reject(new Error(timeoutErrorMessage));
          }
        }, timeoutMs);
      }
    });
  }

  async exchange<X extends AgentResponseMessage>(
    message: AppRequestMessage,
    expectedTypeName: AgentResponseMessage['type'],
    timeoutMs: number,
    timeoutErrorMessage?: string
  ): Promise<X> {
    const errorMessage =
      timeoutErrorMessage ?? `Timeout waiting for ${expectedTypeName} with requestUuid ${message.meta.requestUuid}`;
    const prom = this.waitFor<X>(
      m => {
        return m.type == expectedTypeName && m.meta.requestUuid == message.meta.requestUuid;
      },
      timeoutMs,
      errorMessage
    );
    this.post(message);
    const out: X = await prom;
    if (out?.payload?.error) {
      throw new Error(out.payload.error);
    } else {
      return out;
    }
  }

  getAppIdentifier(): AppIdentifier {
    return this.appIdentifier;
  }

  abstract disconnect(): Promise<void>;
}
