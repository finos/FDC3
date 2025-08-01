// IDP App Client Implementation
import { DesktopAgent, getAgent, Context, ContextMetadata } from '@finos/fdc3';
import { createLogEntry, updateStatus, clearLog } from '../../../app1/common/src/logging';

// Authentication state
let isAuthenticated = false;
let currentUser: { id: string; name: string } | null = null;

// DOM elements - will be initialized after DOM is loaded
let loginBtn: HTMLButtonElement | null = null;
let logoutBtn: HTMLButtonElement | null = null;
let userInfo: HTMLDivElement | null = null;
let userName: HTMLSpanElement | null = null;

// Check authentication status on page load
async function checkAuthStatus(): Promise<void> {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();

    if (data.isAuthenticated) {
      isAuthenticated = true;
      currentUser = data.user;
      showAuthenticatedState();
      createLogEntry('info', 'User authenticated', `Logged in as: ${currentUser?.name} (${currentUser?.id})`);
    } else {
      isAuthenticated = false;
      currentUser = null;
      showUnauthenticatedState();
      createLogEntry('info', 'User not authenticated', 'Please log in to continue');
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    createLogEntry('error', 'Authentication check failed', (error as Error).message);
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
      createLogEntry('success', 'Login successful', `Welcome, ${currentUser?.name}!`);
    } else {
      createLogEntry('error', 'Login failed', 'Failed to authenticate user');
    }
  } catch (error) {
    console.error('Login error:', error);
    createLogEntry('error', 'Login error', (error as Error).message);
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
      createLogEntry('info', 'Logout successful', 'You have been logged out');
    } else {
      createLogEntry('error', 'Logout failed', 'Failed to log out');
    }
  } catch (error) {
    console.error('Logout error:', error);
    createLogEntry('error', 'Logout error', (error as Error).message);
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

      createLogEntry('success', 'GetUser Intent Handled', `Returning user context for: ${currentUser.name}`);
      return userContext;
    } else {
      createLogEntry('warning', 'GetUser Intent Failed', 'User not authenticated');
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

  createLogEntry('info', 'IDP App Initialized', 'Application ready');
}

// Make functions available globally for HTML event handlers
(window as any).clearLog = clearLog;
(window as any).updateStatus = updateStatus;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
