import {
  ApiEvent,
  ContextHandler,
  EventHandler,
  Listener,
  PrivateChannel,
  PrivateChannelEventTypes,
} from '@kite9/fdc3-standard';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { DefaultChannel } from './DefaultChannel';
import { Messaging } from '../Messaging';
import {
  PrivateChannelAddContextEventListener,
  PrivateChannelDisconnectEventListener,
  PrivateChannelUnsubscribeEventListener,
} from '../listeners/PrivateChannelEventListener';
import { DefaultContextListener } from '../listeners/DefaultContextListener';
import { RegisterableListener } from '../listeners/RegisterableListener';

type PrivateChannelDisconnectRequest = BrowserTypes.PrivateChannelDisconnectRequest;
type PrivateChannelDisconnectResponse = BrowserTypes.PrivateChannelDisconnectResponse;

export class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {
  constructor(messaging: Messaging, id: string) {
    super(messaging, id, 'private');
  }

  async addEventListener(type: PrivateChannelEventTypes | null, handler: EventHandler): Promise<Listener> {
    function wrapEventHandlerString(): (m: string | null) => void {
      return (m: string | null) => {
        handler({
          type,
          details: m,
        } as ApiEvent);
      };
    }

    function wrapEventHandlerVoid(): () => void {
      return () => {
        handler({
          type,
        } as ApiEvent);
      };
    }

    if (type) {
      let a: RegisterableListener;
      switch (type) {
        case 'addContextListener':
          a = new PrivateChannelAddContextEventListener(this.messaging, this.id, wrapEventHandlerString());
          break;
        case 'unsubscribe':
          a = new PrivateChannelUnsubscribeEventListener(this.messaging, this.id, wrapEventHandlerString());
          break;
        case 'disconnect':
          a = new PrivateChannelDisconnectEventListener(this.messaging, this.id, wrapEventHandlerVoid());
          break;
      }
      await a.register();
      return a;
    }

    throw new Error('Unsupported event type: ' + type);
  }

  //implementations of the deprecated listener functions
  onAddContextListener(handler: (contextType?: string) => void): Listener {
    const l = new PrivateChannelAddContextEventListener(this.messaging, this.id, (contextType: string | null) => {
        //Adapt handler type for differences between addEventListener and onAddContextListener handler types
        handler(contextType !== null ? contextType : undefined);
    });
    l.register();
    return l;
  }

  onUnsubscribe(handler: (contextType?: string) => void): Listener {
    const l = new PrivateChannelUnsubscribeEventListener(this.messaging, this.id, (contextType: string | null) => {
      //Adapt handler type differences between addEventListener and onUnsubscribe handler types
      handler(contextType !== null ? contextType : undefined);
    });
    l.register();
    return l;
  }

  onDisconnect(handler: () => void): Listener {
    const l = new PrivateChannelDisconnectEventListener(this.messaging, this.id, handler);
    l.register();
    return l;
  }

  async disconnect(): Promise<void> {
    await this.messaging.exchange<PrivateChannelDisconnectResponse>(
      {
        meta: this.messaging.createMeta(),
        payload: {
          channelId: this.id,
        },
        type: 'privateChannelDisconnectRequest',
      } as PrivateChannelDisconnectRequest,
      'privateChannelDisconnectResponse'
    );
  }

  async addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
    const listener = new DefaultContextListener(this.messaging, this.id, contextType, theHandler);
    await listener.register();
    return listener;
  }
}
