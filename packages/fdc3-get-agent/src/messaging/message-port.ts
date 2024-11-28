import { AppIdentifier, DesktopAgent } from "@kite9/fdc3-standard";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport, ChannelSupport, DefaultHeartbeatSupport } from "@kite9/fdc3-agent-proxy";
import { ConnectionDetails, MessagePortMessaging } from "./MessagePortMessaging";
import { DefaultDesktopAgentIntentResolver } from "../ui/DefaultDesktopAgentIntentResolver";
import { DefaultDesktopAgentChannelSelector } from "../ui/DefaultDesktopAgentChannelSelector";
import { NullIntentResolver } from "../ui/NullIntentResolver";
import { NullChannelSelector } from "../ui/NullChannelSelector";
import { ChannelSelector } from "@kite9/fdc3-standard";
import { Logger } from "../util/Logger";
import { WebConnectionProtocol6Goodbye } from "@kite9/fdc3-schema/generated/api/BrowserTypes";

/**
 * Given a message port, constructs a desktop agent to communicate via that.
 */
export async function createDesktopAgentAPI(cd: ConnectionDetails, appIdentifier: AppIdentifier): Promise<DesktopAgent> {

    cd.messagePort.start();

    function string(o: string | boolean): string | null {
        if ((o == true) || (o == false)) {
            return null;
        } else {
            return o;
        }
    }

    const messaging = new MessagePortMessaging(cd, appIdentifier);

    const useResolver = cd.handshake.payload.intentResolverUrl && cd.options.intentResolver;
    const useSelector = cd.handshake.payload.channelSelectorUrl && cd.options.channelSelector;

    const intentResolver = useResolver ?
        new DefaultDesktopAgentIntentResolver(string(cd.handshake.payload.intentResolverUrl)) :
        new NullIntentResolver();

    const channelSelector = useSelector ?
        new DefaultDesktopAgentChannelSelector(string(cd.handshake.payload.channelSelectorUrl))
        : new NullChannelSelector();

    const hs = new DefaultHeartbeatSupport(messaging);
    const cs = new DefaultChannelSupport(messaging, channelSelector);
    const is = new DefaultIntentSupport(messaging, intentResolver);
    const as = new DefaultAppSupport(messaging);
    const da = new BasicDesktopAgent(hs, cs, is, as, [hs, intentResolver, channelSelector]);
    await da.connect();

    await populateChannelSelector(cs, channelSelector);

    handleDisconnectOnPageHide(da, messaging);

    return da;
}

async function populateChannelSelector(cs: ChannelSupport, channelSelector: ChannelSelector): Promise<void> {
    const channel = await cs.getUserChannel()
    const userChannels = await cs.getUserChannels()
    channelSelector.updateChannel(channel?.id ?? null, userChannels)
}

function handleDisconnectOnPageHide(da: DesktopAgent, messaging: MessagePortMessaging) {
    globalThis.window.addEventListener("pagehide", async (event) => {
        Logger.log(`Received pagehide event with persisted ${event.persisted}`);
        
        //If persisted == true then the page is stored and might come back if the user hits back
        //  In that case don't disconnect and let heartbeat handle that instead
        
        //TODO: implement disconnect on any hide and reconnect if the page is shown again
        //  Will have to happen inside the BasicDesktopAgent as the reference to the DA needs to remain the same
        //  and any listeners need to be re-registered automatically etc.
        if (!event.persisted) {
            //the page is being destroyed, disconnect from the DA
            
            //Notify the Desktop Agent implementation to disconnect
            if ((da as any).disconnect) {
                (da as any).disconnect();
            }

            //disconnect the MessagePort - which should send WCP6Goodbye first
            messaging.disconnect();
        }
    });
}
