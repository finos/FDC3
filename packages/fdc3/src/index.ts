export * from '@finos/fdc3-context';

import { BrowserTypes, BridgingTypes } from '@finos/fdc3-schema';
export { BridgingTypes, BrowserTypes };

import { DesktopAgent, AppIdentifier } from '@finos/fdc3-standard';
export * from '@finos/fdc3-standard';
export { AppIdentifier };

import { getAgent, fdc3Ready } from '@finos/fdc3-get-agent';
export { getAgent, fdc3Ready };

declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
