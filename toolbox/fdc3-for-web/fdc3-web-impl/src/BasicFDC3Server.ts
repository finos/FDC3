import { FDC3Server } from './FDC3Server.js';
import { AppRegistration, InstanceID, ServerContext, State } from './ServerContext.js';
import { BroadcastHandler, ChannelState } from './handlers/BroadcastHandler.js';
import { IntentHandler } from './handlers/IntentHandler.js';
import { Directory } from './directory/DirectoryInterface.js';
import { OpenHandler } from './handlers/OpenHandler.js';
import { HeartbeatHandler } from './handlers/HeartbeatHandler.js';
import {
  AppRequestMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export interface MessageHandler {
  /**
   * Handles an AgentRequestMessage from the messaging source. This function
   * is called by BasicFDC3Server on every message received and should only
   * process those it supports.
   */
  accept(
    msg: AppRequestMessage | WebConnectionProtocol4ValidateAppIdentity | WebConnectionProtocol6Goodbye,
    sc: ServerContext<AppRegistration>,
    from: InstanceID
  ): Promise<void>;

  /**
   * Clean-up any state relating to a instance that has disconnected.
   */
  cleanup(instanceId: InstanceID, sc: ServerContext<AppRegistration>): void;

  shutdown(): void;
}

/**
 * This defers all functionality to either MessageHandler's or the ServerContext objects.
 */
export class BasicFDC3Server implements FDC3Server {
  readonly handlers: MessageHandler[];
  private sc: ServerContext<AppRegistration>;

  constructor(handlers: MessageHandler[], sc: ServerContext<AppRegistration>) {
    this.handlers = handlers;
    this.sc = sc;
  }

  cleanup(instanceId: InstanceID): void {
    this.handlers.forEach(handler => handler.cleanup(instanceId, this.sc));
    this.sc.setAppState(instanceId, State.Terminated);
  }

  async receive(
    message: AppRequestMessage | WebConnectionProtocol4ValidateAppIdentity | WebConnectionProtocol6Goodbye,
    from: InstanceID
  ): Promise<void> {
    const promises = this.handlers.map(h => h.accept(message, this.sc, from));
    await Promise.allSettled(promises);
  }

  shutdown(): void {
    this.handlers.forEach(h => h.shutdown());
  }
}

export class DefaultFDC3Server extends BasicFDC3Server {
  constructor(
    sc: ServerContext<AppRegistration>,
    directory: Directory,
    userChannels: ChannelState[],
    heartbeats: boolean,
    intentTimeoutMs: number = 20000,
    openHandlerTimeoutMs: number = 10000
  ) {
    const handlers: MessageHandler[] = [
      new BroadcastHandler(userChannels),
      new IntentHandler(directory, intentTimeoutMs),
      new OpenHandler(directory, openHandlerTimeoutMs),
    ];

    if (heartbeats) {
      handlers.push(new HeartbeatHandler(openHandlerTimeoutMs / 10, openHandlerTimeoutMs / 2, openHandlerTimeoutMs));
    }

    super(handlers, sc);
  }
}
