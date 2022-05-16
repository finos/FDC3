/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Identifies an application, or instance of an application, and is used to target FDC3 API calls at specific applications.
 *
 * Will always include at least a `appId` property, which can be used with `fdc3.open`, `fdc3.raiseIntent` etc..
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific instance of the application that may be addressed using that Id.
 */
export interface AppIdentifier {
  /** The unique application identifier located within a specific application directory instance. An example of an appId might be 'app@sub.root' */
  readonly appId: string;

  /** An optional instance identifier, indicating that this object represents a specific instance of the application described.*/
  readonly instanceId?: string;
}
