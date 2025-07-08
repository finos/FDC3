import { Channel, DisplayMetadata, EventHandler, Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

/**
 * Wraps a standard FDC3 Channel or PrivateChannel.
 */
export class ChannelDelegate implements PrivateChannel {
  readonly delegate: PrivateChannel;
  id: string;
  type: 'user' | 'app' | 'private';
  displayMetadata?: DisplayMetadata | undefined;

  constructor(c: Channel | PrivateChannel) {
    this.delegate = c as PrivateChannel;
    this.id = c.id;
    this.type = c.type;
    this.displayMetadata = c.displayMetadata;
  }

  async wrapContext(ctx: Context): Promise<Context> {
    return ctx;
  }

  onAddContextListener(handler: (contextType?: string | undefined) => void): Listener {
    return this.delegate.onAddContextListener(handler);
  }

  onUnsubscribe(handler: (contextType?: string | undefined) => void): Listener {
    return this.delegate.onUnsubscribe(handler);
  }

  onDisconnect(handler: () => void): Listener {
    return this.delegate.onDisconnect(handler);
  }

  addEventListener(
    type: 'disconnect' | 'unsubscribe' | 'addContextListener',
    listener: EventHandler
  ): Promise<Listener> {
    return this.delegate.addEventListener(type, listener);
  }

  disconnect(): Promise<void> {
    return this.delegate.disconnect();
  }

  async broadcast(context: Context): Promise<void> {
    return this.delegate.broadcast(await this.wrapContext(context));
  }

  getCurrentContext(contextType?: string | undefined): Promise<Context | null> {
    return this.delegate.getCurrentContext(contextType);
  }

  addContextListener(a1: any, a2?: any): Promise<Listener> {
    console.log('Adding context listener');
    return this.delegate.addContextListener(a1, a2);
  }
}
