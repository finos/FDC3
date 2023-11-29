import { AppIdentifier, AppMetadata, Context } from "@finos/fdc3";
import { AppSupport } from "./AppSupport";
export declare class DefaultAppSupport implements AppSupport {
    hasDesktopAgentBridging(): boolean;
    hasOriginatingAppMetadata(): boolean;
    findInstances(_app: AppIdentifier): Promise<AppIdentifier[]>;
    getAppMetadata(_app: AppIdentifier): Promise<AppMetadata>;
    open(_app: AppIdentifier, _context?: Context | undefined): Promise<AppIdentifier>;
    getThisAppMetadata(): Promise<AppMetadata>;
}
