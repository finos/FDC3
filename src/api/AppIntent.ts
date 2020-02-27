/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

/**
* An interface that relates an intent to apps
*/
interface AppIntent {
    intent: IntentMetadata;
    apps: Array<AppMetadata>;
}