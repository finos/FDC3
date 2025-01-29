/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

export interface Image {
  /** The image url. */
  readonly src: string;

  /** The image dimension, formatted as `<height>x<width>`. */
  readonly size?: string;

  /** Image media type. If not present the Desktop Agent may use the src file extension. */
  readonly type?: string;

  /** Caption for the image. */
  readonly label?: string;
}
