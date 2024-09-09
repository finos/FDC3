/**
 * Web Connection Protocol (WCP) is used to establish connectivity between "@kite9/fdc3" and Browser-Resident DAs.
 */

import { AppMetadata } from "../api/AppMetadata";
import { DesktopAgentDetails } from "../api/GetAgent";
import { ImplementationMetadata } from "../api/ImplementationMetadata";

export type WCPHandshake = {
    type: "handshake",
    payload: {
        nonce: string;
    }
}

// Note, the MessagePort is _transferred_ using postMessage. It is not included in the response packet.
export type WCPHandshakeResponse = {
    type: "handshakeResponse",
    payload: {
        nonce: string;
        // If set, then getAgent() will open a hidden iframe and restart negotiation with that frame
        url?: string;
    }
}

export type WCPValidateAppIdentity = {
    type: "validateAppIdentity",
    payload: {
        desktopAgentDetails?: DesktopAgentDetails;
    }
}

export type WCPValidateAppIdentityResponse = {
    type: "validateAppIdentityResponse",
    payload: {
        desktopAgentDetails: DesktopAgentDetails;
        appMetaData: AppMetadata;
        implementationMetadata: ImplementationMetadata;
    } | {
        error: string;
    }
}