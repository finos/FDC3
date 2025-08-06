// IDP App Client Implementation
import { DesktopAgent, getAgent, Context, ContextMetadata } from '@finos/fdc3';
import { createLogEntry, updateStatus, clearLog } from '../../../app1/common/src/logging';
import { checkSessionStatus, setupSessionStatusButton, logout } from '../../../app1/common/src/session';

// Authentication state
let isAuthenticated = false;
let currentUser: { id: string; name: string } | null = null;

// DOM elements - will be initialized after DOM is loaded
let loginBtn: HTMLButtonElement | null = null;
let logoutBtn: HTMLButtonElement | null = null;
let userInfo: HTMLDivElement | null = null;
let userName: HTMLSpanElement | null = null;

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
      createLogEntry('success', 'Login successful', `Welcome, ${currentUser?.name}!`);

      // Check session status after login to update UI
      await checkSessionStatus();
    } else {
      createLogEntry('error', 'Login failed', 'Failed to authenticate user');
    }
  } catch (error) {
    console.error('Login error:', error);
    createLogEntry('error', 'Login error', (error as Error).message);
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

// FDC3 Integration
async function initializeFDC3(): Promise<void> {
  try {
    updateStatus('connecting', 'Connecting to FDC3...');

    // Get the Desktop Agent
    const agent = await getAgent();

    updateStatus('connected', 'Connected to FDC3');
    createLogEntry('success', 'FDC3 Connected', 'Successfully connected to FDC3 Desktop Agent');

    // Set up event listeners for FDC3 events
    setupFDC3Listeners(agent);
  } catch (error) {
    console.error('FDC3 connection error:', error);
    updateStatus('error', 'FDC3 Connection Failed');
    createLogEntry('error', 'FDC3 Connection Failed', (error as Error).message);
  }
}

// Setup FDC3 event listeners
function setupFDC3Listeners(agent: DesktopAgent): void {
  // Listen for GetUser intent events
  agent.addIntentListener('GetUser', async (context: Context, metadata: ContextMetadata | undefined) => {
    createLogEntry('info', 'GetUser Intent Received', JSON.stringify(context, null, 2));

    try {
      // Call the backend endpoint to get user information
      const response = await fetch('/api/getuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: context,
          metadata: metadata,
        }),
      });

      const data = await response.json();

      if (data.success && data.context) {
        createLogEntry(
          'success',
          'GetUser Intent Handled',
          `Returning user context from backend for: ${data.context.name}`
        );
        return data.context;
      } else {
        createLogEntry('error', 'GetUser Intent Failed', data.error || 'Backend returned error');
        throw new Error(data.error || 'Failed to get user from backend');
      }
    } catch (error) {
      console.error('GetUser intent error:', error);
      createLogEntry('error', 'GetUser Intent Error', (error as Error).message);
      throw error;
    }
  });
}

// Initialize DOM elements
function initializeDOMElements(): void {
  loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  userInfo = document.getElementById('user-info') as HTMLDivElement;
  userName = document.getElementById('user-name') as HTMLSpanElement;
}

// Initialize the application
async function initialize(): Promise<void> {
  // Initialize DOM elements first
  initializeDOMElements();

  // Initialize FDC3
  await initializeFDC3();

  // Check session status using the shared function
  try {
    const sessionStatus = await checkSessionStatus();
    // Update local state based on session status
    if (sessionStatus.isAuthenticated) {
      isAuthenticated = true;
      currentUser = sessionStatus.user;
      showAuthenticatedState();
    } else {
      isAuthenticated = false;
      currentUser = null;
      showUnauthenticatedState();
    }
  } catch (error) {
    console.error('Failed to check session status:', error);
    // Default to unauthenticated state if session check fails
    showUnauthenticatedState();
  }

  // Set up event listeners
  if (loginBtn) loginBtn.addEventListener('click', login);
  if (logoutBtn)
    logoutBtn.addEventListener('click', async () => {
      try {
        await logout();
        // Update local state after logout
        isAuthenticated = false;
        currentUser = null;
        showUnauthenticatedState();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    });

  // Setup session status button using shared module
  setupSessionStatusButton();

  createLogEntry('info', 'IDP App Initialized', 'Application ready');
}

// Make functions available globally for HTML event handlers
(window as any).clearLog = clearLog;
(window as any).updateStatus = updateStatus;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
