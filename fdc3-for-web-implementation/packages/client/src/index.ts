import { DesktopAgent, } from '@finos/fdc3'
import { getAgent as getAgentType, GetAgentParams } from '@kite9/fdc3-common';
import electronEvent from './strategies/electron-event'
import postMessage from './strategies/post-message'

const DEFAULT_WAIT_FOR_MS = 20000;

export const FDC3_VERSION = "2.2"

/**
 * This return an FDC3 API.  Should be called by application code.
 * 
 * @param optionsOverride - options to override the default options
 */
export const getAgent: getAgentType = (optionsOverride?: GetAgentParams) => {

    const DEFAULT_OPTIONS: GetAgentParams = {
        dontSetWindowFdc3: true,
        channelSelector: true,
        intentResolver: true,
        timeout: DEFAULT_WAIT_FOR_MS,
        identityUrl: window.location.href
    }

    const options = {
        ...DEFAULT_OPTIONS,
        ...optionsOverride
    }

    const STRATEGIES = [
        electronEvent,
        postMessage
    ]

    function handleGenericOptions(da: DesktopAgent) {
        if ((!options.dontSetWindowFdc3) && (globalThis.window.fdc3 == null)) {
            globalThis.window.fdc3 = da;
            globalThis.window.dispatchEvent(new Event("fdc3Ready"));
        }

        return da;
    }

    const strategies = STRATEGIES.map(s => s(options));

    return Promise.race(strategies)
        .then(da => handleGenericOptions(da))
        .catch(async (error) => {
            if (options.failover) {
                const o = await options.failover(options)

                if ((o as any).getInfo) {
                    return o as DesktopAgent
                } else {
                    // todo: turn the window proxy into a desktop agent
                    return o as DesktopAgent
                }

            } else {
                throw error
            }
        })
}

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the new getClientAPI function.
 * 
 * @param waitForMs Amount of time to wait before failing the promise (20 seconds is the default).
 * @returns A DesktopAgent promise.
 */
export function fdc3Ready(waitForMs = DEFAULT_WAIT_FOR_MS): Promise<DesktopAgent> {
    return getAgent({
        timeout: waitForMs,
        dontSetWindowFdc3: false,
        channelSelector: true,
        intentResolver: true
    })
}