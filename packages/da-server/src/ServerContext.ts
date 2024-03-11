export interface ServerContext {

    /**
     * UUID for outgoing message
     */
    createUUID(): string;

    /**
     * Post an outgoing message
     */
    post(message: object): Promise<void>

    /**
     * Allows you to write a log message somewhere
     */
    log(message: string): void
}
