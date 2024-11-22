import {
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { Messaging } from '../Messaging';
import { AbstractListener } from './AbstractListener';
import { PrivateChannelEventTypes } from '@kite9/fdc3-standard';

type PrivateChannelEventMessages =
  | PrivateChannelOnAddContextListenerEvent
  | PrivateChannelOnUnsubscribeEvent
  | PrivateChannelOnDisconnectEvent;
type PrivateChannelEventMessageTypes = PrivateChannelEventMessages['type'];

abstract class AbstractPrivateChannelEventListener<
  X extends (() => void) | ((s: string | null) => void),
> extends AbstractListener<X> {
  readonly privateChannelId: string;
  readonly eventMessageType: PrivateChannelEventMessageTypes;
  readonly eventType: PrivateChannelEventTypes;

  constructor(
    messaging: Messaging,
    privateChannelId: string,
    eventMessageType: PrivateChannelEventMessageTypes,
    eventType: PrivateChannelEventTypes,
    handler: X
  ) {
    super(
      messaging,
      { privateChannelId, eventMessageType },
      handler,
      'privateChannelAddEventListenerRequest',
      'privateChannelAddEventListenerResponse',
      'privateChannelUnsubscribeEventListenerRequest',
      'privateChannelUnsubscribeEventListenerResponse'
    );
    this.privateChannelId = privateChannelId;
    this.eventMessageType = eventMessageType;
    this.eventType = eventType;
  }

  filter(m: PrivateChannelEventMessages) {
    return m.type == this.eventMessageType && this.privateChannelId == m.payload.privateChannelId;
  }

  abstract action(m: PrivateChannelEventMessages): void;
}

export class PrivateChannelDisconnectEventListener extends AbstractPrivateChannelEventListener<() => void> {
  constructor(messaging: Messaging, channelId: string, handler: () => void) {
    super(messaging, channelId, 'privateChannelOnDisconnectEvent', 'disconnect', handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action(_m: PrivateChannelOnDisconnectEvent): void {
    this.handler();
  }
}

export class PrivateChannelAddContextEventListener extends AbstractPrivateChannelEventListener<(contextType: string | null) => void> {
    constructor(messaging: Messaging, channelId: string, handler: (contextType: string | null) => void) {
      super(messaging, channelId, 'privateChannelOnAddContextListenerEvent', 'addContextListener', handler);
    }
  
    action(m: PrivateChannelOnAddContextListenerEvent): void {
      this.handler(m.payload.contextType);
    }
  }

  export class PrivateChannelUnsubscribeEventListener extends AbstractPrivateChannelEventListener<(contextType: string | null) => void> {
    constructor(messaging: Messaging, channelId: string, handler: (contextType: string | null) => void) {
      super(messaging, channelId, 'privateChannelOnUnsubscribeEvent', 'unsubscribe', handler);
    }
  
    action(m: PrivateChannelOnAddContextListenerEvent): void {
      this.handler(m.payload.contextType);
    }
  }
