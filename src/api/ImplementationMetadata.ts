/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Metadata relating to the FDC3 Desktop Agent implementation and its provider.
 */
export interface ImplementationMetadata {
  /** The version number of the FDC3 specification that the implementation provides.
   *  The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
   */
  readonly fdc3Version: string;

  /** The name of the provider of the FDC3 Desktop Agent Implementation (e.g. Finsemble, Glue42, OpenFin etc.). */
  readonly provider: string;

  /** The version of the provider of the FDC3 Desktop Agent Implementation (e.g. 5.3.0). */
  readonly providerVersion?: string;
}
