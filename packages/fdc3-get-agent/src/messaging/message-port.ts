import { AppIdentifier, DesktopAgent } from "@kite9/fdc3-standard";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport, ChannelSupport, DefaultHeartbeatSupport } from "@kite9/fdc3-agent-proxy";
import { ConnectionDetails, MessagePortMessaging } from "./MessagePortMessaging";
import { DefaultDesktopAgentIntentResolver } from "../ui/DefaultDesktopAgentIntentResolver";
import { DefaultDesktopAgentChannelSelector } from "../ui/DefaultDesktopAgentChannelSelector";
import { NullIntentResolver } from "../ui/NullIntentResolver";
import { NullChannelSelector } from "../ui/NullChannelSelector";
import { ChannelSelector } from "@kite9/fdc3-standard";

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

    handleDisconnectOnPageHide(da);

    return da;
}

async function populateChannelSelector(cs: ChannelSupport, channelSelector: ChannelSelector): Promise<void> {
    const channel = await cs.getUserChannel()
    const userChannels = await cs.getUserChannels()
    channelSelector.updateChannel(channel?.id ?? null, userChannels)
}

function handleDisconnectOnPageHide(da: DesktopAgent) {
    globalThis.window.addEventListener("pagehide", (event) => {
        //the page is being destroyed, disconnect from the DA
        if (!event.persisted) { 
            if ((da as any).disconnect) {
                (da as any).disconnect();
            }
        }
    });
}
