import { MessageHandler } from '../BasicFDC3Server';
import { AppRegistration, InstanceID, ServerContext, State } from '../ServerContext';
import { Directory, DirectoryApp } from '../directory/DirectoryInterface';
import { ContextElement } from '@kite9/fdc3-context';
import { OpenError, ResolveError, AppIdentifier, AppMetadata } from '@kite9/fdc3-standard';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { errorResponse, successResponse } from './support';

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
  private readonly sc: ServerContext<AppRegistration>;
  private readonly msg: OpenRequest;
  readonly context: ContextElement | undefined;
  readonly source: AppMetadata;
  state: AppState = AppState.Opening;
  private openedApp: AppIdentifier | undefined = undefined;

  constructor(
    sc: ServerContext<AppRegistration>,
    msg: OpenRequest,
    context: ContextElement | undefined,
    source: AppIdentifier,
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
    this.sc.setAppState(this.openedApp?.instanceId!!, State.Connected);
    successResponse(
      this.sc,
      this.msg,
      this.source,
      {
        appIdentifier: {
          appId: this.openedApp!!.appId,
          instanceId: this.openedApp!!.instanceId,
        },
      },
      'openResponse'
    );
  }

  private onError() {
    errorResponse(this.sc, this.msg, this.source, OpenError.AppTimeout, 'openResponse');
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

export class OpenHandler implements MessageHandler {
  private readonly directory: Directory;
  readonly pending: Map<InstanceID, PendingApp> = new Map();
  readonly timeoutMs: number;

  constructor(d: Directory, timeoutMs: number) {
    this.directory = d;
    this.timeoutMs = timeoutMs;
  }

  shutdown(): void {}

  async accept(msg: any, sc: ServerContext<AppRegistration>, uuid: InstanceID): Promise<void> {
    switch (msg.type as string) {
      case 'addContextListenerRequest':
        return this.handleAddContextListener(msg as AddContextListenerRequest, sc, uuid);
      case 'WCP4ValidateAppIdentity':
        return this.handleValidate(msg as WebConnectionProtocol4ValidateAppIdentity, sc, uuid);
    }

    const from = sc.getInstanceDetails(uuid);
    try {
      if (from) {
        switch (msg.type as string) {
          case 'openRequest':
            return this.open(msg as OpenRequest, sc, from);
          case 'findInstancesRequest':
            return this.findInstances(msg as FindInstancesRequest, sc, from);
          case 'getAppMetadataRequest':
            return this.getAppMetadata(msg as GetAppMetadataRequest, sc, from);
        }
      }
    } catch (e: any) {
      const responseType = msg.type.replace(new RegExp('Request$'), 'Response');
      errorResponse(sc, msg, from!!, e.message ?? e, responseType);
    }
  }

  /**
   * This deals with sending pending context to listeners of newly-opened apps.
   */
  handleAddContextListener(
    arg0: AddContextListenerRequest,
    sc: ServerContext<AppRegistration>,
    from: InstanceID
  ): void {
    const pendingOpen = this.pending.get(from);

    if (pendingOpen) {
      const channelId = arg0.payload.channelId!!;
      const contextType = arg0.payload.contextType;

      if (pendingOpen.context && pendingOpen.state == AppState.DeliveringContext) {
        if (contextType == pendingOpen.context.type || contextType == undefined) {
          // ok, we can deliver to this listener

          const message: BroadcastEvent = {
            meta: {
              eventUuid: sc.createUUID(),
              timestamp: new Date(),
            },
            type: 'broadcastEvent',
            payload: {
              channelId,
              context: pendingOpen.context,
              originatingApp: {
                appId: pendingOpen.source.appId,
                instanceId: pendingOpen.source.instanceId,
              },
            },
          };

          pendingOpen.setDone();
          this.pending.delete(from);
          sc.post(message, arg0.meta.source?.instanceId!!);
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

  getAppMetadata(arg0: GetAppMetadataRequest, sc: ServerContext<AppRegistration>, from: AppIdentifier): void {
    const appID = arg0.payload.app;
    const details = this.directory.retrieveAppsById(appID.appId);
    if (details.length > 0) {
      successResponse(
        sc,
        arg0,
        from,
        {
          appMetadata: this.filterPublicDetails(details[0], appID),
        },
        'getAppMetadataResponse'
      );
    } else {
      errorResponse(sc, arg0, from, ResolveError.TargetAppUnavailable, 'getAppMetadataResponse');
    }
  }

  async findInstances(
    arg0: FindInstancesRequest,
    sc: ServerContext<AppRegistration>,
    from: AppIdentifier
  ): Promise<void> {
    const appId = arg0.payload.app.appId;
    const openApps = await sc.getConnectedApps();
    const matching = openApps
      .filter(a => a.appId == appId)
      .map(a => {
        return {
          appId: a.appId,
          instanceId: a.instanceId,
        };
      });
    successResponse(
      sc,
      arg0,
      from,
      {
        appIdentifiers: matching,
      },
      'findInstancesResponse'
    );
  }

  async open(arg0: OpenRequest, sc: ServerContext<AppRegistration>, from: AppIdentifier): Promise<void> {
    const source = arg0.payload.app;
    const context = arg0.payload.context;

    try {
      const uuid = await sc.open(source.appId);
      this.pending.set(uuid, new PendingApp(sc, arg0, context, from, this.timeoutMs));
    } catch (e: any) {
      errorResponse(sc, arg0, from, e.message, 'openResponse');
    }
  }

  async handleValidate(
    arg0: WebConnectionProtocol4ValidateAppIdentity,
    sc: ServerContext<AppRegistration>,
    from: InstanceID
  ): Promise<void> {
    const _this = this;

    const responseMeta = {
      connectionAttemptUuid: arg0.meta.connectionAttemptUuid,
      timestamp: new Date(),
    };

    function returnError() {
      const message: WebConnectionProtocol5ValidateAppIdentityFailedResponse = {
        meta: responseMeta,
        type: 'WCP5ValidateAppIdentityFailedResponse',
        payload: {
          message: 'App Instance not found',
        },
      };
      sc.post(message, from);
    }

    function returnSuccess(appIdentity: AppIdentifier) {
      if (!appIdentity.instanceId) {
        throw new Error("App does not include an instanceId, can't ");
      }
      const aopMetadata = _this.filterPublicDetails(
        _this.directory.retrieveAppsById(appIdentity.appId)[0],
        appIdentity
      );
      const message: WebConnectionProtocol5ValidateAppIdentitySuccessResponse = {
        meta: responseMeta,
        type: 'WCP5ValidateAppIdentityResponse',
        payload: {
          appId: appIdentity.appId,
          instanceId: appIdentity.instanceId,
          instanceUuid: from,
          implementationMetadata: {
            provider: sc.provider(),
            providerVersion: sc.providerVersion(),
            fdc3Version: sc.fdc3Version(),
            optionalFeatures: {
              DesktopAgentBridging: false,
              OriginatingAppMetadata: true,
              UserChannelMembershipAPIs: true,
            },
            appMetadata: aopMetadata,
          },
        },
      };
      sc.post(message, appIdentity.instanceId!!);
    }

    if (arg0.payload.instanceUuid) {
      // existing app reconnecting
      const appIdentity = sc.getInstanceDetails(arg0.payload.instanceUuid);

      if (appIdentity) {
        // in this case, the app is reconnecting, so let's just re-assign the
        // identity
        sc.setInstanceDetails(from, appIdentity);
        sc.setAppState(from, State.Connected);
        return returnSuccess(appIdentity);
      }
    }

    // we need to assign an identity to this app
    const appIdentity = sc.getInstanceDetails(from);
    if (appIdentity) {
      sc.setAppState(appIdentity.instanceId, State.Connected);
      returnSuccess(appIdentity);

      // make sure if the opener is listening for this app to open gets informed
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
