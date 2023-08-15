/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 * @experimental Introduced in FDC3 2.1 and may be refined by further changes outside the normal FDC3 versioning policy.
 */
export interface DesktopAgentIdentifier {
  /** Used in Desktop Agent Bridging to attribute or target a message to a
   *  particular Desktop Agent. */
  readonly desktopAgent: string;
}
