import { When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { Logger } from '../../src/util/Logger.js';
import { createUUID } from '../../src/util/Uuid.js';

const TEST_ERROR = 'Test error - This is expected on the console';

When('All log functions are used with a message', async (world: CustomWorld) => {
  Logger.debug('Debug msg');
  Logger.log('Log msg');
  Logger.warn('Warning msg');
  Logger.error('Error msg');
});

When('All log functions are used with an error', async (world: CustomWorld) => {
  Logger.debug('debug-level error: ', new Error(TEST_ERROR));
  Logger.log('log-level error: ', new Error(TEST_ERROR));
  Logger.warn('warn-level error: ', new Error(TEST_ERROR));
  Logger.error('error-level error: ', new Error(TEST_ERROR));
});

When('A uuid is generated', async (world: CustomWorld) => {
  return createUUID();
});
