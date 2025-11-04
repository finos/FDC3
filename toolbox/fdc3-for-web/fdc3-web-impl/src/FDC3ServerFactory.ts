import { MessageHandler } from './handlers/MessageHandler';
import { FDC3ServerInstance } from './FDC3ServerInstance';
import { HeartbeatHandler } from './handlers/HeartbeatHandler';
import { BroadcastHandler } from './handlers/BroadcastHandler';
import { IntentHandler } from './handlers/IntentHandler';
import { OpenHandler } from './handlers/OpenHandler';
import { Directory } from './directory/DirectoryInterface';

export interface FDC3ServerFactory {
  /**
   * Returns a new FDC3ServerInstance, for when a new user starts using FDC3.
   * This instance will create a single "app world", where all apps within it
   * work together communicating via the FDC3 API.
   */
  createInstance(): Promise<FDC3ServerInstance>;
}

/**
 * Handles setting up the handlers with the right timeouts.
 * Subclass this and implement the createInstance method with your
 * implementation of FDC3ServerInstance.
 */
export abstract class AbstractFDC3ServerFactory {
  protected readonly handlers: MessageHandler[] = [];

  constructor(
    protected readonly directory: Directory,
    heartbeats: boolean,
    intentTimeoutMs: number = 20000,
    openHandlerTimeoutMs: number = 10000
  ) {
    this.handlers.push(new BroadcastHandler());
    this.handlers.push(new IntentHandler(intentTimeoutMs));
    this.handlers.push(new OpenHandler(openHandlerTimeoutMs));

    if (heartbeats) {
      this.handlers.push(
        new HeartbeatHandler(openHandlerTimeoutMs / 10, openHandlerTimeoutMs / 2, openHandlerTimeoutMs)
      );
    }
  }

  abstract createInstance(): Promise<FDC3ServerInstance>;
}
