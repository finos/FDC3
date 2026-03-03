// Main step definitions entry point for quickpickle
// This file is loaded by vitest as a setupFile

import { setWorldConstructor } from 'quickpickle';
import { CustomWorld } from './world/index.js';

// Set up the world constructor
setWorldConstructor(CustomWorld);

// Import all step definitions
import './step-definitions/generic.steps.js';
import './step-definitions/channels.steps.js';
import './step-definitions/channelSelector.steps.js';
import './step-definitions/intents.steps.js';
import './step-definitions/util.steps.js';
