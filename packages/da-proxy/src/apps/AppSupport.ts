import { AppIdentifier, AppMetadata, Context } from "@kite9/fdc3-core";


export interface AppSupport {

    findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>

    getAppMetadata(app: AppIdentifier): Promise<AppMetadata>

    open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>

}