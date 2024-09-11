
export * from "@kite9/fdc3-context"

import { BrowserTypes, BridgingTypes } from "@kite9/fdc3-schema";
export { BridgingTypes, BrowserTypes };

import { getAgent } from "@kite9/fdc3-get-agent";
export { getAgent };

export * from '@kite9/fdc3-standard';

import { DesktopAgent, AppIdentifier } from "@kite9/fdc3-standard";

export { AppIdentifier };

/** Might not be needed */
declare global {
    interface Window {
        fdc3: DesktopAgent;
    }
}