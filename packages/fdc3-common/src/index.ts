import {
    AppIdentifier
} from "@finos/fdc3";

export type AppChecker = (o: Window) => AppIdentifier | undefined;


/** 
 * TODO: Fix this when we have the proper monorepo structure
 */
export * from './BrowserTypes'

export * from './GetAgent'

export { ChannelSelector } from './ChannelSelector'
export { IntentResolver, IntentResolutionChoice } from './IntentResolver'
export { Connectable } from './Connectable'
