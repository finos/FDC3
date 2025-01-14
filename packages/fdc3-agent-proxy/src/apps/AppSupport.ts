import { AppIdentifier, AppMetadata, ImplementationMetadata } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

export interface AppSupport {
  findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
  open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;
  getImplementationMetadata(): Promise<ImplementationMetadata>;
}
