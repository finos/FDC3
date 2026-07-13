import {
  AppIdentifier,
  AppMetadata,
  AppProvidableContextMetadata,
  ImplementationMetadata,
  InstanceMetadata,
  OpenError,
  ResolveError,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { AppSupport } from './AppSupport.js';
import { Messaging } from '../Messaging.js';
import {
  FindInstancesRequest,
  FindInstancesResponse,
  GetAppMetadataRequest,
  GetAppMetadataResponse,
  GetInfoRequest,
  GetInfoResponse,
  OpenRequest,
  OpenResponse,
  CloseRequest,
  CloseResponse,
  UpdateInstanceMetadataRequest,
  UpdateInstanceMetadataResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { throwIfUndefined } from '../util/throwIfUndefined.js';
import { Logger } from '../util/Logger.js';

export class DefaultAppSupport implements AppSupport {
  readonly messaging: Messaging;
  readonly messageExchangeTimeout: number;
  readonly appLaunchTimeout: number;

  constructor(messaging: Messaging, messageExchangeTimeout: number, appLaunchTimeout: number) {
    this.messaging = messaging;
    this.messageExchangeTimeout = messageExchangeTimeout;
    this.appLaunchTimeout = appLaunchTimeout;
  }

  async findInstances(app: AppIdentifier): Promise<AppMetadata[]> {
    const request: FindInstancesRequest = {
      type: 'findInstancesRequest',
      payload: {
        app,
      },
      meta: this.messaging.createMeta(),
    };

    const out = await this.messaging.exchange<FindInstancesResponse>(
      request,
      'findInstancesResponse',
      this.messageExchangeTimeout
    );
    return out.payload.appIdentifiers ?? [];
  }

  async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    const request: GetAppMetadataRequest = {
      type: 'getAppMetadataRequest',
      payload: {
        app: app as AppIdentifier,
      },
      meta: this.messaging.createMeta(),
    };

    const response = await this.messaging.exchange<GetAppMetadataResponse>(
      request,
      'getAppMetadataResponse',
      this.messageExchangeTimeout
    );

    throwIfUndefined(
      response.payload.appMetadata,
      'Invalid response from Desktop Agent to getAppMetadata!',
      response,
      ResolveError.TargetAppUnavailable
    );

    return response.payload.appMetadata!;
  }

  async open(
    app: AppIdentifier,
    context?: Context | null,
    metadata?: AppProvidableContextMetadata
  ): Promise<AppIdentifier> {
    const request: OpenRequest = {
      type: 'openRequest',
      payload: {
        app: {
          appId: app.appId,
          instanceId: app.instanceId,
        },
        context: context || undefined,
        metadata: metadata ?? {},
      },
      meta: this.messaging.createMeta(),
    };

    const response = await this.messaging.exchange<OpenResponse>(request, 'openResponse', this.appLaunchTimeout);

    throwIfUndefined(
      response.payload.appIdentifier,
      'Invalid response from Desktop Agent to open!',
      response,
      OpenError.AppNotFound
    );

    return response.payload.appIdentifier!;
  }

  async close(): Promise<void> {
    const request: CloseRequest = {
      type: 'closeRequest',
      payload: {},
      meta: this.messaging.createMeta(),
    };

    await this.messaging.exchange<CloseResponse>(request, 'closeResponse', this.messageExchangeTimeout);
  }

  async updateInstanceMetadata(metadata: InstanceMetadata): Promise<void> {
    const request: UpdateInstanceMetadataRequest = {
      type: 'updateInstanceMetadataRequest',
      payload: {
        instanceMetadata: metadata,
      },
      meta: this.messaging.createMeta(),
    };

    await this.messaging.exchange<UpdateInstanceMetadataResponse>(
      request,
      'updateInstanceMetadataResponse',
      this.messageExchangeTimeout
    );
  }

  async getImplementationMetadata(): Promise<ImplementationMetadata> {
    const request: GetInfoRequest = {
      type: 'getInfoRequest',
      payload: {},
      meta: this.messaging.createMeta(),
    };

    const response = await this.messaging.exchange<GetInfoResponse>(
      request,
      'getInfoResponse',
      this.messageExchangeTimeout
    );

    if (response.payload.implementationMetadata) {
      return response.payload.implementationMetadata;
    } else {
      //This will only happen if the DA implementation returns an invalid message with a missing implementationMetadata property
      Logger.error('Invalid response from Desktop Agent to open!', response);
      const unknownImpl: ImplementationMetadata = {
        fdc3Version: 'unknown',
        provider: 'unknown',
        appMetadata: { appId: 'unknown', instanceId: 'unknown' },
        optionalFeatures: {
          UserChannelMembershipAPIs: false,
          DesktopAgentBridging: false,
        },
      };
      return unknownImpl;
    }
  }
}
