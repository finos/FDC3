import { ChannelEventTypes, EventHandler, FDC3ContextClearedEvent } from '@finos/fdc3-standard';
import { Messaging } from '../Messaging.js';
import { RegisterableListener } from './RegisterableListener.js';
import { AgentEventMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export class EventListener implements RegisterableListener {
  readonly id: string;
  readonly messaging: Messaging;
  readonly type: ChannelEventTypes | null;
  readonly channelId: string;
  readonly handler: EventHandler;

  constructor(messaging: Messaging, type: ChannelEventTypes | null, channelId: string, handler: EventHandler) {
    this.id = `${channelId}-${type ?? 'all'}-${messaging.createUUID()}`;
    this.messaging = messaging;
    this.type = type;
    this.channelId = channelId;
    this.handler = handler;

    //bind to allow destructuring
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  filter(m: AgentEventMessage): boolean {
    return m.type === 'contextClearedEvent' && m.payload.channelId === this.channelId;
  }

  action(m: AgentEventMessage): void {
    if (m.type === 'contextClearedEvent' && m.payload.channelId === this.channelId) {
      const event: FDC3ContextClearedEvent = {
        type: 'contextCleared',
        details: { contextType: m.payload.contextType },
      };
      this.handler(event);
    }
  }

  async register(): Promise<void> {
    this.messaging.register(this);
  }

  async unsubscribe(): Promise<void> {
    this.messaging.unregister(this.id);
  }
}
