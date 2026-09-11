import { EventHandler, FDC3ChannelChangedEvent, FDC3ContextClearedEvent, FDC3EventTypes } from '@finos/fdc3-standard';
import {
  AddEventListenerRequest,
  AddEventListenerRequestPayload,
  AgentEventMessage,
  ChannelChangedEvent,
  ContextClearedEvent,
} from '@finos/fdc3-schema/generated/api/BrowserTypes.js';
import { Messaging } from '../Messaging.js';
import { AbstractListener } from './AbstractListener.js';

const handleChannelChangedEvent = (handler: EventHandler, m: ChannelChangedEvent) => {
  const currentChannelId = m.payload.currentChannelId ?? m.payload.newChannelId ?? null;

  const channelChangedEvent: FDC3ChannelChangedEvent = {
    type: 'userChannelChanged',
    details: {
      currentChannelId,
    },
  };

  handler(channelChangedEvent);
};

const handleContextClearedEvent = (handler: EventHandler, m: ContextClearedEvent) => {
  const contextClearedEvent: FDC3ContextClearedEvent = {
    type: 'contextCleared',
    details: {
      channelId: m.payload.channelId,
      contextType: m.payload.contextType,
    },
  };

  handler(contextClearedEvent);
};

function wrapHandler(handler: EventHandler): (msg: AgentEventMessage) => void {
  return (m: AgentEventMessage) => {
    if (m.type === 'channelChangedEvent') {
      return handleChannelChangedEvent(handler, m);
    }

    if (m.type === 'contextClearedEvent') {
      return handleContextClearedEvent(handler, m);
    }

    //forward other events
    handler({
      type: m.type,
      details: m.payload,
    });
  };
}

function getRequestPayload(type: FDC3EventTypes | null): AddEventListenerRequestPayload {
  if (type == 'userChannelChanged') {
    return {
      type: 'USER_CHANNEL_CHANGED',
      channelId: null,
    };
  } else if (type == 'contextCleared') {
    return {
      type: 'CONTEXT_CLEARED',
      channelId: null,
    };
  } else if (type == null) {
    return {
      type: null,
      channelId: null,
    };
  } else {
    throw new Error('UnknownEventType');
  }
}

function getEventType(type: FDC3EventTypes | null): AgentEventMessage['type'] | null {
  if (type == 'userChannelChanged') {
    return 'channelChangedEvent';
  } else if (type == 'contextCleared') {
    return 'contextClearedEvent';
  } else if (type == null) {
    return null;
  } else {
    throw new Error('UnknownEventType');
  }
}

/**
 * Listens to Desktop Agent-level events (currently `userChannelChanged` and `contextCleared`)
 * from the Desktop Agent and forwards them to the provided handler. Desktop Agent-level
 * listeners are registered with a `null` channelId, so their scope follows the app's current
 * User channel.
 */
export class DesktopAgentEventListener extends AbstractListener<
  (msg: AgentEventMessage) => void,
  AddEventListenerRequest
> {
  type: string | null;

  constructor(
    messaging: Messaging,
    messageExchangeTimeout: number,
    type: FDC3EventTypes | null,
    handler: EventHandler
  ) {
    super(
      messaging,
      messageExchangeTimeout,
      getRequestPayload(type),
      wrapHandler(handler),
      'addEventListenerRequest',
      'addEventListenerResponse',
      'eventListenerUnsubscribeRequest',
      'eventListenerUnsubscribeResponse'
    );
    this.type = getEventType(type);
  }

  action(m: AgentEventMessage): void {
    this.handler(m);
  }

  filter(m: AgentEventMessage): boolean {
    return m.type === this.type || this.type == null;
  }
}
