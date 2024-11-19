import { DesktopAgentDetails, WebDesktopAgentType, GetAgentParams, AppIdentifier, DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX } from '@kite9/fdc3-standard';
import { RegisterableListener, AbstractMessaging } from '@kite9/fdc3-agent-proxy';
import {
  AppRequestMessage,
  WebConnectionProtocolMessage,
  AgentResponseMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol5ValidateAppIdentitySuccessResponse,
  isWebConnectionProtocolMessage
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { storeDesktopAgentDetails, retrieveAllDesktopAgentDetails, retrieveDesktopAgentDetails } from '../sessionStorage/DesktopAgentDetails';


/**
 * Version of Messaging which is able to store details in the SessionState (i.e. works on the web)
 */
export abstract class AbstractWebMessaging extends AbstractMessaging {
  private readonly options: GetAgentParams;
  private readonly connectionAttemptUuid: string;
  private readonly actualUrl: string;

  constructor(options: GetAgentParams, connectionAttemptUuid: string, actualUrl: string) {
    super();
    if (!options.timeoutMs) {
      options.timeoutMs = 10016;
    }
    this.options = options;
    this.connectionAttemptUuid = connectionAttemptUuid;
    this.actualUrl = actualUrl;
  }

  abstract post(message: object): Promise<void>;

  abstract register(l: RegisterableListener): void;
  abstract unregister(id: string): void;

  abstract createMeta(): AppRequestMessage['meta'];

  getTimeoutMs(): number {
    return this.options.timeoutMs!;
  }

  getSource(): AppIdentifier | null {
    return super.getSource();
  }

  private async exchangeValidationWithId<X>(message: any, connectionAttemptUuid: string): Promise<X> {
    const prom = super.waitFor(
      (m: WebConnectionProtocolMessage | AgentResponseMessage) => {
        if (isWebConnectionProtocolMessage(m)) {
            return m.meta.connectionAttemptUuid == connectionAttemptUuid;
        } else {
          return false;
        }
      }
    );
    this.post(message);
    const out: any = await prom;
    if (out?.payload?.message) {
      throw new Error(out.payload.message);
    } else {
      return out;
    }
  }

  /**
   * This handles the verify exchange with the da-server,
   */
  async connect(): Promise<void> {
    const validationResponse =
      await this.exchangeValidationWithId<WebConnectionProtocol5ValidateAppIdentitySuccessResponse>(
        this.createValidationMessage(),
        this.connectionAttemptUuid
      );

    super.setAppIdentifier({
      appId: validationResponse.payload.appId,
      instanceId: validationResponse.payload.instanceId,
    });

    super.setImplementationMetadata(validationResponse.payload.implementationMetadata);

    // //TODO: need to do something with the instanceUuid...

    // this.storeMyDesktopAgentDetails(validationResponse, /* need to set agent Type and agentUrl if any */)
  }

  async disconnect(): Promise<void> {
    super.setAppIdentifier(null);
    super.setImplementationMetadata(null);
  }

  // /**
  //  * Sends the validate message through the message port
  //  */
  // private createValidationMessage(): WebConnectionProtocol4ValidateAppIdentity {
  //   const requestMessage: WebConnectionProtocol4ValidateAppIdentity = {
  //       type: 'WCP4ValidateAppIdentity',
  //       meta: {
  //         connectionAttemptUuid: this.connectionAttemptUuid,
  //         timestamp: new Date(),
  //       },
  //       payload: {
  //         identityUrl: this.options.identityUrl ?? this.actualUrl,
  //         actualUrl: this.actualUrl
  //       }
  //   };
  //   const persistedDetails = this.retrieveMyDesktopAgentDetails();
    
  //   if (persistedDetails) {
  //       requestMessage.payload.instanceId = persistedDetails.instanceId;
  //       requestMessage.payload.instanceUuid = persistedDetails.instanceUuid;
  //   }

  //   return requestMessage;
  // }

  // /** Used to persist data on the connection, which can later be used to ensure
  //  *  reconnection to the same Desktop Agent and to request the same instanceId.
  //  */
  // storeMyDesktopAgentDetails(
  //   validationResponse: WebConnectionProtocol5ValidateAppIdentitySuccessResponse,
  //   agentType: WebDesktopAgentType,
  //   agentUrl?: string
  // ) {
  //   //create the details object to persist
  //   const details: DesktopAgentDetails = {
  //     agentType,
  //     identityUrl: this.options.identityUrl!,
  //     actualUrl: this.actualUrl!,
  //     agentUrl: agentUrl ?? undefined,
  //     appId: validationResponse.payload.appId,
  //     instanceUuid: validationResponse.payload.instanceUuid,
  //     instanceId: validationResponse.payload.instanceId,
  //   };
  
  //   storeDesktopAgentDetails(details);
  // }

  // /** Retrieves persisted data about previous connections for this specific app
  //  *  (identified by the identityUrl). Used to ensure reconnection to the same
  //  *  agent and to request the same instanceId.
  //  */
  // retrieveMyDesktopAgentDetails(): DesktopAgentDetails | null {
  //   return retrieveDesktopAgentDetails(this.options.identityUrl!);
  // }

}
