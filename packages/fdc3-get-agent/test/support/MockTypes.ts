import {
  AppRequestMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';

/**
 * This is a unique, long, unguessable string that identifies a particular instance of an app.
 * All messages arriving at the desktop agent will have this UUID attached to them.
 */
export type InstanceID = string;

export enum State {
  Pending /* App has started, but not completed FDC3 Handshake */,
  Connected /* App has completed FDC3 handshake */,
  NotResponding /* App has not responded to a heartbeat */,
  Terminated /* App has sent a termination message */,
}

/**
 * App registration info for tracking connected apps
 */
export type AppRegistration = {
  state: State;
  appId: string;
  instanceId: InstanceID;
};

export type ReceivableMessage =
  | AppRequestMessage
  | WebConnectionProtocol4ValidateAppIdentity
  | WebConnectionProtocol6Goodbye;

/**
 * MessageHandler interface for processing messages
 */
export interface MessageHandler {
  accept(msg: ReceivableMessage, server: unknown, from: InstanceID): void;
  handleEvent?(event: FDC3ServerInstanceEvent, server: unknown): void;
}

/**
 * Server instance events
 */
export interface FDC3ServerInstanceEvent {
  type: string;
}

export class ShutdownServerInstanceEvent implements FDC3ServerInstanceEvent {
  type = 'shutdown';
}
