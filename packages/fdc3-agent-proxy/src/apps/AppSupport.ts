import { AppIdentifier, AppMetadata, ImplementationMetadata } from '@robmoffat/fdc3-standard';
import { Context } from '@robmoffat/fdc3-context';

export interface AppSupport {
  findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
  open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;
  getImplementationMetadata(): Promise<ImplementationMetadata>;
}
