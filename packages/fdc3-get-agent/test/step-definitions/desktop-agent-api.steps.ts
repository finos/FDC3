import { When } from '@cucumber/cucumber';
import { handleResolve } from '@finos/testing';
import { CustomWorld } from '../world/index.js';
import { DesktopAgent } from '@finos/fdc3-standard';
import { Instrument } from '@finos/fdc3-context';

When(
  'I call broadcast with an fdc3.instrument context on {string} and allow 3 seconds',
  { timeout: 3 * 1000 },
  // for testing API timeouts the Mock server sets a 1 second timeout
  // if that is ignored it defaults to 10 seconds so test should timeout and catch that
  async function (this: CustomWorld, field: string) {
    //Note that broadcast is a noop unless you are currently joined to a channel
    try {
      const da: DesktopAgent = handleResolve(field, this);
      const instrument: Instrument = {
        type: 'fdc3.instrument',
        id: { ticker: 'MSFT' },
        name: 'microsoft',
      };
      const result = await da.broadcast(instrument);
      this.props['result'] = result;
      this.log('Received non-error result: ' + JSON.stringify(result));
    } catch (error) {
      this.props['result'] = error;
      this.log('Received error with message: ' + ((error as Error).message ?? error));
    }
  }
);

When(
  'I call open with appId {string} on {string} and allow 3 seconds',
  { timeout: 3 * 1000 },
  // for testing app launch timeouts the Mock server sets a 2 second timeout
  // if that is ignored it defaults to 100 seconds so test should timeout and catch that
  async function (this: CustomWorld, appId: string, field: string) {
    try {
      const da: DesktopAgent = handleResolve(field, this);
      const result = await da.open({ appId: appId });
      this.props['result'] = result;
      this.log('Received non-error result: ' + JSON.stringify(result));
    } catch (error) {
      this.props['result'] = error;
      this.log('Received error with message: ' + ((error as Error).message ?? error));
    }
  }
);
