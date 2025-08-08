import { DesktopAgent } from '@finos/fdc3-standard';
import { AppRequestMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { ClientSideServerContext } from './scratch/ClientSideServerContext';
import { BroadcastHandler } from './scratch/BroadcastHandler';
import { io, Socket } from 'socket.io-client';
import { SERVER_MESSAGE, WEB_CLIENT_HELLO } from './MessageTypes';

export async function connectRemoteDesktopAgent(da: DesktopAgent): Promise<Socket> {
  // Create socket with session support
  const socket = await io('http://localhost:4003', {
    withCredentials: true, // Include cookies and session data
    autoConnect: true,
  });

  socket.on('connect', async () => {
    const cssc = new ClientSideServerContext(da, socket);
    const broadcastHandler = new BroadcastHandler(cssc);

    socket.on(SERVER_MESSAGE, async (event: any) => {
      console.log('Message received', event);
      broadcastHandler.accept(event as AppRequestMessage);
    });

    socket.on('disconnect', () => {
      console.log('Connection closed');
    });

    socket.emit(WEB_CLIENT_HELLO, (await da.getInfo()).appMetadata);
  });

  return socket;
}
