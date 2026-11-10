/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Metadata that describes a specific instance of an application, which can be used to
 * disambiguate instances in UI elements such as a resolver or intent picker.
 *
 * An application may update its own instance metadata via `fdc3.updateInstanceMetadata()`,
 * allowing Desktop Agents to display meaningful, instance-specific information
 * (e.g. the name of the contact or instrument currently being viewed).
 *
 * Must only be set on an `AppMetadata` object if `instanceId` is also set.
 */
export interface InstanceMetadata {
  /** A user-friendly title for this specific instance that can be used to render UI elements,
   *  such as a resolver or intent picker, to help distinguish it from other instances of the same application.
   *  For example, an app displaying a stock chart might set this to the name of the instrument being displayed.
   *
   *  Apps SHOULD include their application title (`AppMetadata.title`) within the instance title where appropriate,
   *  and Desktop Agents SHOULD display both the application title and the instance title when both are available. */
  readonly instanceTitle?: string;

  /** Additional, implementation-specific metadata fields. The FDC3 Standard does not define the meaning of any
   *  fields other than `instanceTitle`, so apps SHOULD NOT rely on Desktop Agents recognizing or displaying them. */
  readonly [key: string]: any;
}
