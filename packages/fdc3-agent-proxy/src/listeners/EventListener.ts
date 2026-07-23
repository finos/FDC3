import { ApiEvent, EventHandler } from '@finos/fdc3-standard';
import { Messaging } from '../Messaging.js';
import { RegisterableListener } from './RegisterableListener.js';
import { AgentEventMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export class EventListener implements RegisterableListener {
  readonly id: string;
  readonly messaging: Messaging;
  readonly type: string | null;
  readonly handler: EventHandler;

  constructor(messaging: Messaging, type: string | null, handler: EventHandler) {
    this.id = (type ?? 'all') + '-' + messaging.createUUID();
    this.messaging = messaging;
    this.type = type;
    this.handler = handler;

    //bind to allow destructuring
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  filter(m: AgentEventMessage): boolean {
    return this.type == null || m.type === this.type;
  }

  action(m: AgentEventMessage): void {
    if (this.type == null || m.type === this.type) {
      this.handler({
        type: m.type,
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
