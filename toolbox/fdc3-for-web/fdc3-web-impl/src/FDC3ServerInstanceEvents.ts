import { InstanceID } from './AppRegistration';

/**
 * These are events not coming from another FDC3 application, but from the
 * FDC3ServerInstance itself.
 */
export interface FDC3ServerInstanceEvent {
  type: string;
}

/**
 * Used when the FDC3ServerInstance wants to notify the handler that the private channel has been disconnected.
 */
export class PrivateChannelDisconnectServerInstanceEvent implements FDC3ServerInstanceEvent {
  public type: string;

  constructor(
    public instanceId: InstanceID,
    public channelId: string
  ) {
    this.type = 'privateChannelDisconnect';
  }
}

/**
 * Used when the FDC3ServerInstance wants to notify the handler that the current channel has changed.
 */
export class ChannelChangedServerInstanceEvent implements FDC3ServerInstanceEvent {
  public type: string;

  constructor(
    public instanceId: InstanceID,
    public channelId: string
  ) {
    this.type = 'channelChanged';
  }
}
