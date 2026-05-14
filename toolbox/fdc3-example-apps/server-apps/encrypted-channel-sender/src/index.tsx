import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Channel, Context, DesktopAgent, getAgent, Listener } from '@finos/fdc3';
import {
  connectRemoteHandlers,
  createJosePublicFDC3SecurityFromUrl,
  EncryptedBroadcaster,
  EncryptedBroadcastSupport,
  MetadataHandlerImpl,
} from '@finos/fdc3-security';
import styles from './main.module.css';

/** Inner context type after decryption (must match receiver listener). */
const PAYLOAD_CONTEXT_TYPE = 'test.encrypted';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

export const EncryptedBroadcastComponent = () => {
  const [status, setStatus] = useState('Connecting to desktop agent…');
  const [channelId, setChannelId] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const broadcasterRef = useRef<EncryptedBroadcaster | null>(null);
  const sendCountRef = useRef(0);

  const pushLog = useCallback((line: string) => {
    setLogMessages(prev => [...prev, line]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let remoteHandlers:
      | (Awaited<ReturnType<typeof connectRemoteHandlers>> & {
          disconnect(): Promise<void>;
        })
      | null = null;
    let agent: DesktopAgent | null = null;
    let broadcaster: EncryptedBroadcaster | null = null;
    let userChannelListener: Listener | null = null;

    const shutdownBroadcaster = async () => {
      broadcasterRef.current = null;
      if (broadcaster) {
        try {
          await broadcaster.shutdown();
        } catch {
          /* ignore */
        }
        broadcaster = null;
      }
    };

    const bindToUserChannel = async (channel: Channel | null) => {
      await shutdownBroadcaster();
      if (!channel) {
        setChannelId(null);
        setReady(false);
        setStatus('No user channel — select or join a channel in the desktop (same as the training Receive app).');
        return;
      }
      if (cancelled) return;

      const id = channel.id ?? '(unknown)';
      setChannelId(id);

      const support = new EncryptedBroadcastSupport(publicSecurity, metadataHandler);
      const next = await support.broadcastWrapper(channel);
      if (cancelled) {
        try {
          await next.shutdown();
        } catch {
          /* ignore */
        }
        return;
      }
      broadcaster = next;
      broadcasterRef.current = next;
      setReady(true);
      setStatus(
        `Ready on user channel ${id} — broadcasts encrypted ${PAYLOAD_CONTEXT_TYPE} on this channel (symmetric key in this tab).`
      );
    };

    let publicSecurity!: Awaited<ReturnType<typeof createJosePublicFDC3SecurityFromUrl>>;
    const metadataHandler = new MetadataHandlerImpl(false);

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
        publicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);

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
        setReady(false);
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
        await shutdownBroadcaster();
        if (remoteHandlers) {
          try {
            await remoteHandlers.disconnect();
          } catch {
            /* ignore */
          }
        }
      })();
    };
  }, [pushLog]);

  const sendEncryptedTest = async () => {
    const b = broadcasterRef.current;
    if (!b || !ready) return;

    sendCountRef.current += 1;
    const n = sendCountRef.current;
    const ctx = { type: PAYLOAD_CONTEXT_TYPE, id: { num: n } } as Context;

    try {
      await b.broadcast(ctx);
      pushLog(`Sent encrypted ${PAYLOAD_CONTEXT_TYPE}: ${JSON.stringify(ctx)}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      pushLog('Broadcast failed: ' + msg);
    }
  };

  return (
    <div className={styles.broadcastComponent}>
      <h2>Encrypted channel sender</h2>
      <p className={styles.statusLine}>
        Uses the <strong>current user channel</strong> (<code>getCurrentChannel</code> / <code>userChannelChanged</code>
        ), like the training Receive app. Broadcasts <code>{PAYLOAD_CONTEXT_TYPE}</code> as{' '}
        <code>fdc3.security.encryptedContext</code>. This app&apos;s backend only exposes JWKS and the secure-boundary
        WebSocket.
      </p>
      <div className={styles.channelInfo}>User channel: {channelId ?? '—'}</div>
      <div className={styles.channelInfo}>{status}</div>
      <button type="button" className={styles.broadcast} disabled={!ready} onClick={() => void sendEncryptedTest()}>
        Send encrypted test message
      </button>
      <div className={styles.sendLog}>
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

root.render(<EncryptedBroadcastComponent />);
