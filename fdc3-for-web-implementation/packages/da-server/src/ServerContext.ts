import { AppIdentifier } from "@kite9/fdc3-common";


/**
 * This is a unique, long, unguessable string that identifies a particular instance of an app.
 * All messages arriving at the desktop agent will have this UUID attached to them.
 * It is important that this is unguessable as it is a "password" of sorts used to 
 * identify the app between reconnections.
 */
export type InstanceUUID = string

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
    post(message: object, to: AppIdentifier): Promise<void>

    /**
     * Post an outgoing message to a particular app
     */
    post(message: object, to: InstanceUUID): Promise<void>

    /**
     * Opens a new instance of an application.  
     * Promise completes once the application window is opened
     */
    open(appId: string): Promise<InstanceUUID>

    /**
     * Sets the appId and instanceId for a given connection UUID
     */
    setInstanceDetails(uuid: InstanceUUID, meta: AppIdentifier): void

    /**
     * Returns the UUID for a particular instance of an app.
     * This is used in situations where an app is reconnecting to the same desktop agent.
     */
    getInstanceDetails(uuid: InstanceUUID): AppIdentifier | undefined

    /**
     * Registers an app as connected to the desktop agent. 
     */
    setAppConnected(app: AppIdentifier): Promise<void>

    /**
     * Returns the list of apps open and connected to FDC3 at the current time.
     * Note, it is the implementor's job to ensure this list is
     * up-to-date in the event of app crashes or disconnections.
     */
    getConnectedApps(): Promise<AppIdentifier[]>

    /**
     * Helper function for determining if an app is currently open and connected to the da
     */
    isAppConnected(app: AppIdentifier): Promise<boolean>

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
