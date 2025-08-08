import { AppIdentifier } from '@finos/fdc3';
import {
  AppRequestMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';

export type IncomingMessage =
  | AppRequestMessage
  | WebConnectionProtocol4ValidateAppIdentity
  | WebConnectionProtocol6Goodbye;

/** Interface representing a full specified app identifier (instanceId is optional in the API type). */
export interface FullAppIdentifier {
  readonly appId: string;
  readonly instanceId: string;
}

export function isFullAppIdentifier(identifier: AppIdentifier | FullAppIdentifier): identifier is FullAppIdentifier {
  const typedIdentifier = identifier as FullAppIdentifier;
  return typedIdentifier.instanceId !== undefined && typedIdentifier.appId !== undefined;
}

export interface MessageHandler {
  /**
   * Handles an AgentRequestMessage from the messaging source.
   * This handles a single app's interaction with the FDC3 server environment.
   */
  accept(msg: AppRequestMessage): Promise<void>;

  /**
   * Shuts down this app's ability to interact with the FDC3 server environment.
   */
  shutdown(): void;
}
