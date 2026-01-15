// Main step definitions entry point for quickpickle
// This file is loaded by vitest as a setupFile

import { setWorldConstructor } from 'quickpickle';
import { CustomWorld } from './world/index.js';

// Set up the world constructor
setWorldConstructor(CustomWorld);

// Import all step definitions
import './step-definitions/generic.steps.js';
import './step-definitions/channel-selector.steps.js';
import './step-definitions/desktop-agent-api.steps.js';
import './step-definitions/desktop-agent.steps.js';
import './step-definitions/intent-resolver.steps.js';
import './step-definitions/port-creation.steps.js';
import './step-definitions/util.steps.js';
