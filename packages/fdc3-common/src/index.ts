import { AppIntent, AppIdentifier, DesktopAgent, IntentMetadata, IntentResult, Channel } from "@finos/fdc3";
import { WebConnectionProtocol1Hello, WebConnectionProtocol2LoadURL, WebConnectionProtocol3Handshake } from "./BrowserTypes";
import { GetAgentParams } from "./GetAgent";

export type AppChecker = (o: Window) => AppIdentifier | undefined;

export type Supplier = (
    checker: AppChecker,
    detailsResolver: DesktopAgentDetailResolver,
    portResolver?: DesktopAgentPortResolver,
    on?: Window) => void;

export type Loader = (options: GetAgentParams) => Promise<DesktopAgent>

/**
 * Use these to return details specific to the window/app needing a connection
 */
export type DesktopAgentDetailResolver = (o: Window, a: WebConnectionProtocol1Hello) => WebConnectionProtocol3Handshake | WebConnectionProtocol2LoadURL

/**
 * Same as above, but for the port
 */
export type DesktopAgentPortResolver = (o: Window, a: WebConnectionProtocol1Hello) => MessagePort | null

export interface CSSPositioning { [key: string]: string }

export const CSS_ELEMENTS = ["width",
    "height",
    "position",
    "zIndex",
    "left",
    "right",
    "top",
    "bottom",
    "transition",
    "maxHeight",
    "maxWidth"]

export type ChannelSelectorDetails = {
    uri?: string,
    expandedCss?: CSSPositioning,
    collapsedCss?: CSSPositioning
}

export type IntentResolverDetails = {
    uri?: string,
    css?: CSSPositioning
}

/**
 * Contains the details of a single intent and application resolved
 * by the IntentResolver implementation
 */
export interface SingleAppIntent {

    intent: IntentMetadata
    chosenApp: AppIdentifier

}

/**
 * Interface used by the desktop agent proxy to handle the channel selection process.
 */
export interface ChannelSelector {

    updateChannel(channelId: string | null, availableChannels: Channel[]): void

    setChannelChangeCallback(callback: (channelId: string) => void): void

}

/**
 * Interface used by the desktop agent proxy to handle the intent resolution process.
 */
export interface IntentResolver {

    /**
     * Called when the user needs to resolve an intent.  
     */
    chooseIntent(appIntents: AppIntent[], source: AppIdentifier): Promise<SingleAppIntent>

    /**
     * Steps after the user has chosen the intent
     */
    intentChosen(intentResult: IntentResult): Promise<IntentResult>

}


export type IntentResolutionChoiceAgentResponse = {
    type: 'intentResolutionChoice',
    payload: SingleAppIntent
}


export type IntentResolutionChoiceAgentRequest = IntentResolutionChoiceAgentResponse


export type ChannelSelectionChoiceAgentRequest = {
    type: 'channelSelectionChoice',
    payload: {
        channelId: string,
        cancelled: boolean,
    }
}

export type ChannelSelectionChoiceAgentResponse = ChannelSelectionChoiceAgentRequest

/**
 * Messages from the app to the channel selector / intent resolver
 */
export type ChannelDetails = {
    id: string;
    displayMetadata: {
        name: string;
        color: string;
        glyph?: string;
    }
};

export type SelectorMessageChannels = {
    type: "SelectorMessageChannels";
    channels: ChannelDetails[];
    selected: string;
}


/** 
 * From the channel selector to the app
 */
export type SelectorMessageChoice = {
    type: "SelectorMessageChoice";
    channelId: string | null;
}

/** 
 * From the channel selector to the app
 */
export type SelectorMessageResize = {
    type: "SelectorMessageResize";
    expanded: boolean;
}

/**
 * From the channel selector/intent resolver to the app, on startup
 */
export type SelectorMessageInitialize = {
    type: "SelectorMessageInitialize"
}

/** 
 * From the intent resolver to the app
 */
export type ResolverMessageChoice = {
    type: "ResolverMessageChoice";
    payload: SingleAppIntent
}

/**
 * From the app to the intent resolver
 */
export type ResolverIntents = {
    type: "ResolverIntents";
    appIntents: AppIntent[],
    source: AppIdentifier
}

/** 
 * TODO: Fix this when we have the proper monorepo structure
 */
export * from './BrowserTypes'

export * from './GetAgent'