import { ContextHandler, ContextMetadata } from '@finos/fdc3-standard';
import { Messaging } from '../Messaging.js';
import { AbstractListener } from './AbstractListener.js';
import { AddContextListenerRequest, BroadcastEvent } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { RegisterableListener } from './RegisterableListener.js';

export class DefaultContextListener
  extends AbstractListener<ContextHandler, AddContextListenerRequest>
  implements RegisterableListener
{
  private readonly channelId: string | null;
  protected readonly messageType: string;
  protected readonly contextType: string | string[] | null;

  constructor(
    messaging: Messaging,
    messageExchangeTimeout: number,
    channelId: string | null,
    contextType: string | string[] | null,
    handler: ContextHandler,
    messageType: string = 'broadcastEvent'
  ) {
    // For arrays, use the contextTypes field in the payload
    if (Array.isArray(contextType)) {
      // Handle empty array case - will be caught upstream and return dummy listener
      if (contextType.length === 0) {
        throw new Error('Empty arrays should be handled upstream');
      }

      // Use the contextTypes field for array-based context types
      super(
        messaging,
        messageExchangeTimeout,
        { channelId, contextType: undefined, contextTypes: contextType },
        handler,
        'addContextListenerRequest',
        'addContextListenerResponse',
        'contextListenerUnsubscribeRequest',
        'contextListenerUnsubscribeResponse'
      );
    } else {
      // Single context type - use original logic
      super(
        messaging,
        messageExchangeTimeout,
        { channelId, contextType },
        handler,
        'addContextListenerRequest',
        'addContextListenerResponse',
        'contextListenerUnsubscribeRequest',
        'contextListenerUnsubscribeResponse'
      );
    }

    this.channelId = channelId;
    this.messageType = messageType;
    this.contextType = contextType;
  }

  filter(m: BroadcastEvent): boolean {
    // Handle array context types in filtering
    let contextTypeMatch = false;
    if (Array.isArray(this.contextType)) {
      // For arrays, match if any type in the array matches
      contextTypeMatch = this.contextType.includes(m.payload.context?.type ?? '');
    } else {
      // Single context type - use original logic
      contextTypeMatch = m.payload.context?.type == this.contextType || this.contextType == null;
    }

    return m.type == this.messageType && m.payload.channelId == this.channelId && contextTypeMatch;
  }

  action(m: BroadcastEvent): void {
    const metadata: ContextMetadata = {
      source: m.payload.metadata?.source,
      timestamp: m.payload.metadata?.timestamp ?? m.meta.timestamp,
      traceId: m.payload.metadata?.traceId,
      signature: m.payload.metadata?.signature,
      custom: m.payload.metadata?.custom,
      antiReplay: m.payload.metadata?.antiReplay,
    };
    this.handler(m.payload.context, metadata);
  }
}
