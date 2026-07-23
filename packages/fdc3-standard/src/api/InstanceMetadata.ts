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
   *  For example, an app displaying a stock chart might set this to the name of the instrument being displayed. */
  readonly title?: string;

  /** Additional custom metadata fields that can be used to further disambiguate instances.
   *  These are implementation-specific and may include information such as screen position,
   *  workspace assignment, or other instance-specific details. */
  readonly [key: string]: any;
}
