import {
  AppIdentifier,
  AppMetadata,
  AppProvidableContextMetadata,
  ContextHandler,
  DesktopAgent,
  EventHandler,
  FDC3EventTypes,
  ImplementationMetadata,
  IntentHandler,
  IntentResolution,
  Listener,
  LogLevel,
} from '@finos/fdc3-standard';
import { ChannelSupport } from './channels/ChannelSupport';
import { AppSupport } from './apps/AppSupport';
import { IntentSupport } from './intents/IntentSupport';
import { Connectable, Channel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { HeartbeatSupport } from './heartbeat/HeartbeatSupport';
import { Logger } from './util/Logger';

/**
 * This splits out the functionality of the desktop agent into
 * app, channels and intents concerns.
 */
export class DesktopAgentProxy implements DesktopAgent, Connectable {
  readonly heartbeat: HeartbeatSupport;
  readonly channels: ChannelSupport;
  readonly intents: IntentSupport;
  readonly apps: AppSupport;
  readonly connectables: Connectable[];

  constructor(
    heartbeat: HeartbeatSupport,
    channels: ChannelSupport,
    intents: IntentSupport,
    apps: AppSupport,
    connectables: Connectable[],
    logLevel: LogLevel | null
  ) {
    this.heartbeat = heartbeat;
    this.intents = intents;
    this.channels = channels;
    this.apps = apps;
    this.connectables = connectables;
    //Default log level is set in the Logger utility
    if (logLevel) {
      Logger.setLogLevel(logLevel);
    }

    //bind all functions to allow destructuring
    this.addEventListener = this.addEventListener.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.broadcast = this.broadcast.bind(this);
    this.addContextListener = this.addContextListener.bind(this);
    this.getUserChannels = this.getUserChannels.bind(this);
    this.getSystemChannels = this.getSystemChannels.bind(this);
    this.getOrCreateChannel = this.getOrCreateChannel.bind(this);
    this.createPrivateChannel = this.createPrivateChannel.bind(this);
    this.leaveCurrentChannel = this.leaveCurrentChannel.bind(this);
    this.joinUserChannel = this.joinUserChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
    this.getCurrentChannel = this.getCurrentChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
    this.findIntent = this.findIntent.bind(this);
    this.findIntentsByContext = this.findIntentsByContext.bind(this);
    this.raiseIntent = this.raiseIntent.bind(this);
    this.addIntentListener = this.addIntentListener.bind(this);
    this.raiseIntentForContext = this.raiseIntentForContext.bind(this);
    this.open = this.open.bind(this);
    this.findInstances = this.findInstances.bind(this);
    this.getAppMetadata = this.getAppMetadata.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.connect = this.connect.bind(this);
  }

  addEventListener(type: FDC3EventTypes | null, handler: EventHandler): Promise<Listener> {
    switch (type) {
      case 'userChannelChanged':
        return this.channels.addChannelChangedEventHandler(handler);
      default:
        Logger.warn(`Tried to add a listener for an unknown event type: ${type}`);
        return Promise.reject(new Error('UnknownEventType'));
    }
  }

  getInfo(): Promise<ImplementationMetadata> {
    return this.apps.getImplementationMetadata();
  }

  async broadcast(context: Context, metadata?: AppProvidableContextMetadata): Promise<void> {
    const channel = await this.channels.getUserChannel();
    if (channel) {
      return channel.broadcast(context, metadata);
    } else {
      return Promise.resolve();
    }
  }

  addContextListener(
    contextTypeOrHandler: ContextHandler | string | null,
    handler?: ContextHandler
  ): Promise<Listener> {
    let theContextType: string | null;
    let theHandler: ContextHandler;

    if (contextTypeOrHandler == null && typeof handler === 'function') {
      theContextType = null;
      theHandler = handler;
    } else if (typeof contextTypeOrHandler === 'string' && typeof handler === 'function') {
      theContextType = contextTypeOrHandler;
      theHandler = handler;
    } else if (typeof contextTypeOrHandler === 'function') {
      // deprecated one-arg version
      theContextType = null;
      theHandler = contextTypeOrHandler as ContextHandler;
    } else {
      //invalid call
      // TODO: Replace with Standardized error when #1490 is resolved
      throw new Error('Invalid arguments passed to addContextListener!');
    }

    return this.channels.addContextListener(theHandler, theContextType);
  }

  getUserChannels() {
    return this.channels.getUserChannels();
  }

  getSystemChannels() {
    return this.channels.getUserChannels();
  }

  getOrCreateChannel(channelId: string) {
    return this.channels.getOrCreate(channelId);
  }

  createPrivateChannel() {
    return this.channels.createPrivateChannel();
  }

  leaveCurrentChannel() {
    return this.channels.leaveUserChannel();
  }

  joinUserChannel(channelId: string) {
    return this.channels.joinUserChannel(channelId);
  }

  joinChannel(channelId: string) {
    return this.channels.joinUserChannel(channelId);
  }

  getCurrentChannel(): Promise<Channel | null> {
    return this.channels.getUserChannel();
  }

  findIntent(intent: string, context: Context, resultType: string | undefined) {
    return this.intents.findIntent(intent, context, resultType);
  }

  findIntentsByContext(context: Context) {
    return this.intents.findIntentsByContext(context);
  }

  private ensureAppId(app?: string | AppIdentifier): AppIdentifier | undefined {
    if (typeof app === 'string') {
      return {
        appId: app,
      };
    } else if (app?.appId) {
      return app as AppIdentifier;
    } else {
      return undefined;
    }
  }

  raiseIntent(intent: string, context: Context, app?: string | AppIdentifier, metadata?: AppProvidableContextMetadata) {
    return this.intents.raiseIntent(intent, context, this.ensureAppId(app), metadata);
  }

  addIntentListener(intent: string, handler: IntentHandler) {
    return this.intents.addIntentListener(intent, handler);
  }

  raiseIntentForContext(
    context: Context,
    app?: string | AppIdentifier,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    return this.intents.raiseIntentForContext(context, this.ensureAppId(app), metadata);
  }

  open(app: string | AppIdentifier, context?: Context, metadata?: AppProvidableContextMetadata) {
    return this.apps.open(this.ensureAppId(app)!, context, metadata);
  }

  findInstances(app: AppIdentifier) {
    return this.apps.findInstances(app);
  }

  getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    return this.apps.getAppMetadata(app);
  }

  async disconnect(): Promise<void> {
    await Promise.all(this.connectables.map(c => c.disconnect()));
  }

  async connect(): Promise<void> {
    await Promise.all(this.connectables.map(c => c.connect()));
  }
}
