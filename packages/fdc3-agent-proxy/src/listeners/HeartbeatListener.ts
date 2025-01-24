import {
  AgentEventMessage,
  HeartbeatAcknowledgementRequest,
  HeartbeatEvent,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { Messaging } from '../Messaging';
import { RegisterableListener } from './RegisterableListener';
import { Logger } from '../util/Logger';

export class HeartbeatListener implements RegisterableListener {
  readonly id: string;
  readonly messaging: Messaging;

  constructor(messaging: Messaging) {
    this.id = 'heartbeat-' + messaging.createUUID();
    this.messaging = messaging;
  }

  filter(m: AgentEventMessage): boolean {
    return m.type === 'heartbeatEvent';
  }

  action(_m: AgentEventMessage): void {
    Logger.heartbeatLog('Responding to heartbeat request', _m);
    const request: HeartbeatAcknowledgementRequest = {
      type: 'heartbeatAcknowledgementRequest',
      meta: {
        requestUuid: this.messaging.createUUID(),
        timestamp: new Date(),
      },
      payload: {
        heartbeatEventUuid: (_m as HeartbeatEvent).meta.eventUuid,
      },
    };
    this.messaging.post(request);
  }

  async register(): Promise<void> {
    this.messaging.register(this);
  }

  async unsubscribe(): Promise<void> {
    this.messaging.unregister(this.id);
  }
}
