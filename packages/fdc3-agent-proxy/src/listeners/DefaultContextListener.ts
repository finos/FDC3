import { ContextHandler } from '@finos/fdc3-standard';
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
  protected readonly contextType: string | null;

  constructor(
    messaging: Messaging,
    messageExchangeTimeout: number,
    channelId: string | null,
    contextType: string | null,
    handler: ContextHandler,
    messageType: string = 'broadcastEvent'
  ) {
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
    this.channelId = channelId;
    this.messageType = messageType;
    this.contextType = contextType;
  }

  filter(m: BroadcastEvent): boolean {
    return (
      m.type == this.messageType &&
      m.payload.channelId == this.channelId &&
      (m.payload.context?.type == this.contextType || this.contextType == null)
    );
  }

  action(m: BroadcastEvent): void {
    this.handler(m.payload.context);
  }
}
