import { HeartbeatListener } from '../listeners/HeartbeatListener.js';
import { Messaging } from '../Messaging.js';
import { HeartbeatSupport } from './HeartbeatSupport.js';

/**
 * Handles disconnection and heartbeats for the proxy.
 */
export class DefaultHeartbeatSupport implements HeartbeatSupport {
  readonly messaging: Messaging;
  private heartbeatListener: HeartbeatListener | null = null;

  constructor(messaging: Messaging) {
    this.messaging = messaging;
  }

  async connect(): Promise<void> {
    this.heartbeatListener = new HeartbeatListener(this.messaging);
    this.heartbeatListener.register();
  }

  async disconnect(): Promise<void> {
    await this.heartbeatListener?.unsubscribe();
    return this.messaging.disconnect();
  }
}
