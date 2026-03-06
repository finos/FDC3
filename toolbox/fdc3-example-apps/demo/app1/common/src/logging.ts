// Shared logging utility for FDC3 demo apps

// Update status function
export function updateStatus(status: string, message: string): void {
  const statusEl = document.getElementById('status') as HTMLDivElement;
  if (statusEl) {
    statusEl.className = `status ${status}`;
    statusEl.textContent = message;
  }
}

// Clear log function
export function clearLog(): void {
  const log = document.getElementById('log');
  if (log) {
    log.innerHTML = '';
  }
}

export function createLogEntry(
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
export function formatContext(context: any): string {
  if (context.type === 'fdc3.instrument') {
    return `Instrument: ${context.id?.isin || 'Unknown ISIN'}`;
  } else if (context.type === 'demo.counter') {
    return `Counter: ${context.id?.bc || 'Unknown'}`;
  }
  return context.type;
}

// Helper function to check authenticity status
export function getAuthenticityStatus(metadata: any): { status: string; message: string } {
  const auth = metadata.authenticity;
  if (auth?.verified && 'valid' in auth && auth.valid && 'publicKeyUrl' in auth) {
    return { status: 'success', message: `✅ Verified from ${auth.publicKeyUrl}` };
  } else if (auth?.verified && 'valid' in auth && !auth.valid && 'publicKeyUrl' in auth) {
    return { status: 'error', message: `❌ Verification failed for ${auth.publicKeyUrl}` };
  } else {
    return { status: 'warning', message: '⚠️ No authenticity verification' };
  }
}
