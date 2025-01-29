import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { Logger } from '../../src/util/Logger';
import { createUUID } from '../../src/util/Uuid';

const TEST_ERROR = 'Test error - This is expected on the console';

When('All log functions are used with a message', async function (this: CustomWorld) {
  Logger.debug('Debug msg');
  Logger.log('Log msg');
  Logger.warn('Warning msg');
  Logger.error('Error msg');
});

When('All log functions are used with an error', async function (this: CustomWorld) {
  Logger.debug('debug-level error: ', new Error(TEST_ERROR));
  Logger.log('log-level error: ', new Error(TEST_ERROR));
  Logger.warn('warn-level error: ', new Error(TEST_ERROR));
  Logger.error('error-level error: ', new Error(TEST_ERROR));
});

When('A uuid is generated', async function (this: CustomWorld) {
  return createUUID();
});
