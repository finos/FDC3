/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

export * from './api/AppIntent';
export * from './api/AppMetadata';
export * from './api/Channel';
export * from './api/ContextHandler';
export * from './api/DesktopAgent';
export * from './api/DisplayMetadata';
export * from './api/Errors';
export * from './api/IntentMetadata';
export * from './api/IntentResolution';
export * from './api/Listener';
export * from './context/ContextTypes';

import { DesktopAgent } from './api/DesktopAgent';

declare global {
  interface Window {
    fdc3: DesktopAgent;
  }
}
