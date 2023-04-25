/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Identifies an application, or instance of an application, and is used to target FDC3 API calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific instance of the application that may be addressed using that Id.
 */
export interface AppIdentifier {
  /** The unique application identifier located within a specific application directory instance. An example of an appId might be 'app@sub.root' */
  readonly appId: string;

  /** An optional instance identifier, indicating that this object represents a specific instance of the application described.*/
  readonly instanceId?: string;

  /** The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to identify the Desktop Agent to target.
   *  @experimental Introduced in FDC3 2.1 and may be refined by further changes outside the normal FDC3 versioning policy.
   **/
  readonly desktopAgent?: string;
}
