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
import { ChannelSupport } from './channels/ChannelSupport.js';
import { AppSupport } from './apps/AppSupport.js';
import { IntentSupport } from './intents/IntentSupport.js';
import { Connectable, Channel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { HeartbeatSupport } from './heartbeat/HeartbeatSupport.js';
import { Logger } from './util/Logger.js';

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
    this.getOrCreateChannel = this.getOrCreateChannel.bind(this);
    this.createPrivateChannel = this.createPrivateChannel.bind(this);
    this.leaveCurrentChannel = this.leaveCurrentChannel.bind(this);
    this.joinUserChannel = this.joinUserChannel.bind(this);
    this.getCurrentChannel = this.getCurrentChannel.bind(this);
    this.findIntent = this.findIntent.bind(this);
    this.findIntentsByContext = this.findIntentsByContext.bind(this);
    this.raiseIntent = this.raiseIntent.bind(this);
    this.addIntentListener = this.addIntentListener.bind(this);
    this.addIntentListenerWithContext = this.addIntentListenerWithContext.bind(this);
    this.raiseIntentForContext = this.raiseIntentForContext.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.findInstances = this.findInstances.bind(this);
    this.getAppMetadata = this.getAppMetadata.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.connect = this.connect.bind(this);
  }

  addEventListener(type: FDC3EventTypes | null, handler: EventHandler): Promise<Listener> {
    return this.channels.addEventListener(handler, type);
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

  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener> {
    if (typeof contextType !== 'string' && contextType !== null) {
      throw new Error('Invalid arguments passed to addContextListener!');
    }
    if (typeof handler !== 'function') {
      throw new Error('Invalid arguments passed to addContextListener!');
    }
    return this.channels.addContextListener(handler, contextType);
  }

  getUserChannels() {
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

  getCurrentChannel(): Promise<Channel | null> {
    return this.channels.getUserChannel();
  }

  findIntent(intent: string, context: Context, resultType: string | undefined) {
    return this.intents.findIntent(intent, context, resultType);
  }

  findIntentsByContext(context: Context) {
    return this.intents.findIntentsByContext(context);
  }

  raiseIntent(
    intent: string,
    context: Context,
    app?: AppIdentifier | null,
    newInstance?: boolean,
    metadata?: AppProvidableContextMetadata
  ) {
    return this.intents.raiseIntent(intent, context, app ?? undefined, newInstance, metadata);
  }

  addIntentListener(intent: string, handler: IntentHandler) {
    return this.intents.addIntentListener(intent, handler);
  }

  addIntentListenerWithContext(intent: string, contextType: string | string[], handler: IntentHandler) {
    return this.intents.addIntentListenerWithContext(intent, contextType, handler);
  }

  raiseIntentForContext(
    context: Context,
    app?: AppIdentifier | null,
    newInstance?: boolean,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    return this.intents.raiseIntentForContext(context, app ?? undefined, newInstance, metadata);
  }

  open(app: AppIdentifier, context?: Context | null, metadata?: AppProvidableContextMetadata) {
    return this.apps.open(app, context, metadata);
  }

  close(): Promise<void> {
    return this.apps.close();
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
