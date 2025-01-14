import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { Logger } from '../../src/util/Logger';
import { createUUID } from '../../src/util/Uuid';

const TEST_ERROR = 'Test error - This is expected on the console';

Given('All log functions are used with a message', async function (this: CustomWorld) {
  Logger.debug('Debug msg');
  Logger.log('Log msg');
  Logger.warn('Warning msg');
  Logger.error('Error msg');
});

Given('All log functions are used with an error', async function (this: CustomWorld) {
  Logger.debug(new Error(TEST_ERROR));
  Logger.log(new Error(TEST_ERROR));
  Logger.warn(new Error(TEST_ERROR));
  Logger.error(new Error(TEST_ERROR));
});

Given('A uuid is generated', async function (this: CustomWorld) {
  return createUUID();
});
