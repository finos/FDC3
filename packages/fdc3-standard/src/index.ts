/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { DesktopAgent } from './api/DesktopAgent.js';

//explicit overwrite of conflicting & equivalent export from ContextTypes
export { AppIdentifier } from './api/AppIdentifier.js';
export * from './api/AppIntent.js';
export * from './api/AppMetadata.js';
export * from './api/Channel.js';
export * from './api/ContextMetadata.js';
export * from './api/DesktopAgent.js';
export * from './api/DisplayMetadata.js';
export * from './api/Errors.js';
export * from './api/GetAgent.js';
export * from './api/Icon.js';
export * from './api/Image.js';
export * from './api/ImplementationMetadata.js';
export * from './api/IntentMetadata.js';
export * from './api/IntentResolution.js';
export * from './api/Listener.js';
export * from './api/Methods.js';
export * from './api/PrivateChannel.js';
export * from './api/RecommendedChannels.js';
export * from './api/Types.js';
export * from './api/Events.js';
export * from './api/GetAgent.js';
export * from './context/ContextType.js';
export * from './intents/Intents.js';
export * from './ui/IntentResolver.js';
export * from './ui/ChannelSelector.js';
export * from './ui/Connectable.js';

export const FDC3_VERSION = '2.2';

declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
