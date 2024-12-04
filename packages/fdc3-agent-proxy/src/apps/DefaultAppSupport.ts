import { AppIdentifier, AppMetadata, OpenError } from '@kite9/fdc3-standard';
import { Context } from '@kite9/fdc3-context';
import { AppSupport } from './AppSupport';
import { Messaging } from '../Messaging';
import { BrowserTypes } from '@kite9/fdc3-schema';

type FindInstancesRequest = BrowserTypes.FindInstancesRequest;
type GetAppMetadataResponse = BrowserTypes.GetAppMetadataResponse;
type FindInstancesResponse = BrowserTypes.FindInstancesResponse;
type GetAppMetadataRequest = BrowserTypes.GetAppMetadataRequest;
type OpenRequest = BrowserTypes.OpenRequest;

export class DefaultAppSupport implements AppSupport {
  readonly messaging: Messaging;

  constructor(messaging: Messaging) {
    this.messaging = messaging;
  }

  findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
    const request: FindInstancesRequest = {
      type: 'findInstancesRequest',
      payload: {
        app,
      },
      meta: this.messaging.createMeta() as any,
    };

    return this.messaging.exchange<FindInstancesResponse>(request, 'findInstancesResponse').then(d => {
      return d.payload.appIdentifiers!!;
    });
  }

  getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    const request: GetAppMetadataRequest = {
      type: 'getAppMetadataRequest',
      payload: {
        app: app as AppIdentifier,
      },
      meta: this.messaging.createMeta() as any,
    };

    return this.messaging.exchange<GetAppMetadataResponse>(request, 'getAppMetadataResponse').then(d => {
      return d.payload.appMetadata!!;
    });
  }

  async open(app: AppIdentifier, context?: Context | undefined): Promise<AppIdentifier> {
    const request = {
      type: 'openRequest',
      payload: {
        app: {
          appId: app.appId,
          instanceId: app.instanceId,
        },
        context,
      },
      meta: this.messaging.createMeta() as any,
    } as OpenRequest;

    const out = await this.messaging.exchange<any>(request, 'openResponse', OpenError.AppTimeout);
    return out.payload.appIdentifier;
  }
}
