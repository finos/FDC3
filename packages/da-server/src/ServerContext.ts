import { AppMetadata } from "@finos/fdc3/dist/bridging/BridgingTypes";

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
