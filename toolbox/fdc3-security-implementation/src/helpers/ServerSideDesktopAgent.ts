import {
  DefaultAppSupport,
  DefaultChannelSupport,
  DefaultHeartbeatSupport,
  DefaultIntentSupport,
  DesktopAgentProxy,
  Messaging,
} from '@finos/fdc3-agent-proxy';
import { DesktopAgent, LogLevel } from '@finos/fdc3-standard';
import { NullChannelSelector } from '@finos/fdc3-get-agent';
import { NullIntentResolver } from '@finos/fdc3-get-agent';
import { Server, Socket } from 'socket.io';
import { WebSocketMessaging } from './WebSocketMessaging';
import { WEB_CLIENT_HELLO } from './MessageTypes';
import { AppIdentifier } from '@finos/fdc3-context';
import { Server as HttpServer } from 'http';

/**
 * This class provides all the functionality of a DesktopAgent
 * on the server-side, so that clients can use it to do
 * secure computing in a trusted environment.
 *
 * It uses the existing Messaging / FDFC3 For Web Protocol
 * to communicate with the client-side DesktopAgent.
 */
export function createServerSideDesktopAgent(
  messaging: Messaging,
  logLevel: LogLevel | null,
  timeoutMs: number
): DesktopAgent {
  const hs = new DefaultHeartbeatSupport(messaging);
  const cs = new DefaultChannelSupport(messaging, new NullChannelSelector(), timeoutMs);
  const is = new DefaultIntentSupport(messaging, new NullIntentResolver(), timeoutMs, timeoutMs);
  const as = new DefaultAppSupport(messaging, timeoutMs, timeoutMs);
  const da = new DesktopAgentProxy(hs, cs, is, as, [], logLevel);

  return da;
}

export type NewConnectionCallback = (da: DesktopAgent, socket: Socket) => void;
export type DisconnectCallback = (da: DesktopAgent, socket: Socket) => void;

/**
 * Sets up a listener so that we can detect when a front-end wants to create a server-side DesktopAgent.
 * In the callback, you should instantiate any context/intent handlers you need.
 */
export function setupWebsocketServer(
  httpServer: HttpServer,
  callback: NewConnectionCallback,
  disconnectCallback: DisconnectCallback,
  timeoutMs: number = 10000
) {
  const io = new Server(httpServer);

  io.on('connection', socket => {
    var da: DesktopAgent | null = null;

    socket.on(WEB_CLIENT_HELLO, (appId: AppIdentifier) => {
      console.log('WebSocket client hello received for app:', appId);

      if (!da) {
        const messaging = new WebSocketMessaging(socket, appId);
        da = createServerSideDesktopAgent(messaging, null, timeoutMs);
        console.log('Created new desktop agent');
      }

      callback(da, socket);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket client disconnected');
      if (da) {
        disconnectCallback(da, socket);
        da = null;
      }
    });
  });
}
