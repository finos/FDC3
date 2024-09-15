import { DesktopAgent } from '@kite9/fdc3-standard'
import { getAgent } from './strategies/getAgent';
const DEFAULT_WAIT_FOR_MS = 20000;


export { getAgent }

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the new getAgent function.
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