import { AppIdentifier, Context, ContextHandler, DesktopAgent, IntentHandler, Listener } from "@finos/fdc3";
import { DesktopAgentProvider } from "./DesktopAgentProvider";
import { ChannelSupport } from "./channels/ChannelSupport";
import { IntentSupport } from "./intents/IntentSupport";

/**
 * This splits out the functionality of the desktop agent into 
 * provider details, channels and intents concerns.
 */
export class BasicDesktopAgent implements DesktopAgent {

    readonly provider: DesktopAgentProvider
    readonly channels: ChannelSupport
    readonly intents: IntentSupport

    constructor(provider: DesktopAgentProvider, channels: ChannelSupport, intents: IntentSupport) {
        this.provider = provider
        this.intents = intents
        this.channels = channels
    }    

    getInfo() {
        return Promise.resolve(this.provider.getImplementationMetadata());
    }

    async broadcast(context: Context): Promise<void> {
        const channel = await this.channels.getUserChannel();
        return channel.broadcast(context);
    }

    async addContextListener(context: ContextHandler | string | null, handler?: ContextHandler): Promise<Listener> {
        const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
        const theContextType: string | null = context && handler ? (context as string) : null;
        const channel = await this.channels.getUserChannel();
        return channel.addContextListener(theContextType, theHandler);
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
  
    joinUserChannel(channel: string) {
        return this.channels.joinUserChannel(channel);
    }
  
    getCurrentChannel() {
        return this.channels.getUserChannel();
    }
       
    findIntent(intent: string, context: Context, resultType: string | undefined) {
        return this.intents.findIntent(intent, context, resultType)
    }

    findIntentsByContext(context: Context) {
        return this.intents.findIntentsByContext(context);
    }

    raiseIntent(intent: string, context: Context, app?: any) {
        return this.intents.raiseIntent(intent, context, app);
    }

    raiseIntentForContext(context: Context, app?: AppIdentifier | undefined) {
        //return this.intents.raiseIntentForContext(context, app);
    }
  
    addIntentListener(intent: string, handler: IntentHandler) {
        return this.intents.addIntentListener(intent, handler);
    }
}