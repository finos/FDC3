import { DesktopAgent } from "@finos/fdc3";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport, DefaultHandshakeSupport } from "@kite9/da-proxy";
import { ConnectionDetails, MessagePortMessaging } from "./MessagePortMessaging";
import { DefaultDesktopAgentIntentResolver } from "../intent-resolution/DefaultDesktopAgentIntentResolver";
import { DefaultDesktopAgentChannelSelector } from "../channel-selector/DefaultDesktopAgentChannelSelector";
import { NullIntentResolver } from "../intent-resolution/NullIIntentResolver";
import { NullChannelSelector } from "../channel-selector/NullChannelSelector";

/**
 * Given a message port, constructs a desktop agent to communicate via that.
 */
export async function createDesktopAgentAPI(cd: ConnectionDetails): Promise<DesktopAgent> {

    cd.messagePort.start()

    function string(o: string | boolean): string | null {
        if ((o == true) || (o == false)) {
            return null
        } else {
            return o
        }
    }

    const messaging = new MessagePortMessaging(cd)

    const useResolver = cd.handshake.payload.resolver && cd.options.intentResolver
    const useSelector = cd.handshake.payload.channelSelector && cd.options.channelSelector

    const intentResolver = useResolver ?
        new DefaultDesktopAgentIntentResolver(string(cd.handshake.payload.resolver)) :
        new NullIntentResolver()

    const channelSelector = useSelector ?
        new DefaultDesktopAgentChannelSelector(string(cd.handshake.payload.channelSelector))
        : new NullChannelSelector()

    const cs = new DefaultChannelSupport(messaging, channelSelector)
    const hs = new DefaultHandshakeSupport(messaging)
    const is = new DefaultIntentSupport(messaging, intentResolver)
    const as = new DefaultAppSupport(messaging)
    const da = new BasicDesktopAgent(hs, cs, is, as)
    await da.connect()
    return da
}



