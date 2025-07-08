import {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  Context,
  DesktopAgent,
  EventHandler,
  ImplementationMetadata,
  IntentHandler,
  IntentResolution,
  IntentResult,
  Listener,
  PrivateChannel,
} from '@finos/fdc3';
import { IntentResolutionDelegate } from './IntentResolutionDelegate';

/**
 * This class implements a simple delegate, forwarding all
 * behaviour to the 'd' member.
 */
export abstract class AbstractDesktopAgentDelegate implements DesktopAgent {
  readonly delegate: DesktopAgent;

  constructor(d: DesktopAgent) {
    this.delegate = d;
  }

  abstract wrapChannel(c: Channel): Channel;

  wrapIntentResolution(ir: IntentResolution): IntentResolution {
    return new IntentResolutionDelegate(this, ir);
  }

  abstract wrapIntentResult(r: IntentResult): IntentResult;

  addContextListener(context: any, handler?: any): Promise<Listener> {
    return this.delegate.addContextListener(context as any, handler);
  }

  open(a1: any, a2?: any): Promise<AppIdentifier> {
    return this.delegate.open(a1, a2);
  }

  findIntent(intent: string, context?: Context | undefined, resultType?: string | undefined): Promise<AppIntent> {
    return this.delegate.findIntent(intent, context, resultType);
  }

  findIntentsByContext(context: Context, resultType?: string | undefined): Promise<AppIntent[]> {
    return this.delegate.findIntentsByContext(context, resultType);
  }

  findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
    return this.delegate.findInstances(app);
  }

  broadcast(context: Context): Promise<void> {
    return this.delegate.broadcast(context);
  }

  raiseIntent(intent: string, context: Context, a3?: any): Promise<IntentResolution> {
    return this.delegate.raiseIntent(intent, context, a3).then(ir => this.wrapIntentResolution(ir));
  }

  raiseIntentForContext(context: Context, a2?: any): Promise<IntentResolution> {
    return this.delegate.raiseIntentForContext(context, a2).then(ir => this.wrapIntentResolution(ir));
  }

  addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
    return this.delegate.addIntentListener(intent, handler);
  }

  async getUserChannels(): Promise<Channel[]> {
    const channels = await this.delegate.getUserChannels();
    return channels.map(c => this.wrapChannel(c));
  }

  joinUserChannel(channelId: string): Promise<void> {
    return this.delegate.joinUserChannel(channelId);
  }

  async getOrCreateChannel(channelId: string): Promise<Channel> {
    const ch = await this.delegate.getOrCreateChannel(channelId);
    return this.wrapChannel(ch);
  }

  async createPrivateChannel(): Promise<PrivateChannel> {
    const ch = await this.delegate.createPrivateChannel();
    return this.wrapChannel(ch) as PrivateChannel;
  }

  async getCurrentChannel(): Promise<Channel | null> {
    const ch = await this.delegate.getCurrentChannel();
    if (ch) {
      return this.wrapChannel(ch);
    } else {
      return null;
    }
  }

  leaveCurrentChannel(): Promise<void> {
    return this.delegate.leaveCurrentChannel();
  }

  getInfo(): Promise<ImplementationMetadata> {
    return this.delegate.getInfo();
  }

  getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    return this.delegate.getAppMetadata(app);
  }

  async getSystemChannels(): Promise<Channel[]> {
    const channels = await this.delegate.getSystemChannels();
    return channels.map(c => this.wrapChannel(c));
  }

  joinChannel(channelId: string): Promise<void> {
    return this.delegate.joinChannel(channelId);
  }

  addEventListener(type: 'userChannelChanged' | null, listener: EventHandler): Promise<Listener> {
    return this.delegate.addEventListener(type, listener);
  }
}
