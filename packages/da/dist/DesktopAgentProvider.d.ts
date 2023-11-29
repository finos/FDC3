import { ImplementationMetadata, Listener } from "@finos/fdc3";
import { BroadcastAgentRequestMeta } from "@finos/fdc3/dist/bridging/BridgingTypes";
/**
 * NB: synchronous methods.
 */
export interface DesktopAgentProvider {
    getImplementationMetadata(): ImplementationMetadata;
    createListener(): Listener;
    createBroadcastMeta(): BroadcastAgentRequestMeta;
}
