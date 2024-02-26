import { AppIdentifier, AppMetadata, Context, ContextHandler, DesktopAgent, ImplementationMetadata, IntentHandler, IntentResolution, Listener } from "@finos/fdc3";
import { ChannelSupport } from "./channels/ChannelSupport";
import { AppSupport } from "./apps/AppSupport";
import { IntentSupport } from "./intents/IntentSupport";

/**
 * This splits out the functionality of the desktop agent into 
 * app, channels and intents concerns.
 */
export class BasicDesktopAgent implements DesktopAgent {

    readonly channels: ChannelSupport
    readonly intents: IntentSupport
    readonly apps: AppSupport
    readonly fdc3Version: string
    readonly provider: string

    constructor(channels: ChannelSupport, intents: IntentSupport, apps: AppSupport, fdc3Version: string, provider: string) {
        this.intents = intents
        this.channels = channels
        this.apps = apps
        this.fdc3Version = fdc3Version
        this.provider = provider
    }    

    async getInfo() : Promise<ImplementationMetadata>{
        const am = await this.apps.getThisAppMetadata()
        return {
            fdc3Version: this.fdc3Version,
            provider: this.provider,
            appMetadata: am,
            optionalFeatures: {
                OriginatingAppMetadata: this.apps.hasOriginatingAppMetadata(),
                UserChannelMembershipAPIs: this.channels.hasUserChannelMembershipAPIs(),
                DesktopAgentBridging: this.apps.hasDesktopAgentBridging()
            }
        }
    }

    async broadcast(context: Context): Promise<void> {
        const channel = await this.channels.getUserChannel()
        if (channel) {
            return channel.broadcast(context)
        } else {
            return Promise.resolve();
        }
    }

    async addContextListener(context: ContextHandler | string | null, handler?: ContextHandler): Promise<Listener> {
        const theHandler: ContextHandler = handler ? handler : (context as ContextHandler)
        const theContextType: string | null = context && handler ? (context as string) : null
        return this.channels.addContextListener(theHandler, theContextType)
    }

    getUserChannels() {
        return this.channels.getUserChannels()
    }
  
    getSystemChannels() {
        return this.channels.getUserChannels()
    }

    getOrCreateChannel(channelId: string) {
        return this.channels.getOrCreate(channelId)
    }

    createPrivateChannel() {
        return this.channels.createPrivateChannel()
    }

    leaveCurrentChannel() {
        return this.channels.leaveUserChannel()
    }
  
    joinUserChannel(channelId: string) {
        return this.channels.joinUserChannel(channelId)
    }

    joinChannel(channelId: string) {
        return this.channels.joinUserChannel(channelId)
    }
  
    getCurrentChannel() {
        return this.channels.getUserChannel();
    }
       
    findIntent(intent: string, context: Context, resultType: string | undefined) {
        return this.intents.findIntent(intent, context, resultType)
    }

    findIntentsByContext(context: Context) {
        return this.intents.findIntentsByContext(context)
    }

    private ensureAppId(app?: any) : AppIdentifier | undefined {
        if (typeof app === "string") {
            return {
                appId: app
            }
        } else if (app?.appId) {
            return app as AppIdentifier
        } else {
            return undefined;
        }
    }

    raiseIntent(intent: string, context: Context, app?: any) {
        return this.intents.raiseIntent(intent, context, this.ensureAppId(app))
    }
  
    addIntentListener(intent: string, handler: IntentHandler) {
        return this.intents.addIntentListener(intent, handler)
    }

    raiseIntentForContext(context: Context, app?: any): Promise<IntentResolution> {
        return this.intents.raiseIntentForContext(context, this.ensureAppId(app))
    }

    open(app: any, context?: Context | undefined) {
        return this.apps.open(this.ensureAppId(app)!, context)
    }

    findInstances(app: AppIdentifier) {
        return this.apps.findInstances(app)
    }

    getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
        return this.apps.getAppMetadata(app);
    }

}