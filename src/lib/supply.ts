import { supplier } from './strategies/post-message-load-js'
import { AppChecker, DesktopAgentDetailResolver } from './types';

/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the desktop agent
 */
export function supply(url: string, appIdResolver: AppChecker, detailsResolver: DesktopAgentDetailResolver) {
    supplier(url, appIdResolver, detailsResolver);
}

