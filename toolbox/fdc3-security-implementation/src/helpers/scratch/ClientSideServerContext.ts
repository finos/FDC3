import { AbstractDesktopAgentDelegate } from '@finos/fdc3-security/src/delegates/AbstractDesktopAgentDelegate';
import { ContextListenerRegistration, PrivateChannelEventListener, ServerContext } from './ServerContext';
import { Channel, DesktopAgent, IntentResult } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';
import { Socket } from 'socket.io-client';
import { WEB_MESSAGE } from '../MessageTypes';

export class ClientSideServerContext extends AbstractDesktopAgentDelegate implements ServerContext {
  private socket: Socket;

  constructor(desktopAgent: DesktopAgent, socket: Socket) {
    super(desktopAgent);
    this.socket = socket;
  }

  wrapChannel(channel: Channel): Channel {
    return channel;
  }

  wrapIntentResult(result: IntentResult): IntentResult {
    return result;
  }

  getChannelById(id: string | null): Channel | null {
    throw new Error('Method not implemented.');
  }

  updateChannelContext(channelId: string, context: Context): void {
    throw new Error('Method not implemented.');
  }

  getPrivateChannelEventListeners(): PrivateChannelEventListener[] {
    throw new Error('Method not implemented.');
  }

  registerPrivateChannelEventListener(listener: PrivateChannelEventListener): void {
    throw new Error('Method not implemented.');
  }

  unregisterPrivateChannelEventListener(id: string): void {
    throw new Error('Method not implemented.');
  }

  getContextListeners(): ContextListenerRegistration[] {
    throw new Error('Method not implemented.');
  }

  registerContextListener(listener: ContextListenerRegistration): void {
    throw new Error('Method not implemented.');
  }

  unregisterContextListener(id: string): void {
    throw new Error('Method not implemented.');
  }

  post(msg: any, instanceId?: string): void {
    if (!instanceId) {
      this.socket.emit(WEB_MESSAGE, msg);
    }
  }
}
