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
  PrivateChannelNullEventListener,
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
    let a: RegisterableListener;
    switch (type) {
      case 'addContextListener':
        a = new PrivateChannelAddContextEventListener(this.messaging, this.id, handler);
        break;
      case 'unsubscribe':
        a = new PrivateChannelUnsubscribeEventListener(this.messaging, this.id, handler);
        break;
      case 'disconnect':
        a = new PrivateChannelDisconnectEventListener(this.messaging, this.id, handler);
        break;
      case null:
        a = new PrivateChannelNullEventListener(this.messaging, this.id, handler);
        break;
      default:
        throw new Error('Unsupported event type: ' + type);
    }
    await a.register();
    return a;
  }

  //implementations of the deprecated listener functions
  onAddContextListener(handler: (contextType?: string) => void): Listener {
    //Adapt handler type for differences between addEventListener and onAddContextListener handler types
    const adapterHandler: EventHandler = (event: ApiEvent) => { 
      handler(event.details.contextType ?? undefined);
    };
    const l = new PrivateChannelAddContextEventListener(this.messaging, this.id, adapterHandler);
    l.register();
    return l;
  }

  onUnsubscribe(handler: (contextType?: string) => void): Listener {
    //Adapt handler type for differences between addEventListener and onUnsubscribeListener handler types
    const adapterHandler: EventHandler = (event: ApiEvent) => { 
      handler(event.details.contextType ?? undefined);
    };
    const l = new PrivateChannelUnsubscribeEventListener(this.messaging, this.id, adapterHandler);
    l.register();
    return l;
  }

  onDisconnect(handler: () => void): Listener {
    //Adapt handler type for differences between addEventListener and onDisconnectListener handler types
    const adapterHandler: EventHandler = () => { 
      handler();
    };
    const l = new PrivateChannelDisconnectEventListener(this.messaging, this.id, adapterHandler);
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
