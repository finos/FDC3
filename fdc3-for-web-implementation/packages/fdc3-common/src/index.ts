import {
    AppIdentifier, DesktopAgent
} from "@finos/fdc3";
import { GetAgentParams } from "./GetAgent";

export type AppChecker = (o: Window) => AppIdentifier | undefined;

export type Loader = (options: GetAgentParams) => Promise<DesktopAgent>

/** 
 * TODO: Fix this when we have the proper monorepo structure
 */
export * from './BrowserTypes'

export * from './GetAgent'

export { ChannelSelector } from './ChannelSelector'
export { IntentResolver, IntentResolutionChoice } from './IntentResolver'