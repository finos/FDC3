import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Channel, ContextHandler, DesktopAgent, getAgent, Listener } from '@finos/fdc3';
import {
  connectRemoteHandlers,
  createJosePublicFDC3SecurityFromUrl,
  MetadataHandlerImpl,
  PublicSignatureCheckingHandlerSupport,
  SecurityAwareContextHandler,
} from '@finos/fdc3-security';
import styles from './main.module.css';

const CONTEXT_TYPE = 'fdc3.instrument';

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

export const SignedReceiverComponent = () => {
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
    let instrumentListener: Listener | null = null;
    let userChannelListener: Listener | null = null;

    const pushLog = (line: string) => {
      setLogMessages(prev => [...prev, line]);
    };

    const teardownInstrumentListener = async () => {
      if (instrumentListener) {
        try {
          await instrumentListener.unsubscribe();
        } catch {
          /* ignore */
        }
        instrumentListener = null;
      }
    };

    const bindToUserChannel = async (channel: Channel | null) => {
      await teardownInstrumentListener();
      if (!channel) {
        setChannelId(null);
        setStatus('No user channel — select or join a channel in the desktop (same as the training Receive app).');
        return;
      }
      if (cancelled || !support) return;

      const id = channel.id ?? '(unknown)';
      setChannelId(id);
      setStatus(`Listening for signed ${CONTEXT_TYPE} on user channel ${id} (verification via jku in signature).`);

      const baseHandler: SecurityAwareContextHandler = async (ctx, meta, verified) => {
        pushLog('[VERIFIED] Context:\n' + prettyJson(ctx));
        pushLog('[VERIFIED] Metadata:\n' + prettyJson(meta));
        const auth = verified.authenticity;
        if (auth?.signed && auth.trusted) {
          pushLog('Verification: trusted; signer JWKS URL: ' + String(auth.jku ?? '(none)'));
        } else if (auth?.errors) {
          pushLog('Verification issues:\n' + prettyJson(auth.errors));
        }
      };

      const wrapped = (await support.wrapContextHandler(baseHandler)) as ContextHandler;
      instrumentListener = await channel.addContextListener(CONTEXT_TYPE, wrapped);
    };

    let support: PublicSignatureCheckingHandlerSupport | null = null;

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
        const metadataHandler = new MetadataHandlerImpl(false);
        support = new PublicSignatureCheckingHandlerSupport(metadataHandler, publicSecurity);

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
        await teardownInstrumentListener();
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
      <h2>Signed broadcast receiver</h2>
      <p className={styles.statusLine}>
        Same pattern as <code>signing-broadcast-example.ts</code> (App B):{' '}
        <code>PublicSignatureCheckingHandlerSupport</code> wraps a listener for <code>{CONTEXT_TYPE}</code> on the{' '}
        <strong>current user channel</strong>. Verification resolves the signer&apos;s keys from the <code>jku</code> in
        the signature (this app&apos;s JWKS is only used to construct the verifier; backend is default handlers +
        WebSocket).
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

root.render(<SignedReceiverComponent />);
