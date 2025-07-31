import {
  Context,
  ContextMetadata,
  SecuredDesktopAgent,
  Resolver,
  SIGNING_ALGORITHM_DETAILS,
  WRAPPING_ALGORITHM_KEY_PARAMS,
  ClientSideImplementation,
  SYMMETRIC_KEY_REQUEST_CONTEXT,
  ContextMetadataWithAuthenticity,
  getAgent,
} from '@finos/fdc3';

let signingPrivateKey: CryptoKey | null = null;
let unwrappingPrivateKey: CryptoKey | null = null;

const resolver: Resolver = (u: string) => {
  return fetch(u).then(r => r.json());
};

async function setupKeys(j: JsonWebKey[]): Promise<void> {
  signingPrivateKey = await crypto.subtle.importKey('jwk', j[0], SIGNING_ALGORITHM_DETAILS, true, ['sign']);
  unwrappingPrivateKey = await crypto.subtle.importKey('jwk', j[1], WRAPPING_ALGORITHM_KEY_PARAMS, true, ['unwrapKey']);
}

// Helper function to create beautiful log entries
function createLogEntry(
  type: 'success' | 'warning' | 'error' | 'info',
  message: string,
  details?: unknown,
  channelInfo?: Record<string, string>
) {
  const log = document.getElementById('log');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;

  const timestamp = document.createElement('div');
  timestamp.className = 'log-timestamp';
  timestamp.textContent = new Date().toLocaleTimeString();

  const messageEl = document.createElement('div');
  messageEl.className = 'log-message';
  messageEl.textContent = message;

  entry.appendChild(timestamp);
  entry.appendChild(messageEl);

  if (details) {
    const detailsEl = document.createElement('div');
    detailsEl.className = 'log-details collapsed';
    detailsEl.textContent = typeof details === 'string' ? details : JSON.stringify(details, null, 2);

    const expandBtn = document.createElement('button');
    expandBtn.className = 'expand-btn';
    expandBtn.textContent = 'Show Details';
    expandBtn.onclick = () => {
      if (detailsEl.classList.contains('collapsed')) {
        detailsEl.classList.remove('collapsed');
        expandBtn.textContent = 'Hide Details';
      } else {
        detailsEl.classList.add('collapsed');
        expandBtn.textContent = 'Show Details';
      }
    };

    entry.appendChild(detailsEl);
    entry.appendChild(expandBtn);
  }

  if (channelInfo) {
    const channelInfoEl = document.createElement('div');
    channelInfoEl.className = 'channel-info';

    Object.entries(channelInfo).forEach(([key, value]) => {
      const infoCard = document.createElement('div');
      infoCard.className = 'info-card';
      infoCard.innerHTML = `
        <div class="info-label">${key}:</div>
        <div class="info-value">${value}</div>
      `;
      channelInfoEl.appendChild(infoCard);
    });

    entry.appendChild(channelInfoEl);
  }

  log?.appendChild(entry);
  log?.scrollTo(0, log.scrollHeight);
}

// Helper function to format context data nicely
function formatContext(context: Context): string {
  if (context.type === 'fdc3.instrument') {
    return `Instrument: ${context.id?.isin || 'Unknown ISIN'}`;
  } else if (context.type === 'demo.counter') {
    return `Counter: ${context.id?.bc || 'Unknown'}`;
  }
  return context.type;
}

// Helper function to check authenticity status
function getAuthenticityStatus(metadata: ContextMetadataWithAuthenticity): { status: string; message: string } {
  const auth = metadata.authenticity;
  if (auth?.verified && 'valid' in auth && auth.valid && 'publicKeyUrl' in auth) {
    return { status: 'success', message: `✅ Verified from ${auth.publicKeyUrl}` };
  } else if (auth?.verified && 'valid' in auth && !auth.valid && 'publicKeyUrl' in auth) {
    return { status: 'error', message: `❌ Verification failed for ${auth.publicKeyUrl}` };
  } else {
    return { status: 'warning', message: '⚠️ No authenticity verification' };
  }
}

getAgent().then(fdc3 => {
  // Clear the initial log and show fresh start
  const log = document.getElementById('log');
  if (log) {
    log.innerHTML = '';
  }

  // Update status to connected
  (window as unknown as { updateStatus: (status: string, message: string) => void }).updateStatus(
    'connected',
    'Connected to FDC3 Agent'
  );

  // Show initialization message
  createLogEntry('info', '🚀 FDC3 Security Demo Starting...', {
    status: 'Initializing secured desktop agent',
    timestamp: new Date().toISOString(),
  });

  fetch('/sp1-private-key')
    .then(r => r.json())
    .then(j => setupKeys(j))
    .then(() => {
      const csi = new ClientSideImplementation();

      return new SecuredDesktopAgent(
        fdc3,
        csi.initSigner(signingPrivateKey as CryptoKey, '/sp1-public-key'),
        csi.initUnwrapKey(unwrappingPrivateKey as CryptoKey, '/sp1-public-key'),
        resolver
      );
    })
    .then(async efdc3 => {
      console.log('in promise');
      createLogEntry('success', '🔐 Secured Desktop Agent initialized successfully', {
        signer: 'Active',
        unwrapper: 'Active',
        resolver: 'Configured',
      });

      efdc3.addIntentListener('SecretComms', async (context: Context, metadata: ContextMetadata | undefined) => {
        const authMetadata = metadata as ContextMetadataWithAuthenticity;
        const authStatus = getAuthenticityStatus(authMetadata);

        createLogEntry(
          authStatus.status as 'success' | 'warning' | 'error',
          `📨 Received SecretComms Intent: ${formatContext(context)}`,
          {
            context: context,
            metadata: metadata,
            source: authMetadata.source,
          }
        );

        const authenticity = authMetadata.authenticity;

        if (
          authenticity?.verified &&
          'valid' in authenticity &&
          authenticity.valid &&
          'publicKeyUrl' in authenticity &&
          authenticity.publicKeyUrl == '/sp2-public-key'
        ) {
          const pc = await efdc3.createPrivateChannel();
          pc.setChannelEncryption(true);

          createLogEntry(
            'success',
            '🔗 Private Channel Created Successfully',
            {
              channelId: pc.id,
              encryption: 'Enabled',
              type: pc.type,
            },
            {
              'Channel ID': pc.id,
              'Channel Type': pc.type,
              Encryption: 'Enabled',
            }
          );

          let broadcastCount = 0;

          pc.addContextListener('demo.counter', (ctx: Context, meta: ContextMetadata | undefined) => {
            const metaAuth = meta as ContextMetadataWithAuthenticity;
            const authStatus = getAuthenticityStatus(metaAuth);

            createLogEntry(
              authStatus.status as 'success' | 'warning' | 'error',
              `📤 Broadcast #${ctx.id?.bc}: ${formatContext(ctx)}`,
              {
                context: ctx,
                metadata: meta,
              }
            );
          });

          pc.addContextListener(
            SYMMETRIC_KEY_REQUEST_CONTEXT,
            async (_context: Context, meta: ContextMetadataWithAuthenticity | undefined) => {
              if (!meta) return;

              const authStatus = getAuthenticityStatus(meta);

              createLogEntry(
                authStatus.status as 'success' | 'warning' | 'error',
                '🔑 Symmetric Key Request Received',
                {
                  context: _context,
                  metadata: meta,
                }
              );

              if (
                meta.authenticity?.verified &&
                'valid' in meta.authenticity &&
                meta.authenticity.valid &&
                'publicKeyUrl' in meta.authenticity
              ) {
                pc.broadcastKey(meta.authenticity.publicKeyUrl);
                createLogEntry('success', '🔑 Symmetric Key Broadcasted', {
                  target: meta.authenticity.publicKeyUrl,
                  status: 'Key shared successfully',
                });
              }
            }
          );

          setTimeout(() => {
            broadcastCount++;
            const outContext = {
              type: 'demo.counter',
              id: {
                bc: broadcastCount,
              },
              original: context,
            } as Context;
            pc.broadcast(outContext);
            createLogEntry('info', `⏰ Scheduled broadcast #${broadcastCount} in 2 seconds`);
          }, 2000);

          setTimeout(() => {
            broadcastCount++;
            const outContext = {
              type: 'demo.counter',
              id: {
                bc: broadcastCount,
              },
              original: context,
            } as Context;
            pc.broadcast(outContext);
            createLogEntry('info', `⏰ Scheduled broadcast #${broadcastCount} in 5 seconds`);
          }, 5000);

          return pc;
        } else {
          // signature check failed
          const receivedKey = authenticity && 'publicKeyUrl' in authenticity ? authenticity.publicKeyUrl : 'None';
          const isValid = authenticity && 'valid' in authenticity ? authenticity.valid : false;

          createLogEntry('error', '❌ Authentication Failed - Not from SP2', {
            expected: '/sp2-public-key',
            received: receivedKey,
            verified: authenticity?.verified || false,
            valid: isValid,
          });
          return undefined;
        }
      });
    })
    .catch((error: Error) => {
      (window as unknown as { updateStatus: (status: string, message: string) => void }).updateStatus(
        'error',
        'Connection Failed'
      );
      createLogEntry('error', '❌ Failed to initialize Secured Desktop Agent', {
        error: error.message,
        stack: error.stack,
      });
    });
});
