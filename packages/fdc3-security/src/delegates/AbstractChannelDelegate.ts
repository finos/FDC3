import {
  Channel,
  DisplayMetadata,
  EventHandler,
  Listener,
  PrivateChannel,
  ContextMetadata,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

export const APP_METADATA_KEY = '__appMeta';

/**
 * Wraps a standard FDC3 Channel or PrivateChannel so we can give it extra behaviour.
 */
export abstract class AbstractChannelDelegate implements PrivateChannel {
  protected readonly delegate: PrivateChannel;
  protected readonly metadataAvailable: boolean;
  id: string;
  type: 'user' | 'app' | 'private';
  displayMetadata?: DisplayMetadata | undefined;

  /**
   * @param c Channel to wrap
   * @param metadataAvailable Pass in true if running in FDC3 3.0 where we can broadcast our own metadata, otherwise false.
   */
  constructor(c: Channel | PrivateChannel, metadataAvailable: boolean) {
    this.delegate = c as PrivateChannel;
    this.id = c.id;
    this.type = c.type;
    this.displayMetadata = c.displayMetadata;
    this.metadataAvailable = metadataAvailable;
  }

  async clearContext(contextType?: string): Promise<void> {
    return this.delegate.clearContext(contextType);
  }

  abstract wrapContext(
    context: Context,
    metadata?: ContextMetadata
  ): Promise<{ context: Context; metadata?: ContextMetadata }>;

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

  async broadcast(context: Context, metadata?: ContextMetadata): Promise<void> {
    const wrapped = await this.wrapContext(context, metadata);
    if (this.metadataAvailable) {
      return this.delegate.broadcast(wrapped.context, wrapped.metadata);
    } else {
      const contextWithMeta = {
        ...context,
        __appMeta: wrapped.metadata,
      };
      return this.delegate.broadcast(contextWithMeta);
    }
  }

  getCurrentContext(contextType?: string | undefined): Promise<Context | null> {
    return this.delegate.getCurrentContext(contextType);
  }

  addContextListener(a1: any, a2?: any): Promise<Listener> {
    console.log('Adding context listener');
    return this.delegate.addContextListener(a1, a2);
  }
}
