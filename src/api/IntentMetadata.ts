/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

/**
* Intent descriptor
*/
interface IntentMetadata {
    /** The unique name of the intent that can be invoked by the raiseIntent call */
    name: string;
  
    /** A friendly display name for the intent that should be used to render UI elements */
    displayName: string;
}