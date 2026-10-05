import { ChannelEventTypes, EventHandler, FDC3ContextClearedEvent } from '@finos/fdc3-standard';
import { Messaging } from '../Messaging.js';
import { AbstractListener } from './AbstractListener.js';
import {
  AddEventListenerRequest,
  AddEventListenerRequestPayload,
  AgentEventMessage,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

function getRequestPayload(type: ChannelEventTypes | null, channelId: string): AddEventListenerRequestPayload {
  if (type == 'contextCleared') {
    return {
      type: 'CONTEXT_CLEARED',
      channelId,
    };
  } else if (type == null) {
    return {
      type: null,
      channelId,
    };
  } else {
    throw new Error('UnknownEventType');
  }
}

/**
 * Listens to Channel-scoped events (currently `contextCleared`) for a specific Channel.
 * Registration is sent to the Desktop Agent over DACP with the Channel's id so the Desktop
 * Agent can route events to this app, and inbound events are additionally filtered locally by
 * `channelId` so that only events for this Channel are delivered to the handler.
 */
export class EventListener extends AbstractListener<EventHandler, AddEventListenerRequest> {
  readonly type: ChannelEventTypes | null;
  readonly channelId: string;

  constructor(
    messaging: Messaging,
    messageExchangeTimeout: number,
    type: ChannelEventTypes | null,
    channelId: string,
    handler: EventHandler
  ) {
    super(
      messaging,
      messageExchangeTimeout,
      getRequestPayload(type, channelId),
      handler,
      'addEventListenerRequest',
      'addEventListenerResponse',
      'eventListenerUnsubscribeRequest',
      'eventListenerUnsubscribeResponse'
    );
    this.type = type;
    this.channelId = channelId;
  }

  filter(m: AgentEventMessage): boolean {
    return m.type === 'contextClearedEvent' && m.payload.channelId === this.channelId;
  }

  action(m: AgentEventMessage): void {
    if (m.type === 'contextClearedEvent' && m.payload.channelId === this.channelId) {
      const event: FDC3ContextClearedEvent = {
        type: 'contextCleared',
        details: { channelId: m.payload.channelId, contextType: m.payload.contextType },
      };
      this.handler(event);
    }
  }
}
