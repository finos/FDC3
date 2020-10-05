/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Intent descriptor
 */
export interface IntentMetadata {
  /** The unique name of the intent that can be invoked by the raiseIntent call */
  readonly name: string;

  /** A friendly display name for the intent that should be used to render UI elements */
  readonly displayName: string;
}
