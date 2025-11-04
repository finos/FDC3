import { FDC3ServerInstance } from './FDC3ServerInstance';
import { ContextElement } from '@finos/fdc3-context';
import { AppIdentifier, OpenError } from '@finos/fdc3-standard';
import { BrowserTypes } from '@finos/fdc3-schema';
import { State } from './AppRegistration';

export enum AppState {
  Opening,
  DeliveringContext,
  Done,
}

type OpenRequest = BrowserTypes.OpenRequest;

export class PendingApp {
  private readonly sc: FDC3ServerInstance;
  private readonly msg: OpenRequest;
  readonly context: ContextElement | undefined;
  readonly source: AppIdentifier & { instanceId: string };
  state: AppState = AppState.Opening;
  private openedApp: AppIdentifier | undefined = undefined;

  constructor(
    sc: FDC3ServerInstance,
    msg: OpenRequest,
    context: ContextElement | undefined,
    source: AppIdentifier & { instanceId: string },
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
    this.sc.setAppState(this.openedApp!.instanceId!, State.Connected);
    this.sc.post(
      {
        type: 'openResponse',
        meta: {
          requestUuid: this.msg.meta.requestUuid,
          responseUuid: this.sc.createUUID(),
          timestamp: new Date(),
        },
        payload: {
          appIdentifier: {
            appId: this.openedApp!.appId,
            instanceId: this.openedApp!.instanceId,
          },
        },
      },
      this.source.instanceId
    );
  }

  private onError() {
    this.sc.post(
      {
        type: 'openResponse',
        meta: {
          requestUuid: this.msg.meta.requestUuid,
          responseUuid: this.sc.createUUID(),
          timestamp: new Date(),
        },
        payload: {
          error: OpenError.AppTimeout,
        },
      },
      this.source.instanceId
    );
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
