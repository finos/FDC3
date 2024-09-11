/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { DesktopAgent } from './api/DesktopAgent';

export * from '@kite9/fdc3-schema'

export { AppIdentifier } from './api/AppIdentifier';
export { AppIntent } from './api/AppIntent';
export { AppMetadata } from './api/AppMetadata';
export * from './api/ContextMetadata';
export * from './api/DesktopAgent';
export { DisplayMetadata } from './api/DisplayMetadata';
export * from './api/Errors';
export { Icon } from './api/Icon';
export { Image } from './api/Image';
export { ImplementationMetadata } from './api/ImplementationMetadata';
export { IntentMetadata } from './api/IntentMetadata';
export { IntentResolution } from './api/IntentResolution';
export * from './api/Listener';
export * from './api/Methods';
export * from './api/PrivateChannel';
export * from './api/RecommendedChannels';
export { ContextHandler, IntentHandler, IntentResult } from './api/Types';
export * from './context/ContextType';
export * from './intents/Intents';
export * from './api/GetAgent';
export { EventHandler, FDC3ChannelChangedEvent, FDC3Event, FDC3EventType } from './api/Events'
export * from './ui/ChannelSelector'
export * from './ui/IntentResolver'
export * from './ui/Connectable'
export { Channel } from './api/Channel';


declare global {
  interface Window {
    fdc3: DesktopAgent;
  }
}
