/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * A system channel will be global enough to have a presence across many apps. This gives us some hints
 * to render them in a standard way. It is assumed it may have other properties too, but if it has these,
 * this is their meaning.
 */
export interface DisplayMetadata {
  /**
   * A user-readable name for this channel, e.g: `"Red"`
   */
  readonly name?: string;

  /**
   * The color that should be associated within this channel when displaying this channel in a UI, e.g: `0xFF0000`.
   */
  readonly color?: string;

  /**
   * A URL of an image that can be used to display this channel
   */
  readonly glyph?: string;
}
