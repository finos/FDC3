import { AppIdentifier, AppMetadata, ImplementationMetadata } from '@kite9/fdc3-standard';
import { Context } from '@kite9/fdc3-context';

export interface AppSupport {
  findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
  open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;
  getImplementationMetadata(): Promise<ImplementationMetadata>;
}
