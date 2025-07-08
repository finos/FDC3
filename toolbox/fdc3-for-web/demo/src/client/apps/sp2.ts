import {
  IntentResolution,
  PrivateChannel,
  SecuredDesktopAgent,
  Resolver,
  SIGNING_ALGORITHM_DETAILS,
  ClientSideImplementation,
  WRAPPING_ALGORITHM_KEY_PARAMS,
  getAgent,
  DesktopAgent,
  Context,
  ContextMetadata,
  ContextMetadataWithAuthenticity,
} from '@finos/fdc3';

let signingPrivateKey: CryptoKey | null = null;
let unwrappingPrivateKey: CryptoKey | null = null;
let privateChannel: PrivateChannel | null = null;
let sfdc3: SecuredDesktopAgent | null = null;
let fdc3: DesktopAgent | null = null;

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
  if (message.includes('<span class="encryption-badge')) {
    messageEl.innerHTML = message;
  } else {
    messageEl.textContent = message;
  }

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

// Helper function to get encryption status badge
function getEncryptionBadge(encryption: string): string {
  switch (encryption) {
    case 'decrypted':
      return '<span class="encryption-badge encryption-decrypted">🔓 Decrypted</span>';
    case 'cant_decrypt':
      return '<span class="encryption-badge encryption-cant-decrypt">🔒 Can\'t Decrypt: Requesting Private Channel Encryption Key</span>';
    default:
      return '<span class="encryption-badge encryption-not-encrypted">📄 Not Encrypted</span>';
  }
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

getAgent().then(fdc3Instance => {
  fdc3 = fdc3Instance;
  console.log('FDC3 is ready');

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
});

/**
 * Gets the private channel via a raise Intent then spools the output
 */
async function doIt() {
  // Clear the log and show fresh start
  const log = document.getElementById('log');
  if (log) {
    log.innerHTML = '';
  }

  createLogEntry('info', '🔗 Initiating Private Channel Request...', {
    action: 'Raising SecretComms intent',
    instrument: 'Abc123',
  });

  fetch('/sp2-private-key')
    .then(r => r.json())
    .then(j => setupKeys(j))
    .then(() => {
      const csi = new ClientSideImplementation();

      const resolver: Resolver = (u: string) => {
        return fetch(u).then(r => r.json());
      };

      if (!fdc3) {
        throw new Error('FDC3 is not ready');
      }

      sfdc3 = new SecuredDesktopAgent(
        fdc3,
        csi.initSigner(signingPrivateKey as CryptoKey, '/sp2-public-key'),
        csi.initUnwrapKey(unwrappingPrivateKey as CryptoKey, '/sp2-public-key'),
        resolver
      );

      createLogEntry('success', '🔐 Secured Desktop Agent initialized successfully', {
        signer: 'Active',
        unwrapper: 'Active',
        resolver: 'Configured',
      });

      sfdc3
        .raiseIntent('SecretComms', {
          type: 'fdc3.instrument',
          id: {
            isin: 'Abc123',
          },
        })
        .then((reso: IntentResolution) => {
          createLogEntry('success', `📨 Intent Resolution Received: ${reso.intent}`, {
            intent: reso.intent,
            source: JSON.stringify(reso.source),
            resolutionType: typeof reso.source,
          });

          reso.getResult().then(result => {
            if (result) {
              createLogEntry(
                'success',
                `🔗 Private Channel Established`,
                {
                  type: result.type,
                  id: result.id,
                  channelType: 'Private',
                },
                {
                  'Channel Type': result.type,
                  'Channel ID': String(result.id),
                  Status: 'Active',
                }
              );

              privateChannel = result as PrivateChannel;
              privateChannel.addContextListener('demo.counter', (ctx: Context, meta: ContextMetadata | undefined) => {
                const metaAuth = meta as ContextMetadataWithAuthenticity;
                const authStatus = getAuthenticityStatus(metaAuth);
                const encryption =
                  (metaAuth as ContextMetadataWithAuthenticity & { encryption?: string }).encryption || 'unknown';

                createLogEntry(
                  authStatus.status as 'success' | 'warning' | 'error',
                  `📤 Private Channel Message: ${formatContext(ctx)} ${getEncryptionBadge(encryption)}`,
                  {
                    context: ctx,
                    metadata: meta,
                    encryption: encryption,
                  }
                );
              });
            } else {
              createLogEntry('error', '❌ No result received from intent resolution', {
                intent: reso.intent,
                source: reso.source,
              });
            }
          });
        })
        .catch((error: Error) => {
          createLogEntry('error', '❌ Intent resolution failed', {
            error: error.message,
            intent: 'SecretComms',
          });
        });
    })
    .catch((error: Error) => {
      createLogEntry('error', '❌ Failed to initialize Secured Desktop Agent', {
        error: error.message,
        stack: error.stack,
      });
    });
}

window.addEventListener('load', () => {
  const broadcast = document.getElementById('raise');
  broadcast?.addEventListener('click', () => doIt());
});
