import { AppIdentifier, DesktopAgent, LogLevel } from '@finos/fdc3-standard';
import {
  DesktopAgentProxy,
  DefaultChannelSupport,
  DefaultAppSupport,
  DefaultIntentSupport,
  ChannelSupport,
  DefaultHeartbeatSupport,
} from '@finos/fdc3-agent-proxy';
import { ConnectionDetails, MessagePortMessaging } from './MessagePortMessaging.js';
import { DefaultDesktopAgentIntentResolver } from '../ui/DefaultDesktopAgentIntentResolver.js';
import { DefaultDesktopAgentChannelSelector } from '../ui/DefaultDesktopAgentChannelSelector.js';
import { NullIntentResolver } from '../ui/NullIntentResolver.js';
import { NullChannelSelector } from '../ui/NullChannelSelector.js';
import { ChannelSelector } from '@finos/fdc3-standard';
import { Logger } from '../util/Logger.js';

/**
 * Given a message port, constructs a desktop agent to communicate via that.
 */
export async function createDesktopAgentAPI(
  cd: ConnectionDetails,
  appIdentifier: AppIdentifier,
  logLevel: LogLevel | null
): Promise<DesktopAgent> {
  Logger.debug('message-port: Creating Desktop Agent...');

  //Message port should have already been started for use in identity validation

  function string(o: string | boolean): string | null {
    if (o == true || o == false) {
      return null;
    } else {
      return o;
    }
  }

  const messaging = new MessagePortMessaging(cd, appIdentifier);

  const useResolver = cd.handshake.payload.intentResolverUrl && cd.options.intentResolver;
  const useSelector = cd.handshake.payload.channelSelectorUrl && cd.options.channelSelector;

  const intentResolver = useResolver
    ? new DefaultDesktopAgentIntentResolver(string(cd.handshake.payload.intentResolverUrl))
    : new NullIntentResolver();

  const channelSelector = useSelector
    ? new DefaultDesktopAgentChannelSelector(string(cd.handshake.payload.channelSelectorUrl))
    : new NullChannelSelector();

  Logger.debug('message-port: Setting up support components...');

  const hs = new DefaultHeartbeatSupport(messaging);
  const cs = new DefaultChannelSupport(messaging, channelSelector, cd.messageExchangeTimeout);
  const is = new DefaultIntentSupport(messaging, intentResolver, cd.messageExchangeTimeout, cd.appLaunchTimeout);
  const as = new DefaultAppSupport(messaging, cd.messageExchangeTimeout, cd.appLaunchTimeout);
  const da = new DesktopAgentProxy(hs, cs, is, as, [hs, intentResolver, channelSelector], logLevel);

  Logger.debug('message-port: Connecting components ...');

  await da.connect();

  Logger.debug('message-port: Populating channel selector...');

  await populateChannelSelector(cs, channelSelector);

  Logger.debug('message-port: Setting up disconnect handling...');

  handleDisconnectOnPageHide(da, messaging);

  Logger.debug('message-port: Returning...');

  return da;
}

async function populateChannelSelector(cs: ChannelSupport, channelSelector: ChannelSelector): Promise<void> {
  const channel = await cs.getUserChannel();
  const userChannels = await cs.getUserChannels();
  channelSelector.updateChannel(channel?.id ?? null, userChannels);
}

function handleDisconnectOnPageHide(da: DesktopAgentProxy, messaging: MessagePortMessaging) {
  globalThis.window.addEventListener('pagehide', async event => {
    Logger.log(`Received pagehide event with persisted ${event.persisted}`);

    //If persisted == true then the page is stored and might come back if the user hits back
    //  In that case don't disconnect and let heartbeat handle that instead

    //TODO: implement disconnect on any hide and reconnect if the page is shown again
    //  Will have to happen inside the DesktopAgentProxy as the reference to the DA needs to remain the same
    //  and any listeners need to be re-registered automatically etc.
    if (!event.persisted) {
      //the page is being destroyed, disconnect from the DA

      //Notify the Desktop Agent implementation to disconnect
      da.disconnect();

      //disconnect the MessagePort - which should send WCP6Goodbye first
      messaging.disconnect();
    }
  });
}
