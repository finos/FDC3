import {
  isPrivateChannelOnAddContextListenerEvent,
  isPrivateChannelOnDisconnectEvent,
  isPrivateChannelOnUnsubscribeEvent,
  PrivateChannelAddEventListenerRequest,
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { Messaging } from '../Messaging';
import { AbstractListener } from './AbstractListener';
import {
  ApiEvent,
  EventHandler,
  PrivateChannelAddContextListenerEvent,
  PrivateChannelDisconnectEvent,
  PrivateChannelEvent,
  PrivateChannelEventTypes,
  PrivateChannelUnsubscribeEvent,
} from '@kite9/fdc3-standard';

type PrivateChannelEventMessages =
  | PrivateChannelOnAddContextListenerEvent
  | PrivateChannelOnUnsubscribeEvent
  | PrivateChannelOnDisconnectEvent;
type PrivateChannelEventMessageTypes = PrivateChannelEventMessages['type'];

abstract class AbstractPrivateChannelEventListener extends AbstractListener<
  (msg: PrivateChannelEventMessages) => void,
  PrivateChannelAddEventListenerRequest
> {
  readonly privateChannelId: string;
  readonly eventMessageTypes: PrivateChannelEventMessageTypes[];

  constructor(
    messaging: Messaging,
    privateChannelId: string,
    eventMessageTypes: PrivateChannelEventMessageTypes[],
    eventType: PrivateChannelEventTypes | null,
    handler: (msg: PrivateChannelEventMessages) => void
  ) {
    super(
      messaging,
      { privateChannelId, listenerType: eventType },
      handler,
      'privateChannelAddEventListenerRequest',
      'privateChannelAddEventListenerResponse',
      'privateChannelUnsubscribeEventListenerRequest',
      'privateChannelUnsubscribeEventListenerResponse'
    );
    this.privateChannelId = privateChannelId;
    this.eventMessageTypes = eventMessageTypes;
  }

  filter(m: PrivateChannelEventMessages): boolean {
    return this.eventMessageTypes.includes(m.type) && this.privateChannelId == m.payload.privateChannelId;
  }

  action(m: PrivateChannelEventMessages): void {
    this.handler(m);
  }
}

export class PrivateChannelNullEventListener extends AbstractPrivateChannelEventListener {
  constructor(messaging: Messaging, channelId: string, handler: EventHandler) {
    const wrappedHandler = (msg: PrivateChannelEventMessages) => {
      let type: PrivateChannelEventTypes;
      let details:
        | PrivateChannelAddContextListenerEvent['details']
        | PrivateChannelUnsubscribeEvent['details']
        | PrivateChannelDisconnectEvent['details'];
      switch (msg.type) {
        case 'privateChannelOnAddContextListenerEvent':
          type = 'addContextListener';
          details = { contextType: msg.payload.contextType };
          break;
        case 'privateChannelOnUnsubscribeEvent':
          type = 'unsubscribe';
          details = { contextType: msg.payload.contextType };
          break;
        case 'privateChannelOnDisconnectEvent':
          type = 'disconnect';
          details = null;
          break;
      }

      const event: PrivateChannelEvent = {
        type,
        details,
      };
      handler(event);
    };

    super(
      messaging,
      channelId,
      [
        'privateChannelOnAddContextListenerEvent',
        'privateChannelOnUnsubscribeEvent',
        'privateChannelOnDisconnectEvent',
      ],
      'addContextListener',
      wrappedHandler
    );
  }
}

export class PrivateChannelDisconnectEventListener extends AbstractPrivateChannelEventListener {
  constructor(messaging: Messaging, channelId: string, handler: EventHandler) {
    const wrappedHandler = (msg: PrivateChannelEventMessages) => {
      if (isPrivateChannelOnDisconnectEvent(msg)) {
        const event: PrivateChannelDisconnectEvent = {
          type: 'disconnect',
          details: null,
        };
        handler(event);
      } else {
        console.error('PrivateChannelDisconnectEventListener was called for a different message type!', msg);
      }
    };

    super(messaging, channelId, ['privateChannelOnDisconnectEvent'], 'disconnect', wrappedHandler);
  }
}

export class PrivateChannelAddContextEventListener extends AbstractPrivateChannelEventListener {
  constructor(messaging: Messaging, channelId: string, handler: EventHandler) {
    const wrappedHandler = (msg: PrivateChannelEventMessages) => {
      if (isPrivateChannelOnAddContextListenerEvent(msg)) {
        const event: ApiEvent = {
          type: 'addContextListener',
          details: { contextType: msg.payload.contextType },
        };
        handler(event);
      } else {
        console.error('PrivateChannelAddContextEventListener was called for a different message type!', msg);
      }
    };
    super(messaging, channelId, ['privateChannelOnAddContextListenerEvent'], 'addContextListener', wrappedHandler);
  }
}

export class PrivateChannelUnsubscribeEventListener extends AbstractPrivateChannelEventListener {
  constructor(messaging: Messaging, channelId: string, handler: EventHandler) {
    const wrappedHandler = (msg: PrivateChannelEventMessages) => {
      if (isPrivateChannelOnUnsubscribeEvent(msg)) {
        const event: ApiEvent = {
          type: 'unsubscribe',
          details: { contextType: msg.payload.contextType },
        };
        handler(event);
      } else {
        console.error('PrivateChannelUnsubscribeEventListener was called for a different message type!', msg);
      }
    };
    super(messaging, channelId, ['privateChannelOnUnsubscribeEvent'], 'unsubscribe', wrappedHandler);
  }
}
