import {
  AppRequestMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';

/**
 * This is a unique, long, unguessable string that identifies a particular instance of an app.
 * All messages arriving at the desktop agent will have this UUID attached to them.
 * It is important that this is unguessable as it is a shared secret used to identify the app
 * when reconnecting after navigation or refresh.
 */
export type InstanceID = string;

export enum State {
  Pending /* App has started, but not completed FDC3 Handshake */,
  Connected /* App has completed FDC3 handshake */,
  NotResponding /* App has not responded to a heartbeat */,
  Terminated /* App has sent a termination message */,
}

/**
 * Feel free to extend this type with your own properties
 * if implementing your own FDC3ServerInstance.
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
