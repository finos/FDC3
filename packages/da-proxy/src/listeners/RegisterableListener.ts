import { Listener } from "@kite9/fdc3-core";

/**
 * Extends the basic concept of FDC3 listeners to include lifecycle methods.
 * All da-proxy listners implement this interface and should be initialised
 * with the register() method before use.
 */
export interface RegisterableListener extends Listener {

    id: string | null

    filter(m: any): boolean

    action(m: any): void

    /**
     * Listeners need to be registered in order to set their IDs.
     */
    register(): Promise<void>

}