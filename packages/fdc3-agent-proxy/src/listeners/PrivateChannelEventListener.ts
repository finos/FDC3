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
} from '@finos/fdc3-standard';
import { BrowserTypes } from '@finos/fdc3-schema';
import { Logger } from '../util/Logger';
const {
  isPrivateChannelOnAddContextListenerEvent,
  isPrivateChannelOnDisconnectEvent,
  isPrivateChannelOnUnsubscribeEvent,
} = BrowserTypes;
type PrivateChannelAddEventListenerRequest = BrowserTypes.PrivateChannelAddEventListenerRequest;
type PrivateChannelOnAddContextListenerEvent = BrowserTypes.PrivateChannelOnAddContextListenerEvent;
type PrivateChannelOnDisconnectEvent = BrowserTypes.PrivateChannelOnDisconnectEvent;
type PrivateChannelOnUnsubscribeEvent = BrowserTypes.PrivateChannelOnUnsubscribeEvent;

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
    messageExchangeTimeout: number,
    privateChannelId: string,
    eventMessageTypes: PrivateChannelEventMessageTypes[],
    eventType: PrivateChannelEventTypes | null,
    handler: (msg: PrivateChannelEventMessages) => void
  ) {
    super(
      messaging,
      messageExchangeTimeout,
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
  constructor(messaging: Messaging, messageExchangeTimeout: number, channelId: string, handler: EventHandler) {
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
      messageExchangeTimeout,
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
  constructor(messaging: Messaging, messageExchangeTimeout: number, channelId: string, handler: EventHandler) {
    const wrappedHandler = (msg: PrivateChannelEventMessages) => {
      if (isPrivateChannelOnDisconnectEvent(msg)) {
        const event: PrivateChannelDisconnectEvent = {
          type: 'disconnect',
          details: null,
        };
        handler(event);
      } else {
        Logger.error('PrivateChannelDisconnectEventListener was called for a different message type!', msg);
      }
    };

    super(
      messaging,
      messageExchangeTimeout,
      channelId,
      ['privateChannelOnDisconnectEvent'],
      'disconnect',
      wrappedHandler
    );
  }
}

export class PrivateChannelAddContextEventListener extends AbstractPrivateChannelEventListener {
  constructor(messaging: Messaging, messageExchangeTimeout: number, channelId: string, handler: EventHandler) {
    const wrappedHandler = (msg: PrivateChannelEventMessages) => {
      if (isPrivateChannelOnAddContextListenerEvent(msg)) {
        const event: ApiEvent = {
          type: 'addContextListener',
          details: { contextType: msg.payload.contextType },
        };
        handler(event);
      } else {
        Logger.error('PrivateChannelAddContextEventListener was called for a different message type!', msg);
      }
    };
    super(
      messaging,
      messageExchangeTimeout,
      channelId,
      ['privateChannelOnAddContextListenerEvent'],
      'addContextListener',
      wrappedHandler
    );
  }
}

export class PrivateChannelUnsubscribeEventListener extends AbstractPrivateChannelEventListener {
  constructor(messaging: Messaging, messageExchangeTimeout: number, channelId: string, handler: EventHandler) {
    const wrappedHandler = (msg: PrivateChannelEventMessages) => {
      if (isPrivateChannelOnUnsubscribeEvent(msg)) {
        const event: ApiEvent = {
          type: 'unsubscribe',
          details: { contextType: msg.payload.contextType },
        };
        handler(event);
      } else {
        Logger.error('PrivateChannelUnsubscribeEventListener was called for a different message type!', msg);
      }
    };
    super(
      messaging,
      messageExchangeTimeout,
      channelId,
      ['privateChannelOnUnsubscribeEvent'],
      'unsubscribe',
      wrappedHandler
    );
  }
}
