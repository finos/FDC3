/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2021 FINOS FDC3 contributors - see NOTICE file
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

  /** Compare the implemented FDC3 version to the specified version.
   *
   * Returns `-1` if the implemented FDC3 version is lower than the specified version,
   * `1` if the implemented FDC3 version is greater than specified, 0 if the arguments
   * are equal.
   */
  compareVersion(version: string): number;

  /** Confirm that the supported FDC3 version is at least the specified version or higher.
   */
  versionIsAtLeast(version: string): boolean;
}
