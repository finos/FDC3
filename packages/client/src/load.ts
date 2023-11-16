import { DesktopAgent} from '@finos/fdc3'
import { DEFAULT_OPTIONS, Options } from '../../common/src';

/**
 * This return an FDC3 API.  Called by Apps.
 */
export function load(optionsOverride: Options = DEFAULT_OPTIONS) : Promise<DesktopAgent> {

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