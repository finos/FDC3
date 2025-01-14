/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { DesktopAgent } from './api/DesktopAgent';

//explicit overwrite of conflicting & equivalent export from ContextTypes
export { AppIdentifier } from './api/AppIdentifier';
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
export * from './api/Events';
export * from './api/GetAgent';
export * from './context/ContextType';
export * from './intents/Intents';
export * from './ui/IntentResolver';
export * from './ui/ChannelSelector';
export * from './ui/Connectable';

export const FDC3_VERSION = '2.2';

declare global {
  interface Window {
    fdc3?: DesktopAgent;
  }
}
