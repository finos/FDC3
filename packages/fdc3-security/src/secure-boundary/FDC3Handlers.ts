import { Channel, ContextMetadata, ContextWithMetadata, PrivateChannel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

/**
 * Sentinel returned by a backend `remoteIntentHandler` implementation to signal that the
 * frontend should create a `PrivateChannel` and export it to the backend via
 * `handleRemoteChannel`. The value `{ type: 'private' }` is a secure-boundary-internal
 * protocol token — it is never transmitted over FDC3 or seen by the Desktop Agent.
 */
export type PrivateChannelSignal = { type: 'private' };

/** The constant sentinel value — use this instead of an inline object literal. */
export const PRIVATE_CHANNEL_SIGNAL: PrivateChannelSignal = { type: 'private' };

/**
 * Handler type for use in backend `remoteIntentHandler` implementations. Similar to the
 * FDC3 `IntentHandler` signature but with the return type widened to include
 * `PrivateChannelSignal` so backend implementations can return the sentinel without casting.
 */
export type BackendIntentHandler = (
  context: Context,
  metadata: ContextMetadata
) => Promise<Context | ContextWithMetadata | PrivateChannel | Channel | PrivateChannelSignal | void> | void;

/**
 * Contract for **application** code that must run in a high-trust environment (private keys,
 * JWS/JWE, symmetric key material).
 *
 * Two library modules implement opposite sides of the same wire protocol:
 *
 * - **`ClientSideHandlersImpl`** — Implements `FDC3Handlers` on the **low-trust** side as a
 *   remote stub. {@link connectRemoteHandlers} constructs it over a WebSocket.
 *
 * - **`ServerSideHandlersImpl`** `setupWebsocketServer` takes an implementation of `FDC3Handlers` .
 *   to run on the **high-trust** server side.
 *
 */
export interface FDC3Handlers {
  /**
   * Called on the client so that the server has a version of the channel to which it can attach
   * listeners and broadcast from the **high-trust** part of the application. This means you can attach
   * signing or encryption helpers that need private keys.
   *
   * **Samples**
   * - `signing-broadcast-example.ts` — shows how you can wrap the channel on the server side with
   *   `BasicSignedBroadcaster` so every broadcast is JWS-signed on the server.
   * - `backend-encrypted-channel-example.ts` — shows how you can use `EncryptedBroadcastSupport` to
   *   encrypt context on the backend and send across FDC3.
   *
   * @param purpose — Allows the client to tell the server the purpose for which it is sharing the
   *   channel. This is up to applications to define and use.
   * @param channel — Proxy `Channel`/`PrivateChannel` bridged from the client agent.
   */
  handleRemoteChannel(purpose: string, channel: Channel): Promise<void>;

  /**
   * Called on the client so that the server can provide the real `IntentHandler` for a given intent
   * name. You `await handlers.remoteIntentHandler(intent)` once to register; every later call with
   * `(context, metadata)` runs on the **high-trust** side over the WebSocket.
   *
   * **Samples**
   * - `get-user-example.ts` — shows how you can handle `GetUser`: take
   *   `fdc3.security.userRequest`, mint a JWT, build `fdc3.security.user`, encrypt for the requestor’s
   *   JWKS, and return `fdc3.security.encryptedContext`.
   * - `signing-intent-example.ts` — shows how you can wire `DataTransfer` with
   *   `PublicSignatureCheckingHandlerSupport` and `PrivateSignedIntentResultSupport` so the handler
   *   verifies the raiser’s JWS and signs the response (the raiser signs its outbound context via
   *   `exchangeData` instead of holding the private key in the browser).
   * - `backend-encrypted-channel-example.ts` — shows how you can handle `ShareEncryptedChannel` by
   *   returning `PRIVATE_CHANNEL_SIGNAL` so the client opens a private channel and calls
   *   `handleRemoteChannel`, then runs `EncryptedBroadcastSupport` on the server.
   *
   * @param intent — The intent name the server should bind (must match the client’s
   *   `remoteIntentHandler` calls).
   */
  remoteIntentHandler(intent: string): Promise<BackendIntentHandler>;

  /**
   * A convenience function.  Called on the client so that the server can return it items of data it needs. The client calls
   * `handlers.exchangeData(purpose, o)`; the server returns an object or `void`. Use stable `purpose`
   * strings so both sides agree on the payload shape.
   *
   * **Samples**
   * - `signing-intent-example.ts` — shows how you can implement `sign-context` when raising an intent so the browser
   *   never sees the private key.
   * - `frontend-encrypted-channel-example.ts` — shows how you can implement `sign-context` and
   *   `unwrap-symmetric-key` on the receiver backend so key-request signing and symmetric-key
   *   unwrapping stay off the frontend (`fdc3.security.symmetricKeyResponse` in, unwrapped JWK out).
   * - `get-user-example.ts` — also implements `get-user-identity` on the requesting backend so JWE decryption,
   *   JWT verification, and projection to `fdc3.contact` stay server-side (the JWT never reaches the client).
   *
   * @param purpose — Tells the server which operation this call represents; defined by your app.
   * @param payload — The payload for that operation (for example `{ context }` or an object compatible with
   *   `fdc3.security.symmetricKeyResponse`).
   */
  exchangeData(purpose: string, payload: unknown): Promise<unknown>;
}

/**
 * Default `FDC3Handlers` where every method is a no-op (or returns an empty handler) until you
 * override it. Extend this on the **high-trust** server and implement only the hooks your app uses.
 */
export class DefaultFDC3Handlers implements FDC3Handlers {
  async handleRemoteChannel(_purpose: string, _channel: Channel): Promise<void> {
    return;
  }

  async remoteIntentHandler(_intent: string): Promise<BackendIntentHandler> {
    return async () => undefined;
  }

  async exchangeData(_purpose: string, _payload: unknown): Promise<unknown> {
    return undefined;
  }
}
