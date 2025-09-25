import { ApiEvent, EventHandler } from '@finos/fdc3-standard';
import { Messaging } from '../Messaging.js';
import { RegisterableListener } from './RegisterableListener.js';
import { AgentEventMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export class EventListener implements RegisterableListener {
  readonly id: string;
  readonly messaging: Messaging;
  readonly type: string;
  readonly handler: EventHandler;

  constructor(messaging: Messaging, type: string, handler: EventHandler) {
    this.id = type + '-' + messaging.createUUID();
    this.messaging = messaging;
    this.type = type;
    this.handler = handler;
  }

  filter(m: AgentEventMessage): boolean {
    return m.type === this.type;
  }

  action(m: AgentEventMessage): void {
    if (m.type === this.type) {
      this.handler({
        type: this.type,
        details: m.payload,
      } as ApiEvent);
    }
  }

  async register(): Promise<void> {
    this.messaging.register(this);
  }

  async unsubscribe(): Promise<void> {
    this.messaging.unregister(this.id);
  }
}
