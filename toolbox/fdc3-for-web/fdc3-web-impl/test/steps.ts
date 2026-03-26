// Main step definitions entry point for quickpickle
// This file is loaded by vitest as a setupFile

import { setWorldConstructor } from 'quickpickle';
import { CustomWorld } from './world/index.js';

// Set up the world constructor
setWorldConstructor(CustomWorld);

// Import all step definitions
import './step-definitions/generic.steps.js';
import './step-definitions/app-channel.steps.js';
import './step-definitions/broadcast.steps.js';
import './step-definitions/event-listeners.steps.js';
import './step-definitions/heartbeat.steps.js';
import './step-definitions/intents.steps.js';
import './step-definitions/messaging.steps.js';
import './step-definitions/private-channel.steps.js';
import './step-definitions/start-app.steps.js';
import './step-definitions/user-channel.steps.js';
