import { DesktopAgent} from '@finos/fdc3'
import { Options } from 'fdc3-common';
import postMessage from './strategies/post-message'
import electronEvent from './strategies/electron-event'

export const DEFAULT_OPTIONS : Options = {
    setWindowGlobal: false,
    fireFdc3Ready: false,
    strategies: [postMessage, electronEvent],
    frame: window.opener ?? window.parent
}

/**
 * This return an FDC3 API.  Called by Apps.
 */
export function getClientAPI(optionsOverride: Options = DEFAULT_OPTIONS) : Promise<DesktopAgent> {

    const options = {
        ...DEFAULT_OPTIONS,
        ...optionsOverride
    }

    function handleGenericOptions(da: DesktopAgent) {
        if ((options.setWindowGlobal) && (window.fdc3 == null)) {
            window.fdc3 = da;
        }
        
        return da;
    }

    const strategies = options.strategies!!.map(s => s(options));

    return Promise.any(strategies)
        .then(da => handleGenericOptions(da)) 
}