import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Channel, DesktopAgent, getAgent, Listener } from '@finos/fdc3';
import type { Context } from '@finos/fdc3-context';
import {
  connectRemoteHandlers,
  createJosePublicFDC3SecurityFromUrl,
  createMetadataHandler,
  JsonWebKeyWithId,
  PublicEncryptedContextListenerSupport,
  SecurityAwareContextHandler,
  type SigningFunction,
} from '@finos/fdc3-security';
import styles from './main.module.css';

/** Plain context type inside encrypted envelopes (must match sender). */
const DECRYPTED_CONTEXT_TYPE = 'test.encrypted';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

function prettyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * Frontend for the encrypted-channel-receiver app (FRONTEND KEY pattern).
 *
 * Security flow:
 * 1. On mount, connects to the backend WebSocket and constructs a
 *    `PublicEncryptedContextListenerSupport` instance.
 * 2. When the user joins a channel, calls `support.addContextListener` with a
 *    `SecurityAwareContextHandler`. The support layer intercepts incoming
 *    `fdc3.security.encryptedContext` broadcasts and automatically handles key
 *    exchange when needed:
 *    a. Signs `fdc3.security.symmetricKeyRequest` via the backend (`sign-context`).
 *    b. Receives the wrapped key response and unwraps it via the backend
 *       (`unwrap-symmetric-key`), returning the symmetric key to the frontend.
 *    c. Decrypts each subsequent payload in the browser using the symmetric key.
 * 3. The handler receives the decrypted context and `ContextVerificationMetadata`
 *    (with `encryption: 'decrypted'`) as a typed third argument.
 */
export const EncryptedReceiveComponent = () => {
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Connecting to desktop agent…');

  useEffect(() => {
    let cancelled = false;
    let remoteHandlers:
      | (Awaited<ReturnType<typeof connectRemoteHandlers>> & {
          disconnect(): Promise<void>;
        })
      | null = null;
    let agent: DesktopAgent | null = null;
    let encryptedListener: Listener | null = null;
    let userChannelListener: Listener | null = null;
    let support: PublicEncryptedContextListenerSupport | null = null;

    const pushLog = (line: string) => {
      setLogMessages(prev => [...prev, line]);
    };

    /** Unsubscribes the encrypted context listener when the channel changes. */
    const teardownEncryptedListener = async () => {
      if (encryptedListener) {
        try {
          await encryptedListener.unsubscribe();
        } catch {
          /* ignore */
        }
        encryptedListener = null;
      }
    };

    /**
     * Attaches `PublicEncryptedContextListenerSupport` to the given channel.
     * The support layer handles key requests/responses automatically; the handler
     * is only called once each message is successfully decrypted.
     */
    const bindToUserChannel = async (channel: Channel | null) => {
      await teardownEncryptedListener();
      if (!channel) {
        setChannelId(null);
        setStatus('No user channel — select or join a channel in the desktop (same as the training Receive app).');
        return;
      }
      if (cancelled || !support || !remoteHandlers) return;

      const id = channel.id ?? '(unknown)';
      setChannelId(id);
      setStatus(`Listening for encrypted → ${DECRYPTED_CONTEXT_TYPE} on user channel ${id}`);

      const decryptedHandler: SecurityAwareContextHandler = (ctx, _meta, verification) => {
        pushLog('Decrypted:\n' + prettyJson(ctx));
        if (verification.encryption === 'decrypted') {
          pushLog('(metadata: decryption performed on front-end)');
        }
      };
      encryptedListener = await support.addContextListener(channel, DECRYPTED_CONTEXT_TYPE, decryptedHandler);
    };

    /** Re-binds the listener whenever the user switches to a different channel. */
    const onUserChannelChanged = () => {
      void (async () => {
        if (!agent || cancelled) return;
        const ch = await agent.getCurrentChannel();
        await bindToUserChannel(ch);
      })();
    };

    void (async () => {
      try {
        agent = await getAgent();
        if (cancelled) return;

        setStatus('Connecting secure backend (WebSocket)…');
        remoteHandlers = await connectRemoteHandlers(wsUrlForPage(), agent, async () => {});
        if (cancelled) {
          await remoteHandlers.disconnect();
          return;
        }

        const jwksUrl = `${window.location.origin}/.well-known/jwks.json`;
        const publicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);
        const metadataHandler = await createMetadataHandler(agent);

        // signingFunction: delegates signing of symmetricKeyRequest to the backend
        // (private key must not enter the browser).
        const signingFunction: SigningFunction = async (context: Context) => {
          const result = await remoteHandlers!.exchangeData('sign-context', { context });
          if (!result || typeof result !== 'object') {
            throw new Error('Backend sign-context failed');
          }
          return result as Awaited<ReturnType<SigningFunction>>;
        };

        // unwrapFunction: delegates JWE key unwrapping to the backend. The unwrapped
        // symmetric key is returned to the frontend for fast per-message decryption.
        const unwrapFunction = async (skr: object): Promise<JsonWebKeyWithId> => {
          const result = await remoteHandlers!.exchangeData('unwrap-symmetric-key', skr);
          if (!result || typeof result !== 'object') {
            throw new Error('Backend unwrap-symmetric-key failed');
          }
          return result as JsonWebKeyWithId;
        };

        support = new PublicEncryptedContextListenerSupport(
          publicSecurity,
          metadataHandler,
          signingFunction,
          unwrapFunction
        );

        setStatus('Waiting for user channel…');
        userChannelListener = await agent.addEventListener('userChannelChanged', () => {
          onUserChannelChanged();
        });
        const initial = await agent.getCurrentChannel();
        await bindToUserChannel(initial);

        pushLog('Listening for user channel changes (getCurrentChannel + userChannelChanged).');
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setStatus('Error: ' + msg);
        pushLog('Error: ' + msg);
      }
    })();

    return () => {
      cancelled = true;
      void (async () => {
        if (userChannelListener) {
          try {
            await userChannelListener.unsubscribe();
          } catch {
            /* ignore */
          }
        }
        await teardownEncryptedListener();
        if (remoteHandlers) {
          try {
            await remoteHandlers.disconnect();
          } catch {
            /* ignore */
          }
        }
      })();
    };
  }, []);

  return (
    <div className={styles.receiveComponent}>
      <h2>Encrypted channel receiver</h2>
      <p className={styles.statusLine}>
        Uses the <strong>current user channel</strong> (<code>getCurrentChannel</code> / <code>userChannelChanged</code>
        ). Decrypted <code>{DECRYPTED_CONTEXT_TYPE}</code> from <code>fdc3.security.encryptedContext</code>. Signing and
        key unwrap use this app&apos;s backend via <code>exchangeData</code>.
      </p>
      <div className={styles.channelInfo}>User channel: {channelId ?? '—'}</div>
      <div className={styles.channelInfo}>{status}</div>
      <div id="log" className={styles.receiveLog}>
        {logMessages.map((msg, index) => (
          <p className={styles.message} key={index}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<EncryptedReceiveComponent />);
