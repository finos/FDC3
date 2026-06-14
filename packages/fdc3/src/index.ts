export * from '@finos/fdc3-context';

import { BrowserTypes, BridgingTypes } from '@finos/fdc3-schema';
export { BridgingTypes, BrowserTypes };

export type {
  Application,
  AllApplicationsResponse,
  ApplicationType,
  HostManifests,
  Icon,
  Intent,
  Interop,
  LaunchDetails,
  Screenshot,
  WebAppDetails,
} from '@finos/fdc3-schema';

import { DesktopAgent, AppIdentifier } from '@finos/fdc3-standard';
export * from '@finos/fdc3-standard';
export { AppIdentifier };

export { getAgent, fdc3Ready } from '@finos/fdc3-get-agent';

declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
