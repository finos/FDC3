import { Channel, IntentHandler } from '@finos/fdc3-standard';

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
   *   returning `{ type: 'private' }` so the client opens a private channel and calls
   *   `handleRemoteChannel`, then runs `EncryptedBroadcastSupport` on the server.
   *
   * @param intent — The intent name the server should bind (must match the client’s
   *   `remoteIntentHandler` calls).
   */
  remoteIntentHandler(intent: string): Promise<IntentHandler>;

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
   *
   * @param purpose — Tells the server which operation this call represents; defined by your app.
   * @param o — The payload for that operation (for example `{ context }` or an object compatible with
   *   `fdc3.security.symmetricKeyResponse`).
   */
  exchangeData(purpose: string, o: object): Promise<object | void>;
}

/**
 * Default `FDC3Handlers` where every method is a no-op (or returns an empty handler) until you
 * override it. Extend this on the **high-trust** server and implement only the hooks your app uses.
 */
export class DefaultFDC3Handlers implements FDC3Handlers {
  async handleRemoteChannel(_purpose: string, _channel: Channel): Promise<void> {
    // Default: do nothing
  }

  async remoteIntentHandler(_intent: string): Promise<IntentHandler> {
    // Default: return a no-op handler
    return async () => {
      return;
    };
  }

  async exchangeData(_purpose: string, _o: object): Promise<object | void> {
    // Default: do nothing
    return;
  }
}
