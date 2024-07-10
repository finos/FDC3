import { DesktopAgent } from '@finos/fdc3'
import { Options } from '@kite9/fdc3-common';
import fail from './strategies/fail';
import electronEvent from './strategies/electron-event'
import postMessage from './strategies/post-message'

const DEFAULT_WAIT_FOR_MS = 20000;

export const DEFAULT_OPTIONS: Options = {
    setWindowGlobal: false,
    fireFdc3Ready: false,
    strategies: [postMessage, electronEvent],
    frame: window.opener ?? window.parent,
    waitForMs: DEFAULT_WAIT_FOR_MS,
}

/**
 * This return an FDC3 API.  Should be called by application code.
 * 
 * @param optionsOverride - options to override the default options
 */
export function getClientAPI(optionsOverride: Options = DEFAULT_OPTIONS): Promise<DesktopAgent> {

    const options = {
        ...DEFAULT_OPTIONS,
        ...optionsOverride
    }

    function handleGenericOptions(da: DesktopAgent) {
        if ((options.setWindowGlobal) && (window.fdc3 == null)) {
            window.fdc3 = da;
        }

        if (options.fireFdc3Ready) {
            window.dispatchEvent(new Event("fdc3Ready"));
        }

        sessionStorage.setItem("fdc3", "true");

        return da;
    }

    function waitThenFallback(options: Options): Promise<DesktopAgent> {
        const fallbackStrategy = options.fallbackStrategy ?? fail

        return new Promise<DesktopAgent>((_, reject) => {
            setTimeout(() => reject(new Error('timeout succeeded')), options.waitForMs);
        }).then(() => fallbackStrategy(options))
    }

    const toProcess = [
        ...options.strategies!!,
        waitThenFallback
    ]

    const strategies = toProcess.map(s => s(options));

    return Promise.race(strategies)
        .then(da => handleGenericOptions(da))
}

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the new getClientAPI function.
 * 
 * @param waitForMs Amount of time to wait before failing the promise (20 seconds is the default).
 * @returns A DesktopAgent promise.
 */
export function fdc3Ready(waitForMs = DEFAULT_WAIT_FOR_MS): Promise<DesktopAgent> {
    return getClientAPI({
        ...DEFAULT_OPTIONS,
        waitForMs,
        setWindowGlobal: true,
        fireFdc3Ready: true
    })
}