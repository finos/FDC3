/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

export interface Listener {
  /**
   * Unsubscribe the listener object.
   */
  unsubscribe(): Promise<void>;
}
