import { AbstractDesktopAgentDelegate } from '@finos/fdc3-security/src/delegates/AbstractDesktopAgentDelegate';
import { ContextListenerRegistration, PrivateChannelEventListener, ServerContext } from './ServerContext';
import { Channel, DesktopAgent, IntentResult } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';
import { Socket } from 'socket.io-client';
import { WEB_MESSAGE } from '../MessageTypes';

/**
 * Essentially implements a server context which acts as a go-between for the
 * DesktopAgent and whatever is sending it messages.
 */

export class ClientSideServerContext implements ServerContext {
  private socket: Socket;
  private da: DesktopAgent;
  private contextListeners: ContextListenerRegistration[] = [];

  constructor(socket: Socket) {
    this.socket = socket;
  }

  async getChannelById(id: string | null): Promise<Channel | null> {
    if (id != null) {
      return this.da.getOrCreateChannel(id);
    } else {
      return null;
    }
  }

  async updateChannelContext(channelId: string, context: Context): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getPrivateChannelEventListeners(): Promise<PrivateChannelEventListener[]> {
    throw new Error('Method not implemented.');
  }

  async registerPrivateChannelEventListener(listener: PrivateChannelEventListener): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async unregisterPrivateChannelEventListener(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getContextListeners(): Promise<ContextListenerRegistration[]> {
    throw new Error('Method not implemented.');
  }

  async registerContextListener(listener: ContextListenerRegistration): Promise<void> {
    this.contextListeners.push(listener);
    this.addContextListener(listener.contextType, () => {
      this.socket.emit(WEB_MESSAGE, {
        type: CONTEXT_EVENT,
        contextType: listener.contextType,
        context: listener.context,
      });
    });
  }

  async unregisterContextListener(id: string): Promise<void> {
    this.contextListeners = this.contextListeners.filter(l => l.listenerUuid !== id);
  }

  async post(msg: any, instanceId?: string): Promise<void> {
    if (!instanceId) {
      this.socket.emit(WEB_MESSAGE, msg);
    }
  }
}
