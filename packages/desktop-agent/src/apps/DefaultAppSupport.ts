import { AppIdentifier, AppMetadata, Context } from "@finos/fdc3";
import { AppSupport } from "./AppSupport";


export class DefaultAppSupport implements AppSupport {

    hasDesktopAgentBridging(): boolean {
        throw new Error("Method not implemented.");
    }

    hasOriginatingAppMetadata(): boolean {
        throw new Error("Method not implemented.");
    }
    
    findInstances(_app: AppIdentifier): Promise<AppIdentifier[]> {
        throw new Error("Method not implemented.");
    }

    getAppMetadata(_app: AppIdentifier): Promise<AppMetadata> {
        throw new Error("Method not implemented.");
    }

    open(_app: AppIdentifier, _context?: Context | undefined): Promise<AppIdentifier> {
        throw new Error("Method not implemented.");
    }
    
    getThisAppMetadata(): Promise<AppMetadata> {
        throw new Error("Method not implemented.");
    }
    
}