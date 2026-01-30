import { EventHandler, FDC3ChannelChangedEvent, FDC3EventTypes } from '@finos/fdc3-standard';
import {
  AddEventListenerRequest,
  AddEventListenerRequestPayload,
  AgentEventMessage,
  ChannelChangedEvent,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { Messaging } from '../Messaging';
import { AbstractListener } from './AbstractListener';

function wrapHandler(handler: EventHandler): (msg: AgentEventMessage) => void {
  return (m: AgentEventMessage) => {
    if (m.type === 'channelChangedEvent') {
      const restructured: FDC3ChannelChangedEvent = {
        type: 'userChannelChanged',
        details: {
          //backwards compatibility, see issue #1585
          currentChannelId: cm.payload.newChannelId ?? cm.payload.currentChannelId 
        }
      };

      handler(restructured);
    } else {
      // currently unused but meeting issue #1585
      handler({
        type: m.type,
        details: m.payload,
      });
    }
  };
}

function getRequestPayload(type: FDC3EventTypes | null): AddEventListenerRequestPayload {
  if (type == 'userChannelChanged') {
    return {
      type: 'USER_CHANNEL_CHANGED',
    };
  } else if (type == null) {
    return {
      type: null,
    };
  } else {
    throw new Error('UnknownEventType');
  }
}

function getEventType(type: FDC3EventTypes | null): ChannelChangedEvent['type'] | null {
  if (type == 'userChannelChanged') {
    return 'channelChangedEvent';
  } else if (type == null) {
    return null;
  } else {
    throw new Error('UnknownEventType');
  }
}

/**
 * Listens to channel changed events (currently) from the desktop agent and forwards them to the provided handler.
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
