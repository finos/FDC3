/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { DesktopAgent } from './api/DesktopAgent';
import * as BridgingTypes from './bridging/BridgingTypes';
import * as BrowserTypes from './api/BrowserTypes';
//import in order to create a local export that overwrites type exported via ContextTypes
import * as AppIdentifier from './api/AppIdentifier';

export * from './context/ContextTypes';

export { AppIdentifier };
export * from './api/AppIntent';
export * from './api/AppMetadata';
export * from './api/Channel';
export * from './api/ContextMetadata';
export * from './api/DesktopAgent';
export * from './api/DisplayMetadata';
export * from './api/Errors';
export * from './api/GetAgent';
export * from './api/Icon';
export * from './api/Image';
export * from './api/ImplementationMetadata';
export * from './api/IntentMetadata';
export * from './api/IntentResolution';
export * from './api/Listener';
export * from './api/Methods';
export * from './api/PrivateChannel';
export * from './api/RecommendedChannels';
export * from './api/Types';
export * from './api/Events'

export * from './context/ContextType';

export * from './intents/Intents';

/* Workaround for conflicts between bridging types, browser type and API types
   and prettier issue with `export * as`. */
export { BridgingTypes };
export { BrowserTypes };

declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
