/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

export type { Icon, Image, AppIdentifier } from '../generated/api/BrowserTypes.js';

export type {
  Application,
  IntentObject as AppDirectoryIntent,
  AllApplicationsResponseObject as AllApplicationsResponse,
  Interop,
  LaunchDetails,
  Type as ApplicationType,
} from '../generated/app-directory/AppDirectoryTypes.js';

import type { LaunchDetails } from '../generated/app-directory/AppDirectoryTypes.js';

/** Properties used to launch apps with `type: web`. */
export type WebAppDetails = Required<Pick<LaunchDetails, 'url'>>;

/** Host-specific manifest entries keyed by Desktop Agent or container platform name. */
export type HostManifests = { [hostName: string]: { [key: string]: unknown } | string };
