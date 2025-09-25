/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { AppMetadata } from './AppMetadata.js';

/**
 * Metadata relating to the FDC3 Desktop Agent implementation and its provider.
 */
export interface ImplementationMetadata {
  /** The version number of the FDC3 specification that the implementation provides.
   *  The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
   */
  readonly fdc3Version: string;

  /** The name of the provider of the Desktop Agent implementation (e.g. Finsemble, Glue42, OpenFin etc.). */
  readonly provider: string;

  /** The version of the provider of the Desktop Agent implementation (e.g. 5.3.0). */
  readonly providerVersion?: string;

  /** Metadata indicating whether the Desktop Agent implements optional features of
   *  the Desktop Agent API.
   */
  readonly optionalFeatures: {
    /** Used to indicate whether the exposure of 'originating app metadata' for
     *  context and intent messages is supported by the Desktop Agent.*/
    readonly OriginatingAppMetadata: boolean;
    /** Used to indicate whether the optional `fdc3.joinUserChannel`,
     *  `fdc3.getCurrentChannel` and `fdc3.leaveCurrentChannel` are implemented by
     *  the Desktop Agent.*/
    readonly UserChannelMembershipAPIs: boolean;
    /** Used to indicate whether the experimental Desktop Agent Bridging
     *  feature is implemented by the Desktop Agent.*/
    readonly DesktopAgentBridging: boolean;
  };

  /** The calling application instance's own metadata, according to the Desktop Agent (MUST include at least the `appId` and `instanceId`). */
  readonly appMetadata: AppMetadata;
}
