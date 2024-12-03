export * from '@kite9/fdc3-context';

import { BrowserTypes, BridgingTypes } from '@kite9/fdc3-schema';
export { BridgingTypes, BrowserTypes };

import { DesktopAgent, AppIdentifier } from '@kite9/fdc3-standard';
export * from '@kite9/fdc3-standard';
export { AppIdentifier };

import { getAgent, fdc3Ready } from '@kite9/fdc3-get-agent';
export { getAgent, fdc3Ready };

/** Might not be needed */
declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
