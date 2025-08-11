// TODO: Fix import paths - these modules don't exist in this location
// import { MessageHandler } from '../BasicFDC3Server';
// import { AppRegistration, InstanceID, State } from '../ServerContext';
// import { Directory, DirectoryApp } from '../directory/DirectoryInterface';
import { ContextElement } from '@finos/fdc3-context';
import { OpenError, ResolveError, AppIdentifier, AppMetadata, ImplementationMetadata } from '@finos/fdc3-standard';
import { BrowserTypes } from '@finos/fdc3-schema';
// import { FullAppIdentifier } from './support';
import {
  AgentResponseMessage,
  AppRequestMessage,
  GetInfoRequest,
  isAddContextListenerRequest,
  isFindInstancesRequest,
  isGetAppMetadataRequest,
  isGetInfoRequest,
  isOpenRequest,
  isWebConnectionProtocol4ValidateAppIdentity,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { AbstractHandler } from './AbstractHandler';
import { ServerContext } from './ServerContext';

// TODO: Define these types locally until proper imports are available
type FullAppIdentifier = {
  appId: string;
  instanceId: string;
};

type Directory = any;
type DirectoryApp = any;
type InstanceID = string;
type State = any;

type BroadcastEvent = BrowserTypes.BroadcastEvent;
type AddContextListenerRequest = BrowserTypes.AddContextListenerRequest;
type FindInstancesRequest = BrowserTypes.FindInstancesRequest;
type GetAppMetadataRequest = BrowserTypes.GetAppMetadataRequest;
type OpenRequest = BrowserTypes.OpenRequest;
type WebConnectionProtocol4ValidateAppIdentity = BrowserTypes.WebConnectionProtocol4ValidateAppIdentity;
type WebConnectionProtocol5ValidateAppIdentityFailedResponse =
  BrowserTypes.WebConnectionProtocol5ValidateAppIdentityFailedResponse;
type WebConnectionProtocol5ValidateAppIdentitySuccessResponse =
  BrowserTypes.WebConnectionProtocol5ValidateAppIdentitySuccessResponse;

enum AppState {
  Opening,
  DeliveringContext,
  Done,
}

class PendingApp {
  private readonly sc: ServerContext;
  private readonly msg: OpenRequest;
  readonly context: ContextElement | undefined;
  readonly source: FullAppIdentifier;
  state: AppState = AppState.Opening;
  private openedApp: AppIdentifier | undefined = undefined;

  constructor(
    sc: ServerContext,
    msg: OpenRequest,
    context: ContextElement | undefined,
    source: FullAppIdentifier,
    timeoutMs: number
  ) {
    this.context = context;
    this.source = source;
    this.sc = sc;
    this.msg = msg;

    setTimeout(() => {
      if (this.state != AppState.Done) {
        this.onError();
      }
    }, timeoutMs);
  }

  private onSuccess() {
    // TODO: Implement setAppState - this was previously sc.setAppState(this.openedApp!.instanceId!, State.Connected)
    // but the new ServerContext interface doesn't have this method
    // this.sc.setAppState(this.openedApp!.instanceId!, State.Connected);
    // TODO: Implement successResponse - this was previously successResponse(...)
    // but the new pattern uses this.successResponse(...)
  }

  private onError() {
    // TODO: Implement errorResponse - this was previously errorResponse(...)
    // but the new pattern uses this.errorResponse(...)
  }

  setOpened(openedApp: AppIdentifier) {
    this.openedApp = openedApp;
    if (this.context) {
      this.state = AppState.DeliveringContext;
    } else {
      this.setDone();
    }
  }

  setDone() {
    this.state = AppState.Done;
    this.onSuccess();
  }
}

export class OpenHandler extends AbstractHandler {
  private readonly directory: Directory;
  readonly pending: Map<InstanceID, PendingApp> = new Map();
  readonly timeoutMs: number;

  constructor(d: Directory, timeoutMs: number, sc: ServerContext) {
    super(sc);
    this.directory = d;
    this.timeoutMs = timeoutMs;
  }

  cleanup(/*instanceId: InstanceID, sc: ServerContext<AppRegistration>*/): void {
    //don't cleanup pending if the opening app closes as we should still deliver context
  }

  shutdown(): void {}

  async accept(msg: AppRequestMessage | WebConnectionProtocol4ValidateAppIdentity): Promise<void> {
    if (isWebConnectionProtocol4ValidateAppIdentity(msg)) {
      return this.handleValidate(msg as WebConnectionProtocol4ValidateAppIdentity);
    } else if (isAddContextListenerRequest(msg)) {
      //handle context listener adds for pending applications (i.e. opened but awaiting context listener addition to deliver context)
      //  additional handling is performed in BroadcastHandler
      return this.handleAddContextListener(msg as AddContextListenerRequest);
    } else {
      // TODO: Need to get from context - this was previously sc.getInstanceDetails(uuid)
      const from = 'TODO: Get from context'; // TODO: Need to get from context
      if (from) {
        try {
          if (isOpenRequest(msg)) {
            return this.open(msg);
          } else if (isFindInstancesRequest(msg)) {
            return this.findInstances(msg);
          } else if (isGetAppMetadataRequest(msg)) {
            return this.getAppMetadata(msg);
          } else if (isGetInfoRequest(msg)) {
            return this.getInfo(msg);
          }
        } catch (e) {
          const responseType = msg.type.replace(new RegExp('Request$'), 'Response') as AgentResponseMessage['type'];
          this.errorResponse(msg, (e as Error).message ?? e, responseType);
        }
      } else {
        console.warn('Received message from unknown source, ignoring', msg);
      }
    }
  }

  /**
   * This deals with sending pending context to listeners of newly-opened apps.
   */
  handleAddContextListener(arg0: AddContextListenerRequest): void {
    // TODO: Need to get from context - this was previously from parameter
    const from = 'TODO: Get from context'; // TODO: Need to get from context
    const pendingOpen = this.pending.get(from);
    if (pendingOpen) {
      const contextType = arg0.payload.contextType;
      if (pendingOpen.context && pendingOpen.state == AppState.DeliveringContext) {
        if (contextType == pendingOpen.context.type || contextType == undefined) {
          // ok, we can deliver to this listener
          const message: BroadcastEvent = {
            meta: {
              eventUuid: this.createUUID(),
              timestamp: new Date(),
            },
            type: 'broadcastEvent',
            payload: {
              channelId: null,
              context: pendingOpen.context,
              originatingApp: {
                appId: pendingOpen.source.appId,
                instanceId: pendingOpen.source.instanceId,
              },
            },
          };

          pendingOpen.setDone();
          this.pending.delete(from);
          this.da.post(message, from);
        }
      }
    }
  }

  filterPublicDetails(appD: DirectoryApp, appID: AppIdentifier): AppMetadata {
    return {
      appId: appD.appId,
      name: appD.name,
      version: appD.version,
      title: appD.title,
      tooltip: appD.tooltip,
      description: appD.description,
      icons: appD.icons,
      screenshots: appD.screenshots,
      instanceId: appID.instanceId,
    };
  }

  getAppMetadata(arg0: GetAppMetadataRequest): void {
    const appID = arg0.payload.app;
    const details = this.directory.retrieveAppsById(appID.appId);
    if (details.length > 0) {
      // TODO: Implement successResponse - this was previously successResponse(...)
      // but the new pattern uses this.successResponse(...)
    } else {
      // TODO: Implement errorResponse - this was previously errorResponse(...)
      // but the new pattern uses this.errorResponse(...)
    }
  }

  async findInstances(arg0: FindInstancesRequest): Promise<void> {
    const appId = arg0.payload.app.appId;
    // TODO: Implement getConnectedApps - this was previously sc.getConnectedApps()
    // but the new ServerContext interface doesn't have this method
    const openApps: any[] = []; // Placeholder

    const matching = openApps
      .filter(a => a.appId == appId)
      .map(a => {
        return {
          appId: a.appId,
          instanceId: a.instanceId,
        };
      });
    // TODO: Implement successResponse - this was previously successResponse(...)
    // but the new pattern uses this.successResponse(...)
  }

  async open(arg0: OpenRequest): Promise<void> {
    const toOpen = arg0.payload.app;
    const context = arg0.payload.context;

    try {
      // TODO: Implement app opening - this was previously sc.open(toOpen.appId)
      // but the new ServerContext interface doesn't have this method
      const uuid = 'TODO: Implement app opening';
      this.pending.set(uuid, new PendingApp(this.da, arg0, context, 'TODO: Get from context', this.timeoutMs));
    } catch (e) {
      // TODO: Implement errorResponse - this was previously errorResponse(...)
      // but the new pattern uses this.errorResponse(...)
    }
  }

  async getInfo(arg0: GetInfoRequest): Promise<void> {
    const implMetadata: ImplementationMetadata = this.getImplementationMetadata({
      appId: 'TODO: Get appId from context', // TODO: Need to get appId from context
      instanceId: 'TODO: Get instanceId from context', // TODO: Need to get instanceId from context
    });
    // TODO: Implement successResponse - this was previously successResponse(...)
    // but the new pattern uses this.successResponse(...)
  }

  getImplementationMetadata(appIdentity: AppIdentifier) {
    const appMetadata = this.filterPublicDetails(this.directory.retrieveAppsById(appIdentity.appId)[0], appIdentity);
    return {
      provider: this.da.provider(),
      providerVersion: this.da.providerVersion(),
      fdc3Version: this.da.fdc3Version(),
      optionalFeatures: {
        DesktopAgentBridging: false,
        OriginatingAppMetadata: true,
        UserChannelMembershipAPIs: true,
      },
      appMetadata: appMetadata,
    };
  }

  async handleValidate(arg0: WebConnectionProtocol4ValidateAppIdentity): Promise<void> {
    const responseMeta = {
      connectionAttemptUuid: arg0.meta.connectionAttemptUuid,
      timestamp: new Date(),
    };

    const returnError = () => {
      const msg: WebConnectionProtocol5ValidateAppIdentityFailedResponse = {
        meta: responseMeta,
        type: 'WCP5ValidateAppIdentityFailedResponse',
        payload: {
          message: 'App Instance not found',
        },
      };
      // TODO: Need to get from context - this was previously from parameter
      const from = 'TODO: Get from context'; // TODO: Need to get from context
      this.da.post(msg, from);
    };

    const returnSuccess = (appId: string, instanceId: string) => {
      const implMetadata: ImplementationMetadata = this.getImplementationMetadata({ appId, instanceId });
      const msg: WebConnectionProtocol5ValidateAppIdentitySuccessResponse = {
        meta: responseMeta,
        type: 'WCP5ValidateAppIdentityResponse',
        payload: {
          appId: appId,
          instanceId: instanceId,
          instanceUuid: 'TODO: Get from context', // TODO: Need to get from context
          implementationMetadata: implMetadata,
        },
      };
      this.da.post(msg, instanceId);
    };

    if (arg0.payload.instanceUuid) {
      // existing app reconnecting
      console.log('App attempting to reconnect:', arg0.payload.instanceUuid);
      // TODO: Implement getInstanceDetails - this was previously sc.getInstanceDetails(arg0.payload.instanceUuid)
      // but the new ServerContext interface doesn't have this method
      const appIdentity = null; // Placeholder

      if (appIdentity) {
        // in this case, the app is reconnecting, so let's just re-assign the identity
        console.log(
          `Reassigned existing identity, appId: `,
          appIdentity.appId,
          ', instanceId',
          arg0.payload.instanceUuid
        );
        // TODO: Implement setInstanceDetails and setAppState - these were previously on ServerContext<AppRegistration>
        // but the new ServerContext interface doesn't have these methods
        return returnSuccess(appIdentity.appId, appIdentity.instanceId);
      } else {
        //we didn't find the identity, assign a new one
        console.log('Existing identity not found for, assigning a new one: ', arg0.payload.instanceUuid);
      }
    }

    // we need to assign an identity to this app - this should have been generated when it was launched
    // TODO: Implement getInstanceDetails - this was previously sc.getInstanceDetails(from)
    // but the new ServerContext interface doesn't have this method
    const appIdentity = null; // Placeholder
    if (appIdentity) {
      // TODO: Implement setAppState - this was previously sc.setAppState(appIdentity.instanceId, State.Connected)
      // but the new ServerContext interface doesn't have this method
      returnSuccess(appIdentity.appId, appIdentity.instanceId);

      // make sure, if the opener is listening for this app to open, then it gets informed
      // TODO: Need to get from context - this was previously from parameter
      const from = 'TODO: Get from context'; // TODO: Need to get from context
      const pendingOpen = this.pending.get(from);
      if (pendingOpen) {
        if (pendingOpen.state == AppState.Opening) {
          pendingOpen.setOpened(appIdentity);
        }
      }
    } else {
      returnError();
    }
  }
}
