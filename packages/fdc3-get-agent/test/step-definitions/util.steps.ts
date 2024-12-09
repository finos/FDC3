import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { Logger } from '../../src/util/Logger';
import { createUUID } from '../../src/util/Uuid';

Given('All log functions are used with a message', async function (this: CustomWorld) {
	Logger.debug('Debug msg');
	Logger.log('Log msg');
	Logger.warn('Warning msg');
	Logger.error('Error msg');
  });

  Given('All log functions are used without a message', async function (this: CustomWorld) {
	Logger.debug(new Error("Test error"));
	Logger.log(new Error("Test error"));
	Logger.warn(new Error("Test error"));
	Logger.error(new Error("Test error"));
  });

Given('A uuid is generated', async function (this: CustomWorld) {
  return createUUID();
});
