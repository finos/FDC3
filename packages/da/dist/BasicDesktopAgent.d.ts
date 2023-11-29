import { AppIdentifier, AppMetadata, Context, ContextHandler, DesktopAgent, ImplementationMetadata, IntentHandler, IntentResolution, Listener } from "@finos/fdc3";
import { ChannelSupport } from "./channels/ChannelSupport";
import { IntentSupport } from "./intents/IntentSupport";
import { AppSupport } from "./apps/AppSupport";
/**
 * This splits out the functionality of the desktop agent into
 * app, channels and intents concerns.
 */
export declare class BasicDesktopAgent implements DesktopAgent {
    readonly channels: ChannelSupport;
    readonly intents: IntentSupport;
    readonly apps: AppSupport;
    readonly fdc3Version: string;
    readonly provider: string;
    constructor(channels: ChannelSupport, intents: IntentSupport, apps: AppSupport, fdc3Version: string, provider: string);
    getInfo(): Promise<ImplementationMetadata>;
    broadcast(context: Context): Promise<void>;
    addContextListener(context: ContextHandler | string | null, handler?: ContextHandler): Promise<Listener>;
    getUserChannels(): Promise<import("@finos/fdc3").Channel[]>;
    getSystemChannels(): Promise<import("@finos/fdc3").Channel[]>;
    getOrCreateChannel(channelId: string): Promise<import("@finos/fdc3").Channel>;
    createPrivateChannel(): Promise<import("@finos/fdc3").PrivateChannel>;
    leaveCurrentChannel(): Promise<void>;
    joinUserChannel(channelId: string): Promise<void>;
    joinChannel(channelId: string): Promise<void>;
    getCurrentChannel(): Promise<import("@finos/fdc3").Channel | null>;
    findIntent(intent: string, context: Context, resultType: string | undefined): Promise<import("@finos/fdc3").AppIntent>;
    findIntentsByContext(context: Context): Promise<import("@finos/fdc3").AppIntent[]>;
    private ensureAppId;
    raiseIntent(intent: string, context: Context, app?: any): Promise<IntentResolution>;
    addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>;
    raiseIntentForContext(context: Context, app?: any): Promise<IntentResolution>;
    open(app: any, context?: Context | undefined): Promise<AppIdentifier>;
    findInstances(app: AppIdentifier): Promise<AppIdentifier[]>;
    getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
}
