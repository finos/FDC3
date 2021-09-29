/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

export interface Icon {
  /** The icon url */
  readonly src: string;

  /** The icon dimension */
  readonly size?: string;

  /** The icon media type */
  readonly type?: string;
}
