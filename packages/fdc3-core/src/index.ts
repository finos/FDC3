/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { DesktopAgent } from './api/DesktopAgent';
import { BridgingTypes } from '@kite9/fdc3-schema';
import { ContextTypes } from '@kite9/fdc3-schema';
import { BrowserTypes } from '@kite9/fdc3-schema';

export * from './api/AppIdentifier';
export * from './api/AppIntent';
export * from './api/AppMetadata';
export * from './api/Channel';
export * from './api/ContextMetadata';
export * from './api/DesktopAgent';
export * from './api/DisplayMetadata';
export * from './api/Errors';
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
export * from './context/ContextType';
export * from './intents/Intents';
export * from './api/Events'

/* Workaround for conflicts between bridging types and API types
   and prettier issue with `export * as`. */
export { BridgingTypes, BrowserTypes, ContextTypes };

declare global {
  interface Window {
    fdc3: DesktopAgent;
  }
}
