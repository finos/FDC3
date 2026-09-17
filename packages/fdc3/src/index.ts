export * from '@finos/fdc3-context';

import { BrowserTypes, BrowserTypesValidation, BridgingTypes, BridgingTypesValidation } from '@finos/fdc3-schema';
export { BridgingTypes, BridgingTypesValidation, BrowserTypes, BrowserTypesValidation };

import { DesktopAgent, AppIdentifier } from '@finos/fdc3-standard';
export * from '@finos/fdc3-standard';
export { AppIdentifier };

export { getAgent, fdc3Ready } from '@finos/fdc3-get-agent';

declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
