import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Channel, DesktopAgent, getAgent, Listener } from '@finos/fdc3';
import { connectRemoteHandlers } from '@finos/fdc3-security';
import styles from './main.module.css';

/** Must match `SIGNED_BROADCAST_TRIGGER` in `backend.ts`. */
const SIGNED_BROADCAST_TRIGGER = 'send-signed-fdc3-instrument';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

type RemoteHandlers = Awaited<ReturnType<typeof connectRemoteHandlers>> & {
  disconnect(): Promise<void>;
};

/**
 * Frontend for the signed-sender app.
 *
 * Security flow:
 * 1. On mount, connects to the backend WebSocket via `connectRemoteHandlers`.
 * 2. When the user joins a channel, exports it to the backend via
 *    `handleRemoteChannel('broadcast', channel)`. The backend wraps it with
 *    `BasicSignedBroadcaster` — signing happens server-side so the private key
 *    never enters the browser.
 * 3. On button press, calls `exchangeData(SIGNED_BROADCAST_TRIGGER)` which asks
 *    the backend to sign and broadcast a sample `fdc3.instrument`.
 * 4. Receivers can verify the signature using the `jku` URL embedded in each
 *    message's JWS protected header — no pre-configuration required.
 */
export const SignedSenderComponent = () => {
  const [status, setStatus] = useState('Connecting to desktop agent…');
  const [channelId, setChannelId] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const remoteHandlersRef = useRef<RemoteHandlers | null>(null);

  const pushLog = useCallback((line: string) => {
    setLogMessages(prev => [...prev, line]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let remoteHandlers: RemoteHandlers | null = null;
    let agent: DesktopAgent | null = null;
    let userChannelListener: Listener | null = null;

    /** Exports the current user channel to the backend for signed broadcasting.
     * If channel is null (user left the channel), clears ready state. */
    const exportChannelToBackend = async (channel: Channel | null) => {
      const rh = remoteHandlersRef.current;
      if (!rh) return;
      if (!channel) {
        setChannelId(null);
        setReady(false);
        setStatus('No user channel — select or join a channel in the desktop (same as the training Receive app).');
        return;
      }
      if (cancelled) return;
      try {
        await rh.handleRemoteChannel('broadcast', channel);
        setChannelId(channel.id ?? null);
        setReady(true);
        setStatus(
          `User channel exported to backend — signing happens server-side (BasicSignedBroadcaster). Channel: ${channel.id ?? '?'}.`
        );
        pushLog(`Exported channel ${channel.id} to backend for signed broadcasts.`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setReady(false);
        setStatus('Failed to export channel: ' + msg);
        pushLog('Export failed: ' + msg);
      }
    };

    /** Re-exports the channel whenever the user switches to a different one. */
    const onUserChannelChanged = () => {
      void (async () => {
        if (!agent || cancelled) return;
        const ch = await agent.getCurrentChannel();
        await exportChannelToBackend(ch);
      })();
    };

    void (async () => {
      try {
        agent = await getAgent();
        if (cancelled) return;

        setStatus('Connecting secure backend (WebSocket)…');
        remoteHandlers = await connectRemoteHandlers(wsUrlForPage(), agent, async () => {});
        remoteHandlersRef.current = remoteHandlers;
        if (cancelled) {
          await remoteHandlers.disconnect();
          remoteHandlersRef.current = null;
          return;
        }

        setStatus('Waiting for user channel…');
        userChannelListener = await agent.addEventListener('userChannelChanged', () => {
          onUserChannelChanged();
        });
        const initial = await agent.getCurrentChannel();
        await exportChannelToBackend(initial);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setStatus('Error: ' + msg);
        pushLog('Error: ' + msg);
        setReady(false);
        remoteHandlersRef.current = null;
      }
    })();

    return () => {
      cancelled = true;
      remoteHandlersRef.current = null;
      void (async () => {
        if (userChannelListener) {
          try {
            await userChannelListener.unsubscribe();
          } catch {
            /* ignore */
          }
        }
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

  const sendSignedInstrument = async () => {
    const rh = remoteHandlersRef.current;
    if (!rh || !ready) return;
    try {
      const result = (await rh.exchangeData(SIGNED_BROADCAST_TRIGGER, {})) as {
        ok?: boolean;
        error?: string;
      };
      if (result?.ok) {
        pushLog('Backend signed and broadcast fdc3.instrument (AAPL) on the user channel.');
      } else {
        pushLog('Backend response: ' + JSON.stringify(result));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      pushLog('exchangeData failed: ' + msg);
    }
  };

  return (
    <div className={styles.broadcastComponent}>
      <h2>Signed broadcast sender</h2>
      <p className={styles.statusLine}>
        Same pattern as <code>signing-broadcast-example.ts</code> (App A): the <strong>current user channel</strong> is
        exported to this app&apos;s backend via <code>handleRemoteChannel(&apos;broadcast&apos;, …)</code>. The backend
        wraps it with <code>BasicSignedBroadcaster</code> and signs on the server. Use the button to broadcast a sample{' '}
        <code>fdc3.instrument</code>.
      </p>
      <div className={styles.channelInfo}>User channel: {channelId ?? '—'}</div>
      <div className={styles.channelInfo}>{status}</div>
      <button type="button" className={styles.broadcast} disabled={!ready} onClick={() => void sendSignedInstrument()}>
        Sign &amp; broadcast sample instrument
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

root.render(<SignedSenderComponent />);
