import { DesktopAgent } from '@finos/fdc3'
import { Options } from '@kite9/fdc3-common';
import electronEvent from './strategies/electron-event'
import postMessage from './strategies/post-message'

const DEFAULT_WAIT_FOR_MS = 20000;

/**
 * This return an FDC3 API.  Should be called by application code.
 * 
 * @param optionsOverride - options to override the default options
 */
export function getAgentAPI(optionsOverride?: Options): Promise<DesktopAgent> {

    const DEFAULT_OPTIONS: Options = {
        setWindowGlobal: false,
        fireFdc3Ready: false,
        strategies: [postMessage, electronEvent],
        frame: globalThis.window.opener ?? globalThis.window.parent,
        waitForMs: DEFAULT_WAIT_FOR_MS,
    }

    const options = {
        ...DEFAULT_OPTIONS,
        ...optionsOverride
    }

    function handleGenericOptions(da: DesktopAgent) {
        if ((options.setWindowGlobal) && (globalThis.window.fdc3 == null)) {
            globalThis.window.fdc3 = da;
        }

        if (options.fireFdc3Ready) {
            globalThis.window.dispatchEvent(new Event("fdc3Ready"));
        }

        return da;
    }

    const strategies = options.strategies!!.map(s => s(options));

    return Promise.race(strategies)
        .then(da => handleGenericOptions(da))
        .catch((error) => {
            if (options.fallbackStrategy) {
                return options.fallbackStrategy(options)
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
    return getAgentAPI({
        waitForMs,
        setWindowGlobal: true,
        fireFdc3Ready: true
    })
}