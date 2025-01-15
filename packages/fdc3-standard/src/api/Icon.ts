/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

export interface Icon {
  /** The icon url */
  readonly src: string;

  /** The icon dimension, formatted as `<height>x<width>`. */
  readonly size?: string;

  /** Icon media type. If not present the Desktop Agent may use the src file extension. */
  readonly type?: string;
}
