export * from '@robmoffat/fdc3-context';

import { BrowserTypes, BridgingTypes } from '@robmoffat/fdc3-schema';
export { BridgingTypes, BrowserTypes };

import { DesktopAgent, AppIdentifier } from '@robmoffat/fdc3-standard';
export * from '@robmoffat/fdc3-standard';
export { AppIdentifier };

import { getAgent, fdc3Ready } from '@robmoffat/fdc3-get-agent';
export { getAgent, fdc3Ready };

declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
