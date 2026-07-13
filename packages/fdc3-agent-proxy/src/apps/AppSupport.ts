import {
  AppIdentifier,
  AppMetadata,
  AppProvidableContextMetadata,
  ImplementationMetadata,
  InstanceMetadata,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

export interface AppSupport {
  findInstances(app: AppIdentifier): Promise<Array<AppMetadata>>;
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
  open(app: AppIdentifier, context?: Context | null, metadata?: AppProvidableContextMetadata): Promise<AppIdentifier>;
  close(): Promise<void>;
  getImplementationMetadata(): Promise<ImplementationMetadata>;
  updateInstanceMetadata(metadata: InstanceMetadata): Promise<void>;
}
