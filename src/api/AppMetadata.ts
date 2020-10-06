/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

/**
 * App definition as provided by the application directory
 */
export interface AppMetadata {
  /** The unique app name that can be used with the open and raiseIntent calls. */
  readonly name: string;

  /** A more user-friendly application title that can be used to render UI elements  */
  readonly title?: string;

  /**  A tooltip for the application that can be used to render UI elements */
  readonly tooltip?: string;

  /** A longer, multi-paragraph description for the application that could include markup */
  readonly description?: string;

  /** A list of icon URLs for the application that can be used to render UI elements */
  readonly icons?: Array<string>;

  /** A list of image URLs for the application that can be used to render UI elements */
  readonly images?: Array<string>;
}
