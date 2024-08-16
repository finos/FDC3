import { AppIdentifier, DesktopAgent } from "@finos/fdc3";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport, DefaultHandshakeSupport } from "@kite9/da-proxy";
import { WebConnectionProtocol3HandshakePayload } from "@kite9/fdc3-common"
import { MessagePortMessaging } from "./MessagePortMessaging";
import { DefaultDesktopAgentIntentResolver } from "../intent-resolution/DefaultDesktopAgentIntentResolver";
import { DefaultDesktopAgentChannelSelector } from "../channel-selector/DefaultDesktopAgentChannelSelector";
import { NullIntentResolver } from "../intent-resolution/NullIIntentResolver";
import { NullChannelSelector } from "../channel-selector/NullChannelSelector";

/**
 * Given a message port, constructs a desktop agent to communicate via that.
 */
export async function createDesktopAgentAPI(mp: MessagePort,
    handshake: WebConnectionProtocol3HandshakePayload): Promise<DesktopAgent> {

    mp.start()

    function string(o: string | boolean): string | null {
        if ((o == true) || (o == false)) {
            return null
        } else {
            return o
        }
    }

    const appId: AppIdentifier = {
        appId: identity.appId,
        instanceId: identity.instanceId
    }

    const messaging = new MessagePortMessaging(mp, appId)

    const intentResolver = handshake.resolver ?
        new DefaultDesktopAgentIntentResolver(string(handshake.resolver)) :
        new NullIntentResolver()

    const channelSelector = handshake.channelSelector ?
        new DefaultDesktopAgentChannelSelector(string(handshake.channelSelector))
        : new NullChannelSelector()

    const version = "2.2"
    const cs = new DefaultChannelSupport(messaging, channelSelector)
    const hs = new DefaultHandshakeSupport(messaging, version)
    const is = new DefaultIntentSupport(messaging, intentResolver)
    const as = new DefaultAppSupport(messaging, appId, "WebFDC3")
    const da = new BasicDesktopAgent(hs, cs, is, as, version)
    await da.connect()
    return da
}



