import { GetAgentParams, AgentError } from '@kite9/fdc3-standard';
import { retrieveDesktopAgentDetails } from '../sessionStorage/DesktopAgentDetails';
import { Logger } from '../util/Logger';

import { BrowserTypes } from '@kite9/fdc3-schema';
const {
  isWebConnectionProtocol5ValidateAppIdentitySuccessResponse,
  isWebConnectionProtocol5ValidateAppIdentityFailedResponse,
} = BrowserTypes;
type WebConnectionProtocol4ValidateAppIdentity = BrowserTypes.WebConnectionProtocol4ValidateAppIdentity;
type WebConnectionProtocol5ValidateAppIdentitySuccessResponse =
  BrowserTypes.WebConnectionProtocol5ValidateAppIdentitySuccessResponse;
type WebConnectionProtocolMessage = BrowserTypes.WebConnectionProtocolMessage;

/** Timeout allowed for id validation to occur and for the DA to respond with details.
 * This is additional to the app's specified timeout for discovery - we have already
 * found an agent at that point we are just finishing setting up the connection. */
const ID_VALIDATION_TIMEOUT = 5000;

export class IdentityValidationHandler {
  constructor(mp: MessagePort, options: GetAgentParams, connectionAttemptUuid: string) {
    this.messagePort = mp;
    this.options = options;
    this.connectionAttemptUuid = connectionAttemptUuid;
    this.idValidationResponseListener = null;
  }

  /** Reference to the MessagePort received. Used to remove listeners when cancelling. */
  messagePort: MessagePort;

  /** Parameters passed to getAgent */
  options: GetAgentParams;

  /** UUID used to filter messages */
  connectionAttemptUuid: string;

  /** Event listener for ID validation response from Desktop Agents over the MessagePort.
   *  Used to remove them when no longer needed.
   * Initialized during the id validation step.
   */
  idValidationResponseListener: ((event: MessageEvent<WebConnectionProtocolMessage>) => void) | null;

  /**
   * Starts the connection process off by sending a hello message
   */
  sendIdValidationMessage() {
    const actualUrl = globalThis.window.location.href;
    const identityUrl = this.options.identityUrl ?? actualUrl;

    const requestMessage: WebConnectionProtocol4ValidateAppIdentity = {
      type: 'WCP4ValidateAppIdentity',
      meta: {
        connectionAttemptUuid: this.connectionAttemptUuid,
        timestamp: new Date(),
      },
      payload: {
        identityUrl,
        actualUrl,
      },
    };

    const persistedDetails = retrieveDesktopAgentDetails(identityUrl);

    if (persistedDetails) {
      requestMessage.payload.instanceId = persistedDetails.instanceId;
      requestMessage.payload.instanceUuid = persistedDetails.instanceUuid;
    }

    this.messagePort.postMessage(requestMessage);
  }

  /** Listen for WCP responses over the message port to identity validation messages. */
  listenForIDValidationResponses(): Promise<WebConnectionProtocol5ValidateAppIdentitySuccessResponse> {
    return new Promise<WebConnectionProtocol5ValidateAppIdentitySuccessResponse>((resolve, reject) => {
      // setup listener for message and retrieve JS URL from it
      this.idValidationResponseListener = (event: MessageEvent<WebConnectionProtocolMessage>) => {
        const data = event.data;

        if (data?.meta?.connectionAttemptUuid == this.connectionAttemptUuid) {
          if (isWebConnectionProtocol5ValidateAppIdentitySuccessResponse(data)) {
            //passed validation
            clearTimeout(timeout);
            if (this.idValidationResponseListener) {
              //remove the event listener as we've received a messagePort to use
              this.messagePort.removeEventListener('message', this.idValidationResponseListener);
            }
            Logger.debug(
              `IdentityValidationHandler: Validated app identity, appId: ${data.payload.appId}, instanceId: ${data.payload.instanceId}`
            );
            resolve(data);
          } else if (isWebConnectionProtocol5ValidateAppIdentityFailedResponse(data)) {
            //failed validation...
            clearTimeout(timeout);
            if (this.idValidationResponseListener) {
              //remove the event listener as we've received a messagePort to use
              this.messagePort.removeEventListener('message', this.idValidationResponseListener);
            }
            Logger.error(
              `IdentityValidationHandler: App identity validation failed: ${data.payload.message ?? 'No reason given'}`
            );
            reject(AgentError.AccessDenied);
          } else {
            Logger.debug(
              `IdentityValidationHandler: Ignoring message unexpected message in PostMessageLoader (because its not a WCP5 message).`,
              data
            );
          }
        } else {
          Logger.warn(
            `IdentityValidationHandler: Ignoring message with invalid connectionAttemptUuid. Expected ${this.connectionAttemptUuid}, received: ${data?.meta?.connectionAttemptUuid}`,
            data
          );
        }
      };

      //listening on a message port
      this.messagePort.addEventListener('message', this.idValidationResponseListener);

      //timeout for id validation only
      const timeout = setTimeout(() => {
        Logger.warn(`IdentityValidationHandler: Identity validation timed out`);

        if (this.idValidationResponseListener) {
          //remove the event listener as we won't proceed further
          this.messagePort.removeEventListener('message', this.idValidationResponseListener);
        }
        Logger.error(
          `The Desktop Agent didn't respond to ID validation within ${ID_VALIDATION_TIMEOUT / 1000} seconds`
        );
        reject(AgentError.ErrorOnConnect);
      }, ID_VALIDATION_TIMEOUT);
    });
  }

  cancel(): void {
    if (this.idValidationResponseListener) {
      this.messagePort.removeEventListener('message', this.idValidationResponseListener);
    }
    //TODO: cancel any timeouts and reject any returned promises
  }
}
