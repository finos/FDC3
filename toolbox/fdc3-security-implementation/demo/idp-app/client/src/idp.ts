// IDP App Client Implementation
import * as FDC3 from '@finos/fdc3';

// Authentication state
let isAuthenticated = false;
let currentUser: { id: string; name: string } | null = null;

// DOM elements - will be initialized after DOM is loaded
let loginBtn: HTMLButtonElement | null = null;
let logoutBtn: HTMLButtonElement | null = null;
let userInfo: HTMLDivElement | null = null;
let userName: HTMLSpanElement | null = null;
let statusEl: HTMLDivElement | null = null;

// Check authentication status on page load
async function checkAuthStatus(): Promise<void> {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();

    if (data.isAuthenticated) {
      isAuthenticated = true;
      currentUser = data.user;
      showAuthenticatedState();
      addLogEntry('info', 'User authenticated', `Logged in as: ${currentUser?.name} (${currentUser?.id})`);
    } else {
      isAuthenticated = false;
      currentUser = null;
      showUnauthenticatedState();
      addLogEntry('info', 'User not authenticated', 'Please log in to continue');
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    addLogEntry('error', 'Authentication check failed', (error as Error).message);
  }
}

// Login function
async function login(): Promise<void> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      isAuthenticated = true;
      currentUser = data.user;
      showAuthenticatedState();
      addLogEntry('success', 'Login successful', `Welcome, ${currentUser?.name}!`);
    } else {
      addLogEntry('error', 'Login failed', 'Failed to authenticate user');
    }
  } catch (error) {
    console.error('Login error:', error);
    addLogEntry('error', 'Login error', (error as Error).message);
  }
}

// Logout function
async function logout(): Promise<void> {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      isAuthenticated = false;
      currentUser = null;
      showUnauthenticatedState();
      addLogEntry('info', 'Logout successful', 'You have been logged out');
    } else {
      addLogEntry('error', 'Logout failed', 'Failed to log out');
    }
  } catch (error) {
    console.error('Logout error:', error);
    addLogEntry('error', 'Logout error', (error as Error).message);
  }
}

// Show authenticated state
function showAuthenticatedState(): void {
  if (loginBtn) loginBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'inline-block';
  if (userInfo) userInfo.style.display = 'block';
  if (userName && currentUser) userName.textContent = currentUser.name;
}

// Show unauthenticated state
function showUnauthenticatedState(): void {
  if (loginBtn) loginBtn.style.display = 'inline-block';
  if (logoutBtn) logoutBtn.style.display = 'none';
  if (userInfo) userInfo.style.display = 'none';
}

// Add log entry
function addLogEntry(type: string, message: string, details: string = ''): void {
  const log = document.getElementById('log');
  if (!log) return;

  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  logEntry.innerHTML = `
    <div class="log-timestamp">${timestamp}</div>
    <div class="log-message">${message}</div>
    ${details ? `<div class="log-details">${details}</div>` : ''}
  `;
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
}

// Update status
function updateStatus(status: string, message: string): void {
  if (!statusEl) return;
  statusEl.className = `status-indicator status-${status}`;
  statusEl.innerHTML = `<span class="status-dot">●</span>${message}`;
}

// Clear log
function clearLog(): void {
  const log = document.getElementById('log');
  if (!log) return;
  log.innerHTML = `<div class="log-entry info"><div class="log-timestamp">${new Date().toLocaleTimeString()}</div><div class="log-message">Log cleared</div></div>`;
}

// FDC3 Integration
async function initializeFDC3(): Promise<void> {
  try {
    updateStatus('connecting', 'Connecting to FDC3...');

    // Get the Desktop Agent
    const agent = await FDC3.getAgent();

    updateStatus('connected', 'Connected to FDC3');
    addLogEntry('success', 'FDC3 Connected', 'Successfully connected to FDC3 Desktop Agent');

    // Set up event listeners for FDC3 events
    setupFDC3Listeners(agent);
  } catch (error) {
    console.error('FDC3 connection error:', error);
    updateStatus('error', 'FDC3 Connection Failed');
    addLogEntry('error', 'FDC3 Connection Failed', (error as Error).message);
  }
}

// Setup FDC3 event listeners
function setupFDC3Listeners(agent: any): void {
  // Listen for GetUser intent events
  agent.addIntentListener('GetUser', (intent: any) => {
    addLogEntry('info', 'GetUser Intent Received', JSON.stringify(intent, null, 2));

    // Handle the GetUser intent by returning the current user information
    if (isAuthenticated && currentUser) {
      const userContext = {
        type: 'fdc3.user',
        id: { userId: currentUser.id },
        name: currentUser.name,
        metadata: {
          source: 'idp-app',
          timestamp: new Date().toISOString(),
        },
      };

      addLogEntry('success', 'GetUser Intent Handled', `Returning user context for: ${currentUser.name}`);
      return userContext;
    } else {
      addLogEntry('warning', 'GetUser Intent Failed', 'User not authenticated');
      throw new Error('User not authenticated');
    }
  });
}

// Initialize DOM elements
function initializeDOMElements(): void {
  loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  userInfo = document.getElementById('user-info') as HTMLDivElement;
  userName = document.getElementById('user-name') as HTMLSpanElement;
  statusEl = document.getElementById('status') as HTMLDivElement;
}

// Initialize the application
async function initialize(): Promise<void> {
  // Initialize DOM elements first
  initializeDOMElements();

  // Initialize FDC3
  await initializeFDC3();

  // Check authentication status
  await checkAuthStatus();

  // Set up event listeners
  if (loginBtn) loginBtn.addEventListener('click', login);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  addLogEntry('info', 'IDP App Initialized', 'Application ready');
}

// Make functions available globally for HTML event handlers
(window as any).clearLog = clearLog;
(window as any).updateStatus = updateStatus;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
