import { ContextHandler, Channel } from '@kite9/fdc3-standard';
import { Messaging } from '../Messaging';
import { AbstractListener } from './AbstractListener';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { FollowingContextListener } from './FollowingContextListener';

type BroadcastEvent = BrowserTypes.BroadcastEvent;

export class DefaultContextListener extends AbstractListener<ContextHandler> implements FollowingContextListener {
  private channelId: string | null;
  private readonly messageType: string;
  private readonly contextType: string | null;

  constructor(
    messaging: Messaging,
    channelId: string | null,
    contextType: string | null,
    handler: ContextHandler,
    messageType: string = 'broadcastEvent',
    subscribeType: string = 'addContextListener',
    unsubscribeType: string = 'contextListenerUnsubscribe'
  ) {
    super(messaging, { channelId, contextType }, handler, subscribeType, unsubscribeType);
    this.channelId = channelId;
    this.messageType = messageType;
    this.contextType = contextType;
  }

  async changeChannel(channel: Channel | null): Promise<void> {
    if (channel == null) {
      this.channelId = null;
      return;
    } else {
      this.channelId = channel.id;
      const context = await channel.getCurrentContext(this.contextType ?? undefined);
      if (context) {
        this.handler(context);
      }
    }
  }

  filter(m: BroadcastEvent): boolean {
    return (
      m.type == this.messageType &&
      m.payload.channelId == this.channelId &&
      (m.payload.context?.type == this.contextType || this.contextType == null)
    );
  }

  action(m: any): void {
    this.handler(m.payload.context);
  }
}
