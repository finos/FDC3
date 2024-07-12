import { Loader, Options } from "@kite9/fdc3-common";

/**
 * This is the default fallback strategy which just throws an 
 * error because the desktop agent can't be found.
 * 
 * App authors can override this with their own strategy in the options.
 */
const fail: Loader = (_options: Options) => {

    throw new Error("No desktop agent found");

}

export default fail