import { AppMetadata } from "@finos/fdc3/dist/bridging/BridgingTypes";

/**
 * Handles messaging to apps and opening apps
 */
export interface ServerContext {

    /**
     * UUID for outgoing message
     */
    createUUID(): string;

    /**
     * Post an outgoing message to a particular app
     */
    post(message: object, to: AppMetadata): Promise<void>

    /**
     * Opens a new instance of an application.  
     * Promise completes once the application window is opened, not necessarily 
     * when FDC3 is available, returning the instance ID.
     */
    open(appId: string): Promise<AppMetadata>

    /**
     * Returns the list of apps open and connected to FDC3 at the current time.
     * Note, it is the implementor's job to ensure this list is
     * up-to-date in the event of app crashes or disconnections.
     */
    getConnectedApps(): Promise<AppMetadata[]>

    /**
     * Helper function for determining if an app is currently open and connected to the da
     */
    isAppConnected(app: AppMetadata): Promise<boolean>

    /**
     * Called when an app connects, happens sometime after it is opened.
     */
    setAppConnected(app: AppMetadata): Promise<void>

    /**
     * Allows you to write a log message somewhere
     */
    log(message: string): void

    /**
     * Name of the provider of this desktop agent server
     */
    provider(): string

    /**
     * Version of the provider of this desktop agent server
     */
    providerVersion(): string

    /**
     * Supported version of the FDC3 API of the desktop agent server.
     */
    fdc3Version(): string
}
