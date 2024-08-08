import { AppIntent, AppIdentifier, DesktopAgent, IntentMetadata, IntentResult, Channel } from "@finos/fdc3";
/** 
 * We need to add options here. 
 */
export type Options = {
    /**
     * Set this true if you wish to have window.fdc3 set to the desktop agent once it is found
     */
    setWindowGlobal?: boolean,
    /**
     * Set this to true if you want to fire an fdc3.ready event on the window.  This is for backwards compatibility with FDC3 2.0 and the old
     * window.fdc3 approach.
     */
    fireFdc3Ready?: boolean,

    /**
     * Override this if you want to customise the loaders used.  By default, it will use the postMessage and electronEvent strategies.
     */
    strategies?: Loader[],

    /**
     * Override this if you want to supply your own fallback approach for getting the FDC3 api. By default, it will throw an error.
     */
    fallbackStrategy?: Loader,

    /**
     * This is the frame/window that the desktop agent should be found in.  By default, it will use the opener or parent window.
     */
    frame?: Window,

    /**
     * This is the time to wait for the strategies to find a desktop agent.  By default, it is 20 seconds.
     */
    waitForMs?: number,

    /**
     * If you wish to opt-out of the desktop agent's own intent resolver and supply an implementation, do so here.
     */
    intentResolver?: IntentResolver,

    /**
     * If you wish to opt-out of the desktop agent's own channel selector and supply an implementation, do so here.
     */
    channelSelector?: ChannelSelector,

    /**
     * The initial path is used by the desktop to check that it is talking to the right application when applications share the same origin.
     * If the application tries to load the desktop agent from a window with a different URL from the one provided to the desktop agent in the app 
     * directory, you'll need to set it here.
     */
    appInitialPath?: string
}

export type AppChecker = (o: Window) => AppIdentifier | undefined;

export type Supplier = (
    checker: AppChecker,
    detailsResolver: DesktopAgentDetailResolver,
    portResolver?: DesktopAgentPortResolver,
    on?: Window) => void;

export type Loader = (options: Options) => Promise<DesktopAgent>

/**
 * These are details such as login information sent from the desktop back to the 
 * app in order to initialise the api.
 * 
 * TODO: remove this type
 */
export type DesktopAgentDetails = { [key: string]: any }

/**
 * Use these to return details specific to the window/app needing a connection
 */
export type DesktopAgentDetailResolver = (o: Window, a: AppIdentifier) => DesktopAgentDetails

/**
 * Return a MessagePort specific to the window/app in question
 */
export type DesktopAgentPortResolver = (o: Window, a: AppIdentifier) => MessagePort | null

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
 * This is the object that the desktop agent must get back to the App.
 * In the first instance, the only approach to instantiating the desktop
 * agent is via the "message-port" approach.  This may change in the future.
 */
export type APIResponseMessage = {
    type: "FDC3-API-Response",
    method: "message-port",
    appIdentifier: AppIdentifier,
    intentResolver: IntentResolverDetails,
    channelSelector: ChannelSelectorDetails,
    desktopAgentId: string
    // fdc3Version: string,
    // supportedFDC3Versions: string[],
    // desktopAgentBridgeVersion: string,
    // authRequired: boolean,
    // provider: string,
    // authToken?: string,
}

export type APIResponseMessageIFrame = APIResponseMessage & {
    uri?: string,           /* Supplied when an embedded iframe should be loaded */
}

export type APIResponseMessageParentWindow = APIResponseMessage & {
    // tbd
}

export type APIRequestMessage = {
    type: string,
    methods: string[]
}

export const FDC3_API_REQUEST_MESSAGE_TYPE = 'FDC3-API-Request';
export const FDC3_API_RESPONSE_MESSAGE_TYPE = 'FDC3-API-Response';
export const FDC3_USER_CHANNELS_REQUEST_TYPE = 'FDC3-User-Channels-Request';
export const FDC3_USER_CHANNELS_RESPONSE_TYPE = 'FDC3-User-Channels-Response';
export const FDC3_PORT_TRANSFER_REQUEST_TYPE = 'FDC3-Port-Transfer-Request';
export const FDC3_PORT_TRANSFER_RESPONSE_TYPE = 'FDC3-Port-Transfer-Response';


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